function logX(){console.log.apply(this, Array.prototype.slice.call(arguments, 0));};

import { validateTimeString } from './Misc.js';
import { Record } from './Record.js';

export class RecordStorage {
	#properties;
	constructor(){
		(async (rs)=>{
			const prop_result = await chrome.storage.sync.get(['ScheduleBlock_Properties']);
			rs.setGeneralProperties(
					(prop_result && prop_result.ScheduleBlock_Properties ?
						prop_result.ScheduleBlock_Properties 
						: {Language:"english", CheckFrequency:15, Background:"#808080"}),
					true);
			
		})(this);
	}
	
	/**
	 * Validates settings JSON
	 * @param {string} jsonString
	 */
	validateExportedJSON(jsonString){
		if(!jsonString){
			console.log("Settings empty or generally invalid");
			return false;
		}
		
		let arr = null;
		
		try{
			arr = Record.fromJSON(jsonString);
		}catch{
			console.log("Settings could not be parsed by JSON parser");
			return false;
		}
		
		//console.log(arr);
		
		if(!(arr instanceof Array)){
			console.log("Settings do not parse into array");
			return false;
		}
		
		for(let ii = 0; ii < arr.length; ++ii){
			if(!validateTimeString(arr[ii].getSoftHours())){
				console.log("Settings invalid at record {0}, soft locked time is invalid".format(ii+1));
				return false;
			}
			if(!validateTimeString(arr[ii].getHardHours())){
				console.log("Settings invalid at record {0}, hard locked time is invalid".format(ii+1));
				return false;
			}
		}
		
		return true;
	}
	
	/**
	 * Imports previously exported settings, reloads table.
	 * @param {string} jsonString - JSON representation of settings to be loaded
	 */
	async importSettings(jsonString, extraCallback = ()=>{}){
		let __callback = async (result) => {
			if(jsonString){
				await chrome.storage.sync.set({websites:jsonString});
				extraCallback();
			}		
		};
		
		if(!this.validateExportedJSON(jsonString)) return false;
		
		await chrome.storage.sync.get(['websites'], __callback);
	}
	
	/**
	 * Exports settings for later import.
	 */
	async exportSettings(){
		let result = await chrome.storage.sync.get(['websites']);
		
		return result;
	}
	
	
	async getGeneralProperties(){
		return this.#properties;
	}
	
	async setGeneralProperties(newProperties, skipStorage = false){
		this.#properties = newProperties;
		if(!skipStorage)
			await chrome.storage.sync.set({ScheduleBlock_Properties: newProperties});
	}
	
	
	
	
	async getAll(){
		const result = await chrome.storage.sync.get(['websites']);
		
		return (result && result.websites ? Record.fromJSON(result.websites) : []);
	}
	
	async getOne(recordNumber){
		const result = await chrome.storage.sync.get(['websites']);
		
		const arr = (result && result.websites ? Record.fromJSON(result.websites) : []);
		
		if(recordNumber >= arr.length) return null;
		
		return arr[recordNumber];
	}
		
	async createNewRecord(regularExpression){
		let result = await chrome.storage.sync.get(['websites']);
		let arr = (result && result.websites ? Record.fromJSON(result.websites) : []);
		
		arr.push((new Record()).withRegex(regularExpression));
			
		await chrome.storage.sync.set({websites:Record.toJSON(arr)});
	}
	
	async moveRecord(recordNumber, newRecordNumber){
		const result = await chrome.storage.sync.get(['websites']);
		
		let arr = (result && result.websites ? Record.fromJSON(result.websites) : []);
		
		if(recordNumber >= arr.length) return false;
		
		if(newRecordNumber < 0) newRecordNumber = 0;
		let tmp = arr.splice(recordNumber, 1);
		arr.splice(newRecordNumber, 0, tmp[0]);
		
		await chrome.storage.sync.set({websites:Record.toJSON(arr)});
	}
	
	async editRecord(recordNumber, newValue){
		const result = await chrome.storage.sync.get(['websites']);
		
		let arr = (result && result.websites ? Record.fromJSON(result.websites) : []);
		
		if(recordNumber >= arr.length) return;
		
		arr[recordNumber] = newValue;
	
		await chrome.storage.sync.set({websites:Record.toJSON(arr)});
	}
	
	async deleteRecord(recordNumber){
		const result = await chrome.storage.sync.get(['websites']);
		
		let arr = (result && result.websites ? Record.fromJSON(result.websites) : []);
		if(arr.length == 0) return;
		
		arr.splice(recordNumber, 1);
		
		await chrome.storage.sync.set({websites:Record.toJSON(arr)});
	}
	
	async testWebsite(urlAddress, softCheck){
		let updatedElements = {};
		let interval = this.#properties.CheckFrequency * 1000;
		let nowDate = new Date();
			
		function timeoutLogic(record, ii){
			
			let sinceLastCheck = Math.min(nowDate.getTime()
												- record.getLastCheck().getTime(),
										  interval);
			
			if(record.getCurrentDuration() + sinceLastCheck < record.getNormalBreak() * 1000 &&
				nowDate.getTime() > record.getLastCheck().getTime() &&
				nowDate.getTime() < record.getLastCheck().getTime()
										+ record.getNormalTimeout() * 1000){
				// If timeout didn't pass since last visit
				//	and currentStreak is less than allowed time,
				// 	increment current streak
				updatedElements[ii] = record.withCurrentDuration(
												record.getCurrentDuration()	+ sinceLastCheck )
											.withLastCheck(nowDate);
											
			}else if(nowDate.getTime()
						>= record.getLastCheck().getTime() + record.getNormalTimeout() * 1000){
				// If timeout did pass since last visit
				//	reset current streak
				updatedElements[ii] = record.withCurrentDuration(0).withLastCheck(nowDate);
				
			}else if(record.getCurrentDuration() + sinceLastCheck
						>= record.getNormalBreak() * 1000){
				if(record.getCurrentDuration() < record.getNormalBreak() * 1000){
					updatedElements[ii] = record.withCurrentDuration(
												record.getCurrentDuration()	+ sinceLastCheck )
											.withLastCheck(nowDate);
				}
				
				// Otherwise if current streak is more or equal to allowed time, deny entry
				return true;
			}
							
			return false;
		}
		
		function forbidLogic(id, record){
			//logJ(record.getRegex());	
			if(!(record.getRegex()) || !(record.getDestination())){
				// If record does not have property 'regex' or 'destination', skip it
				return false;
			}

			if(!(urlAddress.match(new RegExp(record.getRegex()))))
				return false; // If regex does not match, skip record

			if(timeoutLogic(record, id)){
				return record.getDestination();
			}

			if((!softCheck && !record.getHardHours()) || (softCheck && !record.getSoftHours())){
				return false; // Record does not have property to check time
			}
							
			let days = (softCheck ? record.getSoftHours() : record.getHardHours()).split("|");
			let dayno = (d.getDay() % days.length);
			let intervals = days[dayno].split(",");
			
			for(let jj = 0; jj < intervals.length; ++jj){
				let times = intervals[jj].split("-");
				
				if(times.length != 2){
					// This implies interval does not have exactly one '-', so just skip it
					continue;
				}
					
				let time0 = times[0].split(":");
				let time1 = times[1].split(":");
				
				let begind = new Date();
				let endd = new Date();
				
				begind.setHours(time0[0]);
				begind.setMinutes(time0[1]);
				endd.setHours(time1[0]);
				endd.setMinutes(time1[1]);
				
				if(begind > nowDate || nowDate >= endd){
					// Interval is valid but does not match, continue to the next one
					continue;
				}
				
				// Interval is valid and matches, therefore return destination
				return record.getDestination();
			}
			
			return false;
		}
		
		
		const result = await chrome.storage.sync.get(['websites']);
		let arr = (result && result.websites ? Record.fromJSON(result.websites) : []);
		
		let destination = false;
		for(let ii = 0; ii < arr.length && destination == false; ++ii){
			destination = forbidLogic(ii, arr[ii]);
		}
		
		for(let key in updatedElements){
			arr[key] = updatedElements[key];
		}
		
		await chrome.storage.sync.set({websites:Record.toJSON(arr)});
		
		return destination;
	}
		
		

}

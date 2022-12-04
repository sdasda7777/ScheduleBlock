function logX(){console.log.apply(this, Array.prototype.slice.call(arguments, 0));};

import { timeToInt, validateTimeString } from './Misc.js';
import { Record } from './Record.js';

function storageProvider(){return (typeof browser == 'undefined' ? chrome : browser);}

export class RecordStorage {
	#properties;
	constructor(){}
	
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
	async importSettings(jsonString){
		//logX("importSettings('" + jsonString + "') called");
		
		if(!this.validateExportedJSON(jsonString)) return false;
				
		//await storageProvider().storage.local.get(['ScheduleBlock_Websites']);
		await storageProvider().storage.local.set({ScheduleBlock_Websites:jsonString});
	}
	
	/**
	 * Exports settings for later import.
	 */
	async exportSettings(){
		let websites_res = await storageProvider().storage.local.get(['ScheduleBlock_Websites']);
		let websites_safe = (websites_res && websites_res.ScheduleBlock_Websites
								? JSON.parse(websites_res.ScheduleBlock_Websites)
								: []);
		
		for(let ii = 0; ii < websites_safe.length; ++ii){
			delete websites_safe[ii].currentDuration;
			delete websites_safe[ii].lastCheck;
		}
		
		return JSON.stringify(websites_safe);
	}
	
	
	async getGeneralProperties(){
		if(this.#properties === undefined){
			const res = await storageProvider().storage.local.get(['ScheduleBlock_Properties']);
			this.#properties = (res && res.ScheduleBlock_Properties
									? res.ScheduleBlock_Properties 
						: {Language:"english", CheckFrequency:15, Background:"#808080"});
		}
		
		return this.#properties;
	}
	
	async setGeneralProperties(newProperties, skipStorage = false){
		this.#properties = newProperties;
		if(!skipStorage)
			await storageProvider().storage.local.set({ScheduleBlock_Properties: newProperties});
	}
	
	
	
	
	async getAll(){		
		const result = await storageProvider().storage.local.get(['ScheduleBlock_Websites']);
		
		return (result && result.ScheduleBlock_Websites 
					? Record.fromJSON(result.ScheduleBlock_Websites) : []);
	}
	
	async getOne(recordNumber){
		const result = await storageProvider().storage.local.get(['ScheduleBlock_Websites']);
		
		const arr = (result && result.ScheduleBlock_Websites
						? Record.fromJSON(result.ScheduleBlock_Websites) : []);
		
		if(recordNumber >= arr.length) return null;
		
		return arr[recordNumber];
	}
		
	async createNewRecord(regularExpression){
		let result = await storageProvider().storage.local.get(['ScheduleBlock_Websites']);
		let arr = (result && result.ScheduleBlock_Websites
						? Record.fromJSON(result.ScheduleBlock_Websites) : []);
		
		arr.push((new Record()).withRegex(regularExpression));
			
		await storageProvider().storage.local.set({ScheduleBlock_Websites:Record.toJSON(arr)});
	}
	
	async moveRecord(recordNumber, newRecordNumber){
		const result = await storageProvider().storage.local.get(['ScheduleBlock_Websites']);
		
		let arr = (result && result.ScheduleBlock_Websites
						? Record.fromJSON(result.ScheduleBlock_Websites) : []);
		
		if(recordNumber >= arr.length) return false;
		
		if(newRecordNumber < 0) newRecordNumber = 0;
		let tmp = arr.splice(recordNumber, 1);
		arr.splice(newRecordNumber, 0, tmp[0]);
		
		await storageProvider().storage.local.set({ScheduleBlock_Websites:Record.toJSON(arr)});
	}
	
	async editRecord(recordNumber, newValue){
		const result = await storageProvider().storage.local.get(['ScheduleBlock_Websites']);
		
		let arr = (result && result.ScheduleBlock_Websites
						? Record.fromJSON(result.ScheduleBlock_Websites) : []);
		
		if(recordNumber >= arr.length) return;
		
		arr[recordNumber] = newValue;
	
		await storageProvider().storage.local.set({ScheduleBlock_Websites:Record.toJSON(arr)});
	}
	
	async deleteRecord(recordNumber){
		const result = await storageProvider().storage.local.get(['ScheduleBlock_Websites']);
		
		let arr = (result && result.ScheduleBlock_Websites
						? Record.fromJSON(result.ScheduleBlock_Websites) : []);
		if(arr.length == 0) return;
		
		arr.splice(recordNumber, 1);
		
		await storageProvider().storage.local.set({ScheduleBlock_Websites:Record.toJSON(arr)});
	}
	
	async testWebsite(urlAddress, softCheck){
		let updatedElements = {};
		let interval = (await this.getGeneralProperties()).CheckFrequency * 1000;
		let nowDate = new Date();
		
		function timeoutIncrementCheck(id, record, normalBreak, normalTimeout){
			
			let sinceLastCheck = Math.min(nowDate.getTime()
												- record.getLastCheck().getTime(),
										  interval);
			
			if(record.getCurrentDuration() + sinceLastCheck < normalBreak * 1000 &&
				nowDate.getTime() > record.getLastCheck().getTime() &&
				nowDate.getTime() < record.getLastCheck().getTime()
										+ normalTimeout * 1000){
				// If timeout didn't pass since last visit
				//	and currentStreak is less than allowed time,
				// 	increment current streak
				updatedElements[id] = record.withCurrentDuration(
												record.getCurrentDuration()	+ sinceLastCheck )
											.withLastCheck(nowDate);
											
			}else if(nowDate.getTime()
						>= record.getLastCheck().getTime() + normalTimeout * 1000){
				// If timeout did pass since last visit
				//	reset current streak
				updatedElements[id] = record.withCurrentDuration(0).withLastCheck(nowDate);
				
			}else if(record.getCurrentDuration() + sinceLastCheck >= normalBreak * 1000){
				if(record.getCurrentDuration() < normalBreak * 1000){
					updatedElements[id] = record.withCurrentDuration(
												record.getCurrentDuration()	+ sinceLastCheck )
											.withLastCheck(nowDate);
				}
				
				// Otherwise if current streak is more or equal to allowed time, deny entry
				return record.getAction();
			}
			
			return false;
		}
		
		
		function timeoutLogic(id, record){
			//logJ(record.getRegex());	
			if(!(record.getRegex()) || !(record.getAction()) || !(record.getTimeout())){
				// If record does not have property 'regex' or 'destination', skip it
				return false;
			}

			if(!(urlAddress.match(new RegExp(record.getRegex()))))
				return false; // If regex does not match, skip record
							
			let days = record.getTimeout().split("|");
			let dayno = (nowDate.getDay() % days.length);
			let groups = days[dayno].split(",");
			
			for(let ii = 0; ii < groups.length; ++ii){
				let groupParts = groups[ii].split("@");
				if(groupParts.length > 2) continue;
				
				let durations = groupParts[0].split("/");
				if(durations.length != 2) continue;
				
				let normalBreak = timeToInt(durations[0]);
				let normalTimeout = timeToInt(durations[1]);
				
				if(groupParts.length == 1){
					let res = timeoutIncrementCheck(id, record, normalBreak, normalTimeout);
					if(res !== false) return res;
					else continue;
				}
				
				let intervals = groupParts[1].split(";");
				
				for(let jj = 0; jj < intervals.length; ++jj){
					console.log(intervals[jj]);
					
					let times = intervals[jj].split("-");
					
					if(times.length != 2) continue;
					
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
					
					// Interval is valid and matches, therefore check time
					let res = timeoutIncrementCheck(id, record, normalBreak, normalTimeout);
					if(res !== false) return res;
					else break;
				}
			}
			
			return false;
		}
		
		function forbidLogic(id, record){
			//logJ(record.getRegex());	
			if(!(record.getRegex()) || !(record.getAction())){
				// If record does not have property 'regex' or 'destination', skip it
				return false;
			}

			if(!(urlAddress.match(new RegExp(record.getRegex()))))
				return false; // If regex does not match, skip record

			if((!softCheck && !record.getHardHours()) || (softCheck && !record.getSoftHours())){
				return false; // Record does not have property to check time
			}
							
			let days = (softCheck ? record.getSoftHours() : record.getHardHours()).split("|");
			let dayno = (nowDate.getDay() % days.length);
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
				return record.getAction();
			}
			
			return false;
		}
		
		
		const result = await storageProvider().storage.local.get(['ScheduleBlock_Websites']);
		let arr = (result && result.ScheduleBlock_Websites
						? Record.fromJSON(result.ScheduleBlock_Websites) : []);
		
		let destination = false;
		for(let ii = 0;
			ii < arr.length && 
			(destination = timeoutLogic(ii, arr[ii])) === false &&
			(destination = forbidLogic(ii, arr[ii])) === false;
			++ii);
		
		for(let key in updatedElements){
			//TODO: refactor this bit away when improving effectivity
			arr[key] = updatedElements[key];
		}
		
		await storageProvider().storage.local.set({ScheduleBlock_Websites:Record.toJSON(arr)});
		
		return destination;
	}
}

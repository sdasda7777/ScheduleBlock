function logX(){console.log.apply(this, Array.prototype.slice.call(arguments, 0));};

import { validateTimeString, validateTimeoutString } from './Misc.js';
import { Record } from './Record.js';

export class RecordStorage {
	#properties;
	#storageProvider;
	
	constructor(storageProvider = (typeof browser == 'undefined' ? chrome : browser)){
		this.#storageProvider = storageProvider;
	}
	
	/**
	 * Validates settings JSON
	 * @param {string} jsonString
	 */
	validateExportedJSON(jsonString){
		if(!jsonString){
			return "Settings file is empty or generally invalid";
		}
		
		let arr = null;
		
		try{
			arr = Record.fromJSON(jsonString);
		}catch{
			return "Settings file could not be parsed by JSON parser";
		}
		
		//console.log(arr);
		
		if(!(arr instanceof Array)){
			return "Settings file does not parse into an array";
		}
		
		for(let ii = 0; ii < arr.length; ++ii){
			if(!validateTimeString(arr[ii].getSoftHours())){
				return "Settings invalid at record " + (ii+1) + 
						" (regex '" + arr[ii].getRegex() +
						"'):\nSoft locked time '" + arr[ii].getSoftHours() + "' is invalid";
			}
			if(!validateTimeString(arr[ii].getHardHours())){
				return "Settings invalid at record " + (ii+1) + 
						" (regex '" + arr[ii].getRegex() +
						"'):\nHard locked time '" + arr[ii].getHardHours() + "' is invalid";
			}
			if(!validateTimeoutString(arr[ii].getTimeout())){
				return "Settings invalid at record " + (ii+1) + 
						" (regex '" + arr[ii].getRegex() + 
						"'):\nTimeout string '" + arr[ii].getTimeout() + "' is invalid";
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
		let valid = this.validateExportedJSON(jsonString);
		if(valid !== true) return valid;
				
		//await storageProvider().storage.local.get(['ScheduleBlock_Websites']);
		await this.#storageProvider.storage.local.set({ScheduleBlock_Websites:jsonString});
		return true;
	}
	
	/**
	 * Exports settings for later import.
	 */
	async exportSettings(){
		let websites_res = await this.#storageProvider
									.storage.local.get(['ScheduleBlock_Websites']);
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
			const res = await this.#storageProvider
								.storage.local.get(['ScheduleBlock_Properties']);
			this.#properties = (res && res.ScheduleBlock_Properties
									? res.ScheduleBlock_Properties 
						: {Language:"english", CheckFrequency:15, Background:"#808080"});
		}
		
		return this.#properties;
	}
	
	async setGeneralProperties(newProperties, skipStorage = false){
		this.#properties = newProperties;
		if(!skipStorage)
			await this.#storageProvider
					.storage.local.set({ScheduleBlock_Properties: newProperties});
	}
	
	
	
	
	async getAll(){		
		const result = await this.#storageProvider
								.storage.local.get(['ScheduleBlock_Websites']);
		
		return (result && result.ScheduleBlock_Websites 
					? Record.fromJSON(result.ScheduleBlock_Websites) : []);
	}
	
	async getOne(recordNumber){
		const result = await this.#storageProvider
								.storage.local.get(['ScheduleBlock_Websites']);
		
		const arr = (result && result.ScheduleBlock_Websites
						? Record.fromJSON(result.ScheduleBlock_Websites) : []);
		
		if(recordNumber >= arr.length) return null;
		
		return arr[recordNumber];
	}
		
	async createNewRecord(regularExpression){
		let result = await this.#storageProvider.storage.local.get(['ScheduleBlock_Websites']);
		let arr = (result && result.ScheduleBlock_Websites
						? Record.fromJSON(result.ScheduleBlock_Websites) : []);
		
		arr.push((new Record()).withRegex(regularExpression));
			
		await this.#storageProvider
				.storage.local.set({ScheduleBlock_Websites:Record.toJSON(arr)});
	}
	
	async moveRecord(recordNumber, newRecordNumber){
		const result = await this.#storageProvider.storage.local.get(['ScheduleBlock_Websites']);
		
		let arr = (result && result.ScheduleBlock_Websites
						? Record.fromJSON(result.ScheduleBlock_Websites) : []);
		
		if(recordNumber >= arr.length) return false;
		
		if(newRecordNumber < 0) newRecordNumber = 0;
		let tmp = arr.splice(recordNumber, 1);
		arr.splice(newRecordNumber, 0, tmp[0]);
		
		await this.#storageProvider
				.storage.local.set({ScheduleBlock_Websites:Record.toJSON(arr)});
	}
	
	async editRecord(recordNumber, newValue){
		const result = await this.#storageProvider.storage.local.get(['ScheduleBlock_Websites']);
		
		let arr = (result && result.ScheduleBlock_Websites
						? Record.fromJSON(result.ScheduleBlock_Websites) : []);
		
		if(recordNumber >= arr.length) return false;
		
		arr[recordNumber] = newValue;
	
		await this.#storageProvider
				.storage.local.set({ScheduleBlock_Websites:Record.toJSON(arr)});
	}
	
	async deleteRecord(recordNumber){
		const result = await this.#storageProvider.storage.local.get(['ScheduleBlock_Websites']);
		
		let arr = (result && result.ScheduleBlock_Websites
						? Record.fromJSON(result.ScheduleBlock_Websites) : []);
		if(arr.length == 0) return false;
		
		arr.splice(recordNumber, 1);
		
		await this.#storageProvider
				.storage.local.set({ScheduleBlock_Websites:Record.toJSON(arr)});
	}
	
	
	async testWebsite(urlAddress, softCheck){
		let updatedElements = {};
		let checkInterval = (await this.getGeneralProperties()).CheckFrequency * 1000;
		let nowDate = new Date();
		
		const result = await this.#storageProvider.storage.local.get(['ScheduleBlock_Websites']);
		let arr = (result && result.ScheduleBlock_Websites
						? Record.fromJSON(result.ScheduleBlock_Websites) : []);
		
		let testResult = false;
		for(let ii = 0; ii < arr.length && testResult === false; ++ii){
			testResult = arr[ii].testWebsite(urlAddress, softCheck, nowDate);
			
			let incremented = arr[ii].getIncrementedTimeout(urlAddress, nowDate, checkInterval);
			if(incremented !== false)
				arr[ii] = incremented;
		}
				
		await this.#storageProvider.storage.local.set({ScheduleBlock_Websites:Record.toJSON(arr)});
		
		return (testResult === false ? false : testResult[1]);
	}
	
	async getWebsiteUnlockTime(urlAddress){	
		let updatedElements = {};
		let checkInterval = (await this.getGeneralProperties()).CheckFrequency * 1000;
		let nowDate = new Date();
		
		const result = await this.#storageProvider.storage.local.get(['ScheduleBlock_Websites']);
		let arr = (result && result.ScheduleBlock_Websites
						? Record.fromJSON(result.ScheduleBlock_Websites) : []);
		
		let maxResult = new Date(nowDate.getTime() - 1);
		
		let testResult = false;
		for(let ii = 0; ii < arr.length; ++ii){
			testResult = arr[ii].testWebsite(urlAddress, true, nowDate);
			
			if(testResult !== false && testResult[0] > maxResult){
				maxResult = testResult[0];
			}
		}
		
		return maxResult;
	}
}

function logX(){console.log.apply(this, Array.prototype.slice.call(arguments, 0));};

class RecordStorage {
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
			arr = JSON.parse(jsonString);
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
			if(arr[ii].regex == undefined || typeof arr[ii].regex != "string"){
				console.log("Settings invalid at record {0}, regular expression is invalid".format(ii+1));
				return false;
			}
			if(arr[ii].softhours == undefined || typeof arr[ii].softhours != "string" ||
					!validateTimeString(arr[ii].softhours)){
				console.log("Settings invalid at record {0}, soft locked time is invalid".format(ii+1));
				return false;
			}
			if(arr[ii].hardhours == undefined || typeof arr[ii].hardhours != "string"  ||
					!validateTimeString(arr[ii].hardhours)){
				console.log("Settings invalid at record {0}, hard locked time is invalid".format(ii+1));
				return false;
			}
			if(arr[ii].destination == undefined || typeof arr[ii].destination != "string"){
				console.log("Settings invalid at record {0}, destination url is invalid".format(ii+1));
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
		let __callback = (result) => {
			if(jsonString){
				chrome.storage.sync.set({websites:jsonString});
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
		let __callback = (result) => {
			let a = document.createElement("a");
			let file = new Blob([result.websites], {type: 'application/json'});
			a.href = URL.createObjectURL(file);
			a.download = "ScheduleBlockBackup_" + new Date().toISOString().slice(0, 10);
			a.click();
		};
		
		await chrome.storage.sync.get(['websites'], __callback);
	}
	
	
	async forGeneralProperties(callback){
		let __callback = (result) => {
			if(!result || !result.ScheduleBlock_Properties){
				return;
			}
			callback(result.ScheduleBlock_Properties);
		}
		
		await chrome.storage.sync.get(['ScheduleBlock_Properties'], __callback);
		return 0;
	}
	
	async setGeneralProperties(newProperties, extraCallback = ()=>{}){
		let __callback = (result) => {
					
			let res = ( !result || !result.ScheduleBlock_Properties ?
							{} : result.ScheduleBlock_Properties);
			
			for(let key in newProperties){
				res[key] = newProperties[key];
			}

			chrome.storage.sync.set({ScheduleBlock_Properties: res});
			extraCallback();
		}
		
		await chrome.storage.sync.get(['ScheduleBlock_Properties'], __callback);
	}
	
	
	
	
	forEach(callback, callbackFin = ()=>{}){
		//logX("forEach begin");
		
		let __callback = (result) => {
			let arr = (result.websites ? Record.fromJSON(result.websites) : []);
			
			for(let ii = 0; ii < arr.length; ++ii){
				let res = callback(ii, arr[ii]);
				if(res === false){
					break;
				}else if(res === true){
					return;
				}
			}			
			callbackFin(arr);
		}
		
		navigator.locks.request("ScheduleBlock_Websites_Major",
			(lock) => chrome.storage.sync.get(['websites'], __callback));
		
		//logX("forEach end");
	}
	
	forOne(recordNumber, callback){
		//logX("forOne begin");
		
		let __callback = (result) => {
			if(!result.websites) return;
			let arr = Record.fromJSON(result.websites);
			
			if(recordNumber >= arr.length) return;
			
			callback(arr[recordNumber]);
		}
		
		navigator.locks.request("ScheduleBlock_Websites_Major",
			(lock) => chrome.storage.sync.get(['websites'], __callback));
		
		//logX("forOne end");
	}
	
	modifyWhere(predicate, extraCallback = ()=>{}, useMajorLock = true){
		//logX("modifyWhere begin");
		
		let __callback = (result) => {
			//logX("modifyWhere body begin");
			
			if(!result.websites) return;
			let arr = Record.fromJSON(result.websites);
			
			for(let ii = 0; ii < arr.length; ++ii){
				let res = predicate(ii, arr[ii]);
				if(res === false || res == undefined || res == null){
					arr.splice(ii, 1);
					--ii;
				}else{
					arr[ii] = res;
				}
			}
		
			chrome.storage.sync.set({websites:Record.toJSON(arr)});
			extraCallback();
			
			//logX("modifyWhere body end");
		};
		
		if(useMajorLock){
			navigator.locks.request("ScheduleBlock_Websites_Major",
			async (lock) => chrome.storage.sync.get(['websites'], __callback));
		}else{
			navigator.locks.request("ScheduleBlock_Websites_Minor",
			async (lock) => chrome.storage.sync.get(['websites'], __callback));
		}
		
		//logX("modifyWhere end");
	}
	
	createNewRecord(regularExpression, extraCallback = ()=>{}, useMajorLock = true){
		//logX("createNewRecord begin");
		
		let __callback = (result) => {
			let arr = result.websites;
			arr = (arr ? Record.fromJSON(arr) : []);
							
			arr.push((new Record()).withRegex(regularExpression));
			
			chrome.storage.sync.set({websites:Record.toJSON(arr)});
			extraCallback();
		};
		
		if(useMajorLock){
			navigator.locks.request("ScheduleBlock_Websites_Major",
			(lock) => chrome.storage.sync.get(['websites'], __callback));
		}else{
			navigator.locks.request("ScheduleBlock_Websites_Minor",
			(lock) => chrome.storage.sync.get(['websites'], __callback));
		}
		
		//logX("createNewRecord end");
	}
	
	moveRecord(recordNumber, newRecordNumber, extraCallback = ()=>{}, useMajorLock = true){
		//logX("moveRecord begin");
		
		let __callback = (result) => {
			if(!result.websites) return;
		
			let arr = JSON.parse(result.websites);
			
			if(recordNumber >= arr.length) return;
			
			if(newRecordNumber < 0) newRecordNumber = 0;
			let tmp = arr.splice(recordNumber, 1);
			arr.splice(newRecordNumber, 0, tmp[0]);
			
			chrome.storage.sync.set({websites:JSON.stringify(arr)});
			extraCallback();
		};
		
		if(useMajorLock){
			navigator.locks.request("ScheduleBlock_Websites_Major",
			(lock) => chrome.storage.sync.get(['websites'], __callback));
		}else{
			navigator.locks.request("ScheduleBlock_Websites_Minor",
			(lock) => chrome.storage.sync.get(['websites'], __callback));
		}
		
		//logX("moveRecord end");
	}
}
export class Record{
	#regex;
	#softHours;
	#hardHours;
	#timeout;
	#action;
	#normalBreak;
	#currentDuration;
	#lastCheck;
	
	constructor(regex = null, softHours = null, hardHours = null, timeout = null,
					action = null, currentDuration = null, lastCheck = null){
		this.#regex = 			(regex === null ? "" : regex);
		this.#softHours = 		(softHours === null ? "00:00-23:59" : softHours);
		this.#hardHours = 		(hardHours === null ? "00:00-23:59" : hardHours);
		this.#timeout = 		(timeout == null ? "00:01:00/02:00:00" : timeout);
		this.#action =		 	(action === null ? "window.location = 'about:blank';" : action);
		this.#currentDuration = (currentDuration == null ? 0 : currentDuration);
		this.#lastCheck = 		(lastCheck == null ? new Date() : lastCheck);
	}
	
	#copy(){
		let ret = new Record();
		ret.#regex  			= this.#regex;
		ret.#softHours 			= this.#softHours;
		ret.#hardHours 			= this.#hardHours;
		ret.#timeout	 		= this.#timeout;
		ret.#action 			= this.#action;
		ret.#currentDuration 	= this.#currentDuration;
		ret.#lastCheck			= this.#lastCheck;
		return ret;
	}
	
	withRegex(regex){ let ret = this.#copy();
										ret.#regex = regex; return ret;}
	withSoftHours(softHours){ let ret = this.#copy();
										ret.#softHours = softHours; return ret; }
	withHardHours(hardHours){ let ret = this.#copy();
										ret.#hardHours = hardHours; return ret; }
	withTimeout(timeout){ let ret = this.#copy();
										ret.#timeout = timeout; return ret; }
	withAction(action){ let ret = this.#copy();
										ret.#action = action; return ret; }
	withCurrentDuration(currentDuration){ let ret = this.#copy();
										ret.#currentDuration = currentDuration; return ret; }
	withLastCheck(lastCheck){ let ret = this.#copy();
										ret.#lastCheck = lastCheck; return ret; }
	
	getRegex(){return this.#regex;}
	getSoftHours(){return this.#softHours;}
	getHardHours(){return this.#hardHours;}
	getTimeout(){return this.#timeout;}
	getAction(){return this.#action;}
	getCurrentDuration(){return this.#currentDuration;}
	getLastCheck(){return this.#lastCheck;}
	
	static toJSON(recordArray){
		let ret = [];
		
		for(let ii = 0; ii < recordArray.length; ++ii){
			
			ret.push({ regex: 			 recordArray[ii].#regex,
					   softHours:		 recordArray[ii].#softHours,
					   hardHours:		 recordArray[ii].#hardHours,
					   timeout:	 		 recordArray[ii].#timeout,
					   action:		 	 recordArray[ii].#action,
					   currentDuration:  recordArray[ii].#currentDuration,
					   lastCheck: 		 recordArray[ii].#lastCheck
					 });
		}
		
		return JSON.stringify(ret);
	}
	static fromJSON(jsonString){
		let pojos = JSON.parse(jsonString);
		
		let ret = [];
		for(let ii = 0; ii < pojos.length; ++ii){
			ret.push(new Record(pojos[ii].regex,
								pojos[ii].softHours,
								pojos[ii].hardHours,
								pojos[ii].timeout,
								(pojos[ii].action ||  
									pojos[ii].action === ""
									? pojos[ii].action
									: (pojos[ii].destination ?
										"window.location = '"+pojos[ii].destination+"';" : null)),
								pojos[ii].currentDuration,
								new Date(pojos[ii].lastCheck)));
		}
		return ret;
	}
}

class Record{
	#regex;
	#softHours;
	#hardHours;
	#destination;
	#normalBreak;
	#normalTimeout;
	#currentDuration;
	#lastCheck;
	
	constructor(regex = null, softHours = null, hardHours = null, destination = null,
				normalBreak = null, normalTimeout = null, currentDuration = null,
				lastCheck = null){
		this.#regex = 			(regex === null ? "" : regex);
		this.#softHours = 		(softHours === null ? "00:00-23:59" : softHours);
		this.#hardHours = 		(hardHours === null ? "00:00-23:59" : hardHours);
		this.#destination = 	(destination === null ? "about:blank" : destination);
		this.#normalBreak = 	(normalBreak == null ? 0 : normalBreak);
		this.#normalTimeout = 	(normalTimeout == null ? 0 : normalTimeout);
		this.#currentDuration = (currentDuration == null ? 0 : currentDuration);
		this.#lastCheck = 		(lastCheck == null ? new Date() : lastCheck);
	}
	
	#copy(){
		let ret = new Record();
		ret.#regex  			= this.#regex;
		ret.#softHours 			= this.#softHours;
		ret.#hardHours 			= this.#hardHours;
		ret.#destination 		= this.#destination;
		ret.#normalBreak 		= this.#normalBreak;
		ret.#normalTimeout 		= this.#normalTimeout;
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
	withDestination(destination){ let ret = this.#copy();
										ret.#destination = destination; return ret; }
	withNormalBreak(normalBreak){ let ret = this.#copy();
										ret.#normalBreak = normalBreak; return ret; }
	withNormalTimeout(normalTimeout){ let ret = this.#copy();
										ret.#normalTimeout = normalTimeout; return ret; }
	withCurrentDuration(currentDuration){ let ret = this.#copy();
										ret.#currentDuration = currentDuration; return ret; }
	withLastCheck(lastCheck){ let ret = this.#copy();
										ret.#lastCheck = lastCheck; return ret; }
	
	getRegex(){return this.#regex;}
	getSoftHours(){return this.#softHours;}
	getHardHours(){return this.#hardHours;}
	getDestination(){return this.#destination;}
	getNormalBreak(){return this.#normalBreak;}
	getNormalTimeout(){return this.#normalTimeout;}
	getCurrentDuration(){return this.#currentDuration;}
	getLastCheck(){return this.#lastCheck;}
	
	static toJSON(recordArray){
		let ret = [];
		for(let ii = 0; ii < recordArray.length; ++ii){
			ret.push({ regex: 			 recordArray[ii].#regex,
					   softHours:		 recordArray[ii].#softHours,
					   hardHours:		 recordArray[ii].#hardHours,
					   destination:	 	 recordArray[ii].#destination,
					   normalBreak:	 	 recordArray[ii].#normalBreak,
					   normalTimeout:	 recordArray[ii].#normalTimeout,
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
								pojos[ii].destination,
								pojos[ii].normalBreak,
								pojos[ii].normalTimeout,
								pojos[ii].currentDuration,
								new Date(pojos[ii].lastCheck)));
		}
		return ret;
	}
}
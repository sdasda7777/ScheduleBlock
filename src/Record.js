import { timeToInt } from './Misc.js';

export class Record{
	// Class retaining information about a record: one line of directives
	// It should be completely immutable
	
	#regex;
	#softHours;
	#hardHours;
	#timeout;
	#action;
	#currentDuration;
	#lastCheck;
	
	constructor(regex = null, softHours = null, hardHours = null, timeout = null,
					action = null, currentDuration = null, lastCheck = null){
		this.#regex = 			(regex === null ? "" : regex);
		this.#softHours = 		(softHours === null ? "00:00-00:00" : softHours);
		this.#hardHours = 		(hardHours === null ? "00:00-00:00" : hardHours);
		this.#timeout = 		(timeout == null ? "00:01:00/02:00:00" : timeout);
		this.#action =		 	(action === null ? 
									"window.location = 'about:blank';" : action);
		this.#currentDuration = (currentDuration == null ? 0 : currentDuration);
		this.#lastCheck = 		(lastCheck == null ? new Date() : new Date(lastCheck));
	}
	
	// Duplicator
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
	
	// Immutable alternative to setters
	withRegex(regex){
		let ret = this.#copy(); ret.#regex = regex; return ret;
	}
	withSoftHours(softHours){
		let ret = this.#copy(); ret.#softHours = softHours; return ret;
	}
	withHardHours(hardHours){
		let ret = this.#copy(); ret.#hardHours = hardHours; return ret;
	}
	withTimeout(timeout){
		let ret = this.#copy(); ret.#timeout = timeout; return ret;
	}
	withAction(action){
		let ret = this.#copy(); ret.#action = action; return ret;
	}
	withCurrentDuration(currentDuration){
		let ret = this.#copy();	ret.#currentDuration = currentDuration; return ret;
	}
	withLastCheck(lastCheck){
		let ret = this.#copy(); ret.#lastCheck = new Date(lastCheck); return ret;
	}
	
	// Getters
	getRegex(){return this.#regex;}
	getSoftHours(){return this.#softHours;}
	getHardHours(){return this.#hardHours;}
	getTimeout(){return this.#timeout;}
	getAction(){return this.#action;}
	getCurrentDuration(){return this.#currentDuration;}
	getLastCheck(){return this.#lastCheck;}
	
	// Time checking related methods
	calculateNearestHoursAvailability(nowDate, softCheck){
		let defaultAnswer = new Date(nowDate.getTime() - 1);
		
		// 0) check hours can be tested
		if((!softCheck && !this.#hardHours) || (softCheck && !this.#softHours)){
			// If property to check correct time is missing, return time-1
			return defaultAnswer;
		}
		
		// 1) precalculate intervals for the next mod+1 days
		let textDays = (softCheck ? this.#softHours : this.#hardHours).split("|");
		let beginDayNo = (nowDate.getDay() % textDays.length);
		let relevantIntervals = [];
		
		for(let dayIterator = 0; dayIterator < textDays.length + 1; ++dayIterator){
			let baseDayDate = new Date(nowDate);
			baseDayDate.setDate(baseDayDate.getDate() + dayIterator);
			baseDayDate.setSeconds(0);
			
			let textIntervals = textDays[(beginDayNo + dayIterator) % textDays.length].split(",");
			
			for(let jj = 0; jj < textIntervals.length; ++jj){
				let textTimes = textIntervals[jj].split("-");
				
				if(textTimes.length != 2){
					// This implies interval does not have exactly one '-', so just skip it
					continue;
				}
					
				let time0 = textTimes[0].split(":");
				let time1 = textTimes[1].split(":");
				
				let begind = new Date(baseDayDate);
				let endd = new Date(baseDayDate);
				
				begind.setHours(time0[0]);
				begind.setMinutes(time0[1]);
				endd.setHours(time1[0]);
				endd.setMinutes(time1[1]);
				
				if(endd <= begind && endd.getHours() === 0 && endd.getMinutes() === 0)
					endd.setDate(endd.getDate() + 1);
				
				relevantIntervals.push([begind, endd]);
			}
		}
		
		
		// 2) Sort and merge all overlapping intervals
		relevantIntervals.sort((a,b) => (a[0] === b[0] ? 0 : (a[0] > b[0] ? 1 : -1)));
		
		for(let ii = 0; ii < relevantIntervals.length; ++ii){
			while(ii+1 < relevantIntervals.length && 
			relevantIntervals[ii][1] >= relevantIntervals[ii+1][0]){
				let [tmp] = relevantIntervals.splice(ii+1, 1);
				
				if(tmp[1] > relevantIntervals[ii][1])
					relevantIntervals[ii][1] = tmp[1];
			}
		}
		
		// 3) Find last interval which starts before nowDate
		let currentInterval = relevantIntervals.reverse().find(ii => ii[0] <= nowDate);
		
		if(currentInterval === undefined){
			return defaultAnswer;
		}else{
			return currentInterval[1];
		}
	}
	
	calculateNearestTimeoutAvailability(nowDate){
		let defaultAnswer = new Date(nowDate.getTime() - 1);
		
		// 0) Check timeouts can be tested
		if(!(this.#timeout)){
			return defaultAnswer;
		}
		
		// 1) Precalculate intervals for the next mod+1 days
		let textDays = this.#timeout.split("|");
		let beginDayNo = (nowDate.getDay() % textDays.length);
		let relevantIntervals = [];
		
		for(let dayIterator = 0; dayIterator < textDays.length + 1; ++dayIterator){
			let baseDayDate = new Date(nowDate);
			baseDayDate.setDate(baseDayDate.getDate() + dayIterator);
			baseDayDate.setSeconds(0);
			
			let textGroups = textDays[(beginDayNo + dayIterator) % textDays.length].split(",");
			
			for(let ii = 0; ii < textGroups.length; ++ii){
				let textGroupParts = textGroups[ii].split("@");
				if(textGroupParts.length > 2) continue; // That would mean there were 2 @s
				
				let textDurations = textGroupParts[0].split("/");
				if(textDurations.length != 2) continue; // That  would mean there were 2 /s
				
				let normalBreak = timeToInt(textDurations[0]);
				let normalTimeout = timeToInt(textDurations[1]);
				
				if(textGroupParts.length == 1){ // Times are not specified using @...
					// ...so just put in 00:00 for this and the next day
					let begind = new Date(baseDayDate);
					begind.setHours(0);
					begind.setMinutes(0);
					let endd = new Date(begind);
					endd.setDate(begind.getDate() + 1);
					
					relevantIntervals.push([begind, endd, normalBreak, normalTimeout]);
				}else{ // Times are specified using @...
					// ...so just use them
					let intervals = textGroupParts[1].split(";");
					let begind = new Date(baseDayDate);
					let endd = new Date(baseDayDate);
					
					for(let jj = 0; jj < intervals.length; ++jj){
						//console.log(intervals[jj]);
						
						let times = intervals[jj].split("-");
						
						if(times.length != 2) continue;
						
						let time0 = times[0].split(":");
						let time1 = times[1].split(":");
						
						begind.setHours(time0[0]);
						begind.setMinutes(time0[1]);
						endd.setHours(time1[0]);
						endd.setMinutes(time1[1]);
						
						relevantIntervals.push([begind, endd, normalBreak, normalTimeout]);
					}
				}
			}
		}
		
		// 2) Sort and unify the overlaps
		relevantIntervals.sort((a,b) => (a[0] === b[0] ? 0 : (a[0] > b[0] ? 1 : -1)));
				
		for(let ii = 0; ii < relevantIntervals.length; ++ii){
			while(ii+1 < relevantIntervals.length && 
			relevantIntervals[ii][1] >= relevantIntervals[ii+1][0]){
				
				if(relevantIntervals[ii][2] == relevantIntervals[ii+1][2] &&
					relevantIntervals[ii][3] == relevantIntervals[ii+1][3]){
					 
					// The intervals are equivalent, so merge them
					let [tmp] = relevantIntervals.splice(ii+1, 1);
					if(tmp[1] > relevantIntervals[ii][1])
						relevantIntervals[ii][1] = tmp[1];
				}else if(relevantIntervals[ii][2] < relevantIntervals[ii+1][2] ||
					(relevantIntervals[ii][2] == relevantIntervals[ii+1][2] &&
						relevantIntervals[ii][3] > relevantIntervals[ii+1][3])){
					
					// The former interval is stricter, so shorten the latter
					relevantIntervals[ii+1][0] = new Date(relevantIntervals[ii][1].getTime()+1);
				}else if(relevantIntervals[ii][2] > relevantIntervals[ii+1][2] ||
					(relevantIntervals[ii][2] == relevantIntervals[ii+1][2] &&
						relevantIntervals[ii][3] < relevantIntervals[ii+1][3])){
					
					// The latter interval is stricter, so shorten the former
					relevantIntervals[ii][1] = new Date(relevantIntervals[ii+1][0].getTime()-1);
				}
			}
		}
				
		// 3) Find nearest point in time when either
		//			the permitted break is larger than current break or
		//			the demanded timeout is smaller than distance from last check
		let currentIntervalIndex = relevantIntervals.findIndex(ii => ii[0] <= nowDate &&
																		ii[1] >= nowDate);
		
		if(currentIntervalIndex === -1 ||
			this.#currentDuration < relevantIntervals[currentIntervalIndex][2] * 1000)
			return defaultAnswer;
			
		//console.log(relevantIntervals[currentIntervalIndex], this.#currentDuration);
		
		for(let ii = currentIntervalIndex; ii < relevantIntervals.length; ++ii){
			
			if(relevantIntervals[ii][2] > relevantIntervals[currentIntervalIndex][2]){
				// The iterated interval has larger break tolerance than the current one
				return new Date(relevantIntervals[ii][0].getTime());
			}else if(this.#lastCheck.getTime() + relevantIntervals[ii][3] * 1000 
														< relevantIntervals[ii][1]){
				if(this.#lastCheck.getTime() + relevantIntervals[ii][3] * 1000
														< relevantIntervals[ii][0]){
					// The timeout is big enough not to run out during previous interval,
					//	but small enough to be counter as served in this one
					return new Date(relevantIntervals[ii][0]);
				}															
				
				// The timeout runs out during the iterated interval
				return new Date(this.#lastCheck.getTime() + relevantIntervals[ii][3] * 1000);
			}else if(ii + 1 == relevantIntervals.length ||
					relevantIntervals[ii][1].getTime() + 1 < relevantIntervals[ii+1][0].getTime()){
				// There is no interval following, or there is space with no timeouts between
				return new Date(relevantIntervals[ii][1].getTime() + 1);
			}
		}

		return defaultAnswer;		
	}
	
	testWebsite(websiteAddress, softCheck, nowDate){
		// returns either [Date, string] or false
		//  where Date is time when the website will be accessible
		//	and string is code to be executed
	
		if(!(this.#regex) || !(this.#action) || 
			!(websiteAddress.match(new RegExp(this.#regex)))){
			return false; // If regex or action is unset or address doesn't match, return false
		}
				
		let hoursRes = this.calculateNearestHoursAvailability(nowDate, softCheck);
		let timeoutRes = this.calculateNearestTimeoutAvailability(nowDate);
		
		if(hoursRes > nowDate || timeoutRes > nowDate){
			return [(hoursRes > timeoutRes ? hoursRes : timeoutRes), this.#action];
		}
		
		return false;
	}
		
	getCurrentBreakAndTimeout(nowDate){
		if(!(this.#timeout)){
			return [0, 0];
		}
		
		let days = this.#timeout.split("|");
		let dayno = (nowDate.getDay() % days.length);
		let groups = days[dayno].split(",");
		
		for(let ii = 0; ii < groups.length; ++ii){
			let groupParts = groups[ii].split("@");
			if(groupParts.length > 2) continue;
			
			let durations = groupParts[0].split("/");
			if(durations.length != 2) continue;
			
			let normalBreak = timeToInt(durations[0]);
			let normalTimeout = timeToInt(durations[1]);
			
			if(groupParts.length == 1){ // Time is not specified using @
				return [normalBreak, normalTimeout];				
			}
			
			let intervals = groupParts[1].split(";");
			let begind = new Date(nowDate);
			let endd = new Date(nowDate);
			
			for(let jj = 0; jj < intervals.length; ++jj){
				//console.log(intervals[jj]);
				
				let times = intervals[jj].split("-");
				
				if(times.length != 2) continue;
				
				let time0 = times[0].split(":");
				let time1 = times[1].split(":");
								
				begind.setHours(time0[0]);
				begind.setMinutes(time0[1]);
				endd.setHours(time1[0]);
				endd.setMinutes(time1[1]);
				
				if(begind > nowDate || nowDate >= endd){
					// Interval is valid but does not match, continue to the next one
					continue;
				}
				
				// Interval is valid and matches, therefore check time
				return [normalBreak, normalTimeout];
			}
		}
		
		return [0, 0];
	}
	getIncrementedTimeout(websiteAddress, nowDate, checkInterval){
		if(!(this.#regex) || !(this.#action) || !(this.#timeout) ||
			!(websiteAddress.match(new RegExp(this.#regex)))){
			// If regex or action is unset or address doesn't match, return false
			return false;
		}
		
		let [normalBreak, normalTimeout] = this.getCurrentBreakAndTimeout(nowDate);
		if(normalTimeout === 0) return false;
		
		let sinceLastCheck = Math.min(nowDate.getTime()
											- this.#lastCheck.getTime(),
									  checkInterval);
		
		if(this.#currentDuration < normalBreak * 1000){
			// If timeout didn't pass since last visit
			//	and currentStreak is less than allowed time,
			// 	increment current streak
			return this.withCurrentDuration(
								this.#currentDuration + sinceLastCheck )
						.withLastCheck(nowDate);
										
		}else if(nowDate.getTime() >= this.#lastCheck.getTime() + normalTimeout * 1000){
			// If timeout did pass since last visit
			//	reset current streak
			return this.withCurrentDuration(0).withLastCheck(nowDate);
			
		}
		
		return false;
	}
	
	
	// Serialization
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

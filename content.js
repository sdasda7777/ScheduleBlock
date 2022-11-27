/**
 * @file Describes what happens every time any page is loaded.
 * @author sdasda7777
 */

// Loggigin function
function logJ(){
	console.log.apply(this,
		Array.prototype.slice.call(arguments, 0).map((i)=>JSON.stringify(i)));
};

let rs = new RecordStorage();

/**
 * This is the interval of the checks.
 * (Is modified as per preferences)
 */
let interval = 15000;

/**
 * This function checks current location against storage, redirects if match is found.
 * @param {bool} soft - If true, function will check soft hours, if false it will check hard hours
 */
function checkHours(soft){
	let updatedElements = {};
		
	function timeoutLogic(record, ii, nowDate){
		
		let newRecord;
		
		//logJ(record);
		//logJ(record.getRegex());
		//logJ("Pre:");
		//logJ(record.getCurrentDuration(), record.getNormalBreak() * 1000);
		
		let sinceLastCheck = Math.min(nowDate.getTime() - record.getLastCheck().getTime(),
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
			// Otherwise if current streak is more or equal to allowed time, deny entry
			return true;
		}
		
		//logJ("Post:");
		//logJ(record.getLastCheck());
		//logJ(newRecord.getLastCheck());
		//logJ(newRecord.getCurrentDuration(), newRecord.getNormalBreak() * 1000);
			
		return false;
	}
	
	let d = new Date();
	let callback1 = (id, record) => {
		//logJ(record.getRegex());	
		if(!(record.getRegex()) || !(record.getDestination()))
			return; // If record does not have property 'regex' or 'destination', skip it

		if(!(window.location.href.match(new RegExp(record.getRegex()))))
			return; // Regex does not match

		if(timeoutLogic(record, id, d)){
			window.location = record.getDestination();
			return true;
		}

		if((!soft && !record.getHardHours()) || (soft && !record.getSoftHours())){
			return; // Record does have property to check time
		}
						
		let days = (soft ? record.getSoftHours() : record.getHardHours()).split("|");
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
			
			if(begind > d || d >= endd){
				// Interval is valid but does not match, continue to the next one
				continue;
			}
			
			// Interval is valid and matches, therefore do stuff
			window.location = record.getDestination();
			return true;
		}
	}
	
	rs.forEach(callback1);
	
	let callback2 = (id, rec) => {
		if(id in updatedElements){
			logJ(id, updatedElements[id].getCurrentDuration(), updatedElements[id].getLastCheck());
			return updatedElements[id];
		}else{
			return rec;
		}
	};
	
	rs.modifyWhere(callback2);
}

rs.forGeneralProperties((result) => {
	//logJ(result);
	if(result.CheckFrequency)
		interval = result.CheckFrequency * 1000;
	//logJ(interval);
	
	// Initial soft lock check
	checkHours(true);

	// This sets up continuous hard lock checks, check frequency is by default 15 seconds, but can be changed by user on the options page
	let checker = setInterval(() => {
		// This condition prevents "Uncaught error: Extension context invalidated"
		if(chrome === undefined || 
			chrome.runtime === undefined ||
			chrome.runtime.id === undefined){
				
			clearInterval(checker);
			return;
		}
				
		// Recurring hard lock check
		checkHours(false);
	}, interval);
});

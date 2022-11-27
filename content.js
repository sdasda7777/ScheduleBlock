/**
 * @file Describes what happens every time any page is loaded.
 * @author sdasda7777
 */

/**
 * This is the interval of the checks.
 */
let interval = 15000;

/**
 * This function checks current location against storage, redirects if match is found.
 * @param {bool} soft - If true, function will check soft hours, if false it will check hard hours
 */
function checkHours(soft){
	function timeoutLogic(arr, ii, nowDate){		
		if(arr[ii].timeouts){
			let copyAndSave = false;
			let oldDate = new Date(arr[ii].timeouts.lastCheck);
						
			if(nowDate < oldDate.getTime() + arr[ii].timeouts["normalTimeout"] * 1000 &&
				arr[ii].timeouts.currentStreak < arr[ii].timeouts["normalBreak"] &&
				nowDate.getTime() >= oldDate.getTime() + interval){
				arr[ii].timeouts.currentStreak += interval / 1000;
				arr[ii].timeouts.lastCheck = nowDate;
				chrome.storage.sync.set({websites:JSON.stringify(arr)});
			}else if(nowDate >= oldDate.getTime()
									+ arr[ii].timeouts["normalTimeout"] * 1000){
				arr[ii].timeouts.currentStreak = 0;
				arr[ii].timeouts.lastCheck = nowDate;
				chrome.storage.sync.set({websites:JSON.stringify(arr)});
			}else if(arr[ii].timeouts.currentStreak >= arr[ii].timeouts["normalBreak"]){
				return true;
			}
		}
		return false;
	}
		
	let callback = (result) => {
		if(!(result.websites)){
			return; // If result does not have property 'website', return
		}
		
		let arr = JSON.parse(result.websites);
		let d = new Date();
		
		for(let ii = 0; ii < arr.length; ++ii){
			if(!(arr[ii].regex))
				continue; // If record does not have property 'regex', skip it

			if(!(window.location.href.match(new RegExp(arr[ii].regex))))
				continue; // Regex does not match

			if((!soft && !arr[ii].hardhours) || (soft && !arr[ii].softhours)){
				if(timeoutLogic(arr, ii, d) && arr[ii].destination)
					window.location = arr[ii].destination;
				continue; // Record does have property to check time
			}
							
			let days = (soft ? arr[ii].softhours : arr[ii].hardhours).split("|");
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
				
				if(begind > d || d >= endd || !(arr[ii].destination)){
					// Interval is valid but does not match, continue to the next one
					continue;
				}
				
				// Interval is valid and matches, therefore do stuff
				window.location = arr[ii].destination;
				return;
			}
		}
	}
	
	chrome.storage.sync.get(['websites'], callback);
}

// This sets up continuous hard lock checks, check frequency is by default 15 seconds, but can be changed by user on the options page
let checker = null;
let storageCallback = (result) => {
	if(result.ScheduleBlockOptionsCheckFrequency)
		interval = result.ScheduleBlockOptionsCheckFrequency * 1000;
	
	// Initial soft lock check
	checkHours(true);
	
	checker = setInterval(() => {
		// This condition prevents "Uncaught error: Extension context invalidated"
		if(chrome.runtime.id == undefined) {
			clearInterval(checker);
			return;
		}
				
		// Recurring hard lock check
		checkHours(false);
	}, interval);};

chrome.storage.sync.get(['ScheduleBlockOptionsCheckFrequency'], storageCallback);

/**
 * @file Describes what happens every time any page is loaded.
 * @author sdasda7777
 */


/**
 * This function checks current location against storage, redirects if match is found.
 * @param {bool} soft - If true, function will check soft hours, if false it will check hard hours
 */
function checkHours(soft){
	let callback = (result) => {
		if(!(result.websites)){
			return; // If result does not have property 'website', return
		}
		
		let arr = JSON.parse(result.websites);
		let d = new Date();
		
		loop1:
		for(let i = 0; i < arr.length; ++i){
			if(!(arr[i].regex)){
				continue; // If record does not have property 'regex', skip it
			}
			
			let re = new RegExp(arr[i].regex);

			if(!(window.location.href.match(re)) || (!(!soft && arr[i].hardhours) && !(soft && arr[i].softhours))){
				continue; // If record pattern does not match or does not have required property to check time, skip it
			}
				
			let days = (soft ? arr[i].softhours : arr[i].hardhours).split("|");
			let dayno = (d.getDay() % days.length);
			let intervals = days[dayno].split(",");
			
			for(let j = 0; j < intervals.length; ++j){
				let times = intervals[j].split("-");
				
				if(times.length != 2){
					continue; // This implies interval does not have exactly one '-', so just skip it
				}
					
				let time0 = times[0].split(":");
				let time1 = times[1].split(":");
				
				let begind = new Date();
				let endd = new Date();
				
				begind.setHours(time0[0]);
				begind.setMinutes(time0[1]);
				endd.setHours(time1[0]);
				endd.setMinutes(time1[1]);
				
				if(begind > d || d >= endd || !(arr[i].destination)){
					continue; // Interval is valid but does not match, continue to the next one
				}
				
				// Interval is valid and matches and destination is valid, so redirect to it
				window.location = arr[i].destination;
				break loop1;
			}
		}
	}
	
	chrome.storage.sync.get(['websites'], callback);
}

// Initial soft lock check
checkHours(true);

// This sets up continuous hard lock checks, check frequency is 15 seconds
let checker = setInterval(() => {
	//Prevents "Uncaught error: Extension context invalidated"
	if(chrome.runtime.id == undefined) {
		clearInterval(checker);
		return;
	}
	checkHours(false);
}, 15000);
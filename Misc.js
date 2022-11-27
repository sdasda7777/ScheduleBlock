
/** 
 * Adds format functionality to strings
 * Taken from https://sebhastian.com/javascript-format-string/
 */
if (!String.prototype.format) {
  String.prototype.format = function () {
	var args = arguments;
	return this.replace(/{(\d+)}/g, function (match, number) {
	  return typeof args[number] != "undefined" ? args[number] : match;
	});
  };
}	


/**
 * Construct human readable time from int of seconds
 */
function intToTime(timeAsInt){
	let seconds = timeAsInt % 60;
	let minutes = (timeAsInt - seconds) % 3600 / 60;
	let hours = (timeAsInt - 60 * minutes - seconds) / 3600;
			
	return hours + ":" + 
			("00" + minutes).slice(-2) + ":" + 
			("00" + seconds).slice(-2);
}


/**
 * Convert human readable string to int of seconds
 */
function timeToInt(timeoutString){
	let sum = 0;
	let arr = timeoutString.split(":").reverse().map((i)=>(parseInt(i)));
	for(let ii = 0; ii < arr.length; ++ii){
		sum += arr[ii] * Math.pow(60, ii);
	}
	return sum;
}


let validator_tp;

/**
 * Validates time string
 * @param {string} timeString
 */
function validateTimeString(timeString){
	// I tried writing this function as one regular expression,
	//  but in the end it seemed like a hard to maintain mess to me
	//  so I wrote it like this, and it seems much more manageable
	
	if(timeString == "") return true;
	
	// This regex is slightly edited version of https://stackoverflow.com/a/7536768 by Peter O.
	const timeRegex = new RegExp('^\\s*(?:[0-1]?[0-9]|2[0-3])\\s*:\\s*[0-5][0-9]\\s*$');
	
	let days = timeString.split("|");
	
	for(let ii = 0; ii < days.length; ++ii){
		let intervals = days[ii].split(",");
		
		for(let jj = 0; jj < intervals.length; ++jj){
			let times = intervals[jj].split("-");
			
			if(times.length != 2) return false;
			
			for(let kk = 0; kk < times.length; ++kk){
				let res = timeRegex.exec(times[kk].trim());
				
				if(!res || res.length != 1) return false;
			}
		}
	}
	
	return true;
}


function validateTimeStringInput(e){
	if(!validateTimeString(e.target.value)){
		e.target.setCustomValidity(validator_tp.getTranslatedString(301));
		e.target.reportValidity();
		return false;
	}else{
		e.target.setCustomValidity("");
		return true;
	}
};


function validateTimeoutString(timeoutString){
	let arr = timeoutString.split(":").reverse().map((i)=>(parseInt(i)));
	if(arr.length > 3 || arr.length == 0) return false;
	for(let ii = 0; ii < arr.length; ++ii){
		if(!/^\d+$/.test(arr[ii]))
			return false;
	}
	if(parseInt(arr[0]) < 0 || (parseInt(arr[0]) > 59 && arr.length > 1)) return false;
	if(parseInt(arr[1]) < 0 || (parseInt(arr[1]) > 59 && arr.length > 2)) return false;
	if(parseInt(arr[2]) < 0) return false;
	
	return true;
}


function validateTimeoutStringInput(e){
	if(!validateTimeoutString(e.target.value)){
		e.target.setCustomValidity(validator_tp.getTranslatedString(302));
		e.target.reportValidity();
		return false;
	}else{
		e.target.setCustomValidity("");
		return true;
	}
}

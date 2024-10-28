/**
 * Construct human readable time from int of seconds
 */
export function intToTime(timeAsInt){
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
export function timeToInt(timeoutString){
	let sum = 0;
	let arr = timeoutString.split(":").reverse().map((i)=>(parseInt(i)));
	for(let ii = 0; ii < arr.length; ++ii){
		sum += arr[ii] * Math.pow(60, ii);
	}
	return sum;
}

export function validateURLInput(element, translationProvider){
	if(element.value.match("^(https?|ftps?)://") == null){
		element.setCustomValidity(translationProvider.getTranslatedString(151));
		element.reportValidity();
		return false;
	}else{
		element.setCustomValidity("");
		return true;
	}
}

export function validateRegexInput(e, translationProvider) {
	try {
		let r = new RegExp(e.target.value);
		e.target.setCustomValidity("");
		return true;
	} catch {
		e.target.setCustomValidity(translationProvider.getTranslatedString(150));
		e.target.reportValidity();
		return false;
	}
}

// This regex is slightly edited version of https://stackoverflow.com/a/7536768 by Peter O.
const timeRegex = new RegExp('^\\s*(?:[0-1]?[0-9]|2[0-3])\\s*:\\s*[0-5][0-9]\\s*$');

/**
 * Validates time string
 * @param {string} timeString
 */
export function validateTimeString(timeString){
	// I tried writing this function as one regular expression,
	//  but in the end it seemed like a hard to maintain mess to me
	//  so I wrote it like this, and it seems much more manageable

	if(timeString.trim() === "") return true;

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


export function validateTimeStringInput(e, tp){
	if(!validateTimeString(e.target.value)){
		e.target.setCustomValidity(tp.getTranslatedString(301));
		e.target.reportValidity();
		return false;
	}else{
		e.target.setCustomValidity("");
		return true;
	}
};

// validates time duration, such as 60, 1:00, 99:59:59, 100:00:00, and so on
export function validateTimeDuration(timeDuration){
	let arr = timeDuration.split(":").reverse().map((i)=>(parseInt(i)));
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

export function validateTimeoutString(timeoutString){
	if(timeoutString.trim() === "") return true;

	let days = timeoutString.split("|");

	for(let ii = 0; ii < days.length; ++ii){
		let groups = days[ii].split(",");

		for(let jj = 0; jj < groups.length; ++jj){
			let groupParts = groups[jj].split("@");

			if(groupParts.length > 2) return false;
			if(groupParts.length == 2){
				let timeIntervals = groupParts[1].split(";");

				for(let kk = 0; kk < timeIntervals; ++kk){
					let times = timeIntervals[kk].split("-");

					if(times.length != 2) return false;

					for(let ll = 0; ll < times.length; ++ll){
						let res = timeRegex.exec(times[ll].trim());

						if(!res || res.length != 1) return false;
					}
				}
			}

			let durations = groupParts[0].split("/");

			if(durations.length != 2) return false;
			if(!validateTimeDuration(durations[0]) || !validateTimeDuration(durations[1]))
				return false;
		}
	}

	return true;
}


export function validateTimeoutStringInput(e, tp){
	if(!validateTimeoutString(e.target.value)){
		e.target.setCustomValidity(tp.getTranslatedString(302));
		e.target.reportValidity();
		return false;
	}else{
		e.target.setCustomValidity("");
		return true;
	}
}

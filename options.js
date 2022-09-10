/**
 * @file Describes behaviour of interactive elements of extension's options page.
 * @author sdasda7777
 */


/**
 * Validates time string
 * @param {string} timeString
 */
function validateTimeString(timeString){
	// I tried writing this function as one regular expression,
	//  but in the end it seemed like a hard to maintain mess to me
	//  so I wrote it like this, and it seems much more manageable
	
	// This regex is slightly edited version of https://stackoverflow.com/a/7536768 by Peter O.
	const timeRegex = new RegExp('^\\s*(?:[0-1]?[0-9]|2[0-3])\\s*:\\s*[0-5][0-9]\\s*$');
	
	let days = timeString.split("|");
	
	for(let ii = 0; ii < days.length; ++ii){
		let intervals = days[ii].split(",");
		
		for(let jj = 0; jj < intervals.length; ++jj){
			let times = intervals[jj].split("-");
			
			if(times.length != 2) return false;
			
			for(let kk = 0; kk < times.length; ++kk){
				let res = timeRegex.exec(times[kk]);
				
				if(!res || res.length != 1) return false;
			}
		}
	}
	
	return true;
}


/**
 * Imports previously exported settings, reloads table.
 * @param {string} jsonstring - JSON representation of settings to be loaded
 */
function importSettings(jsonstring){
	let callback = (result) => {
		if(jsonstring){
			chrome.storage.sync.set({websites:jsonstring});
			constructView();
		}		
	};
	
	chrome.storage.sync.get(['websites'], callback);
}

/**
 * Exports settings for later import.
 */
function exportSettings(){
	let callback = (result) => {
		let a = document.createElement("a");
		let file = new Blob([result.websites], {type: 'application/json'});
		a.href = URL.createObjectURL(file);
		a.download = "ScheduleBlockBackup_" + new Date().toISOString().slice(0, 10);
		a.click();
	};
	
	chrome.storage.sync.get(['websites'], callback);
}

/**
 * Adds new record into the storage, taking pattern from #newsite element.
 */
function addSite(){
	let callback = (result) => {
		let arr = result.websites;
		arr = (arr ? JSON.parse(arr) : []);
		
		let nse = document.getElementById("newsite");
		if(nse.value === "") return;
		
		arr.push({"regex": nse.value, "softhours":"00:00-23:59", "hardhours":"00:00-23:59", 
										"destination": "about:blank"});
		chrome.storage.sync.set({websites:JSON.stringify(arr)});
		nse.value = "";
		constructView();
	};
	
	chrome.storage.sync.get(['websites'], callback);
}

/**
 * Constructs table from storage content.
 */
function constructView(){
	let callback = (result) => {
		if(!(result.websites)) return;

		let arr = JSON.parse(result.websites);
		
		document.getElementById("display").innerHTML = "";
		
		let t = document.createElement("table");
		
		// Generate table header row
		let headerRow = document.createElement("tr");
		const headerInnerTexts = ["#", "Pattern", "Soft locked hours/days",
										"Hard locked hours/days", "Destination", "Change record"];
		for(let ii = 0; ii < headerInnerTexts.length; ++ii){
			let tempHeader = document.createElement("th");
			tempHeader.innerText = headerInnerTexts[ii];
			headerRow.appendChild(tempHeader);
		}
		t.appendChild(headerRow);
		
		
		const changeButtonsIds = ["chp", "chs", "chh",
											"chd", "rmr"];
		const changeButtonsTexts = ["Pattern", "Soft hours", "Hard hours",
											"Destination", "Remove"];
		const changeButtonsFunctions = [changePattern, changeSoftHours, changeHardHours, 
												changeDestination, removeRecord];
		
		// Generate other table rows
		for(let ii = 0; ii < arr.length; ++ii){
			let row = document.createElement("tr");
			
			// Create order number control
			let recordNumberCell = document.createElement("td");
			let recordNumberBox = document.createElement("input");
			recordNumberBox.id = "mvt"+ii;
			recordNumberBox.type = "number";
			recordNumberBox.value = (ii+1);
			recordNumberBox.min = "1";
			recordNumberBox.max = (arr.length);
			recordNumberBox.addEventListener("keyup", recordNumberBoxKeyEventHandler);
			recordNumberCell.appendChild(recordNumberBox);
			row.appendChild(recordNumberCell);
			
			// Create cells displaying information about records
			{
				let pattern = document.createElement("td");
				pattern.innerText = arr[ii].regex;
				row.appendChild(pattern);
				
				let softhours = document.createElement("td");
				if(arr[ii].softhours){
					softhours.innerHTML = arr[ii].softhours.replace(/\|/g, "|<br>");
				}
				row.appendChild(softhours);
				
				let hardhours = document.createElement("td");
				if(arr[ii].hardhours){
					hardhours.innerHTML = arr[ii].hardhours.replace(/\|/g, "|<br>");
				}
				row.appendChild(hardhours);
				
				let des = document.createElement("td");
				if(arr[ii].destination){
					des.innerText = arr[ii].destination;
				}
				row.appendChild(des);
			}
			
			// Create changes buttons
			let changesCell = document.createElement("td");
			for(let jj = 0; jj < changeButtonsIds.length; ++jj){
				let tmpButton = document.createElement("input");
				tmpButton.id = changeButtonsIds[jj] + ii;
				tmpButton.type = "button";
				tmpButton.value = changeButtonsTexts[jj];
				tmpButton.addEventListener("click", changeButtonsFunctions[jj]);
				changesCell.appendChild(tmpButton);
			}
			
			row.appendChild(changesCell);
			
			t.appendChild(row);
		}
		
		document.getElementById("display").appendChild(t);
	};
	
	chrome.storage.sync.get(['websites'], callback);
}

/**
 * Handles record pattern modification.
 */
function changePattern(){
	let recnum = parseInt(this.id.substr(3));
	let callback = (result) => {
		if(!result.websites) return;
		
		let arr = JSON.parse(result.websites);
					
		if(recnum >= arr.length) return;
		
		let r = window.prompt(
			"Enter new regular expression describing the set of sites you want to forbid. \n"+
			"For example pattern '.*\\.reddit\\.com.*' will disable any address containing string '.reddit.com'.", 
			arr[recnum].regex);
		
		if(r != null){
			arr[recnum].regex = r;
		}
		
		chrome.storage.sync.set({websites:JSON.stringify(arr)});
		constructView();
	};
	
	chrome.storage.sync.get(['websites'], callback);
}

/**
 * Handles record soft locked hours modification.
 */
function changeSoftHours(){
	let recnum = parseInt(this.id.substr(3));
	let callback = (result) => {
		if(!result.websites) return;
		
		let arr = JSON.parse(result.websites);
			
		if(recnum >= arr.length) return;
		
		let base = (arr[recnum].softhours ? arr[recnum].softhours : "");
		
		
		let r = base;
		
		do{
			r = window.prompt(
				"Enter new time intervals in 24 hour format, separated by commas. "+
				"You can also enter times for individual days by separating days with |. "+
				"If amount of days is not 7, modulo is used. \n"+
				"For example, '12:00-14:15,15:30-16:45|9:00-19:00' will make it impossible to visit "+
				"the given site from 12:00 to 14:15 and from 15:30 to 16:45 on odd days "+
				"(counting Sunday as the first day) and from 9:00-19:00 on even days.",
				r);
		}while(r != null && !validateTimeString(r))
		
		if(r != null){
			arr[recnum].softhours = r;
			chrome.storage.sync.set({websites:JSON.stringify(arr)});
		}
		
		constructView();
	};
	
	chrome.storage.sync.get(['websites'], callback);
}

/**
 * Handles record hard locked hours modification.
 */
function changeHardHours(){
	let recnum = parseInt(this.id.substr(3));
	let callback = (result) => {
		if(!result.websites) return;
		
		let arr = JSON.parse(result.websites);
			
		if(recnum >= arr.length) return;
		
		let base = (arr[recnum].hardhours ? arr[recnum].hardhours : "");
								
		let r = base;

		do{
			r = window.prompt(
			"Enter new time intervals in 24 hour format, separated by commas. "+
			"You can also enter times for individual days by separating days with |. "+
			"If amount of days is not 7, modulo is used.\n"+
			"For example, '12:00-14:15,15:30-16:45|9:00-19:00' will redirect from "+
			"the given site from 12:00 to 14:15 and from 15:30 to 16:45 on odd days "+
			"(counting Sunday as the first day) and from 9:00-19:00 on even days.",
			r);
		}while(r != null && !validateTimeString(r))
		
		if(r != null){
			arr[recnum].hardhours = r;
			chrome.storage.sync.set({websites:JSON.stringify(arr)});
		}
		
		constructView();
	};
	
	chrome.storage.sync.get(['websites'], callback);
}

/**
 * Handles record redirection destination modification.
 */
function changeDestination(){
	let recnum = parseInt(this.id.substr(3));
	let callback = (result) => {
		if(!result.websites) return;
		
		let arr = JSON.parse(result.websites);
			
		if(recnum >= arr.length) return;
		
		let r = window.prompt(
			"Enter new destination. The address should include protocol (most likely http:// or https://), " +
			"otherwise undesired behaviour may occur.\n" +
			"It is advised to use an address that does not match the pattern of the record, as failing to do "+
			"so will lead to an endless loop.",
			(arr[recnum].destination ? arr[recnum].destination : ""));
		
		if(r != null){
			arr[recnum].destination = r;
		}
		
		chrome.storage.sync.set({websites:JSON.stringify(arr)});
		constructView();
	};
	
	chrome.storage.sync.get(['websites'], callback);
}

/**
 * Handles record removal.
 */
function removeRecord(){
	let recnum = parseInt(this.id.substr(3));
	let callback = (result) => {
		if(!result.websites) return;
		
		let arr = JSON.parse(result.websites);
			
		if(recnum >= arr.length) return;
		
		let affirmative = confirm(
			"There is no way to retrieve deleted pattern, other than creating it again. " +
			"Are you absolutely sure you want to delete the record \n" + 
			"('" + arr[recnum].regex + "' => '" + arr[recnum].destination + "' @ (s'" +
			arr[recnum].softhours +"' | h'" + arr[recnum].hardhours + "'))\n" +
			"from the list?");
		
		if(affirmative){
			arr.splice(recnum, 1);
		}
		
		chrome.storage.sync.set({websites:JSON.stringify(arr)});
		constructView();
	};
	
	chrome.storage.sync.get(['websites'], callback);
}

/**
 * Handles record number modification (i.e. reordering) using keyboard.
 * @param {KeyboardEvent} e - keyup event to be handled
 */
function recordNumberBoxKeyEventHandler(e){
	if (e.keyCode !== 13) return;
	
	e.preventDefault();
		
	let recnum = parseInt(this.id.substr(3));
	let destnum = this.valueAsNumber - 1;
	let callback = (result) => {
		if(!result.websites) return;
	
		let arr = JSON.parse(result.websites);
			
		if(recnum >= arr.length) return;
		
		if(destnum < 0) destnum = 0;
		let tmp = arr.splice(recnum, 1);
		arr.splice(destnum, 0, tmp[0]);
		
		chrome.storage.sync.set({websites:JSON.stringify(arr)});
		constructView();
	};
	
	chrome.storage.sync.get(['websites'], callback);
}

/**
 * Handles behaviour of the pattern tester "widget".
 */
function testRegex(){
	let re = document.getElementById("testerinput1").value, str = document.getElementById("testerinput2").value;
	
	if(str.match(new RegExp(re))){
		console.log("Tester: '" + re + "' matches '" + str + "'");
		document.getElementById("testerresult").value = "Check (Matching)";
	}else{
		console.log("Tester: '" + re + "' does not match '" + str + "'");
		document.getElementById("testerresult").value = "Check (Not matching)";
	}
}


// This code sets up event handlers for static elements and then constructs the current table
document.getElementById("newsite").addEventListener("keyup", e => {
	if (e.keyCode === 13) {
		e.preventDefault();
		addSite();
	}
});
document.getElementById("newsiteadd").addEventListener("click", addSite);
document.getElementById("testerresult").addEventListener("click", testRegex);
document.getElementById("import").addEventListener("click", () => {
	document.getElementById("import2").click();
});
document.getElementById("import2").addEventListener("change", () => {
	if(document.getElementById("import2").files){
		document.getElementById("import2").files[0].text().then(t => importSettings(t));
		
		// This line clears FileList, so that this event will get called properly next time as well
		document.getElementById("import2").value = "";
	}
});
document.getElementById("export").addEventListener("click", exportSettings);

// Load background color, set up change listener
{
	let callback = (result) => {
		let newColor = "#808080";
		if(result.ScheduleBlockOptionsBackground)
			newColor = result.ScheduleBlockOptionsBackground;
		
		let stylesheet = document.querySelector("#rebuildPersistantStylesheet");
		stylesheet.innerText = "* { background-color: " + newColor + "; }";
		
		let colorPicker = document.querySelector("#colorPicker");
		colorPicker.value = newColor;
	};
	
	chrome.storage.sync.get(['ScheduleBlockOptionsBackground'], callback);
}

document.getElementById("colorPicker").addEventListener("change", (e) => {
	let newColor = e.srcElement.value;
	
	let stylesheet = document.querySelector("#rebuildPersistantStylesheet");
	stylesheet.innerText = "* { background-color: " + newColor + "; }";
	
	let callback = (result) => {
		chrome.storage.sync.set({ScheduleBlockOptionsBackground:newColor});
	};
	
	chrome.storage.sync.get(['ScheduleBlockOptionsBackground'], callback);
});

constructView();
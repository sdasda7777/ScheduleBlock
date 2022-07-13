/**
 * @file Describes behaviour of interactive elements of extension's options page.
 * @author sdasda7777
 */


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
		a.download = "ScheduleBlockBackup" + new Date().toISOString().slice(0, 10);
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
		let tr0 = document.createElement("tr");
		let th0 = document.createElement("th");
		th0.innerText = "#";
		tr0.appendChild(th0);
		let th1 = document.createElement("th");
		th1.innerText = "Pattern";
		tr0.appendChild(th1);
		let th2 = document.createElement("th");
		th2.innerText = "Soft locked hours/days";
		tr0.appendChild(th2);
		let th3 = document.createElement("th");
		th3.innerText = "Hard locked hours/days";
		tr0.appendChild(th3);
		let th4 = document.createElement("th");
		th4.innerText = "Destination";
		tr0.appendChild(th4);
		let th5 = document.createElement("th");
		th5.innerText = "Change record";
		tr0.appendChild(th5);
		t.appendChild(tr0);
		
		for(let i = 0; i < arr.length; i++){
			let row = document.createElement("tr");
			
			let recordNumberCell = document.createElement("td");
			let recordNumberBox = document.createElement("input");
			recordNumberBox.id = "mvt"+i;
			recordNumberBox.type = "number";
			recordNumberBox.value = (i+1);
			recordNumberBox.min = "1";
			recordNumberBox.max = (arr.length);
			recordNumberBox.addEventListener("keyup", recordNumberBoxKeyEventHandler);
			recordNumberCell.appendChild(recordNumberBox);
			row.appendChild(recordNumberCell);
			
			let pattern = document.createElement("td");
			pattern.innerText = arr[i].regex;
			row.appendChild(pattern);
			
			let softhours = document.createElement("td");
			if(arr[i].softhours){
				softhours.innerHTML = arr[i].softhours.replace(/\|/g, "|<br>");
			}
			row.appendChild(softhours);
			
			let hardhours = document.createElement("td");
			if(arr[i].hardhours){
				hardhours.innerHTML = arr[i].hardhours.replace(/\|/g, "|<br>");
			}
			row.appendChild(hardhours);
			
			let des = document.createElement("td");
			if(arr[i].destination){
				des.innerText = arr[i].destination;
			}
			row.appendChild(des);
			
			let changesCell = document.createElement("td");
			let changePatternButton = document.createElement("input");
			changePatternButton.id = "chp"+i;
			changePatternButton.type = "button";
			changePatternButton.value = "Pattern";
			changePatternButton.addEventListener("click", changePattern);
			changesCell.appendChild(changePatternButton);
			
			let changeSoftHoursButton = document.createElement("input");
			changeSoftHoursButton.id = "chs"+i;
			changeSoftHoursButton.type = "button";
			changeSoftHoursButton.value = "Soft hours";
			changeSoftHoursButton.addEventListener("click", changeSoftHours);
			changesCell.appendChild(changeSoftHoursButton);
			
			let changeHardHoursButton = document.createElement("input");
			changeHardHoursButton.id = "chh"+i;
			changeHardHoursButton.type = "button";
			changeHardHoursButton.value = "Hard hours";
			changeHardHoursButton.addEventListener("click", changeHardHours);
			changesCell.appendChild(changeHardHoursButton);
			
			let changeDestinationButton = document.createElement("input");
			changeDestinationButton.id = "chd"+i;
			changeDestinationButton.type = "button";
			changeDestinationButton.value = "Destination";
			changeDestinationButton.addEventListener("click", changeDestination);
			changesCell.appendChild(changeDestinationButton);
			
			let removeRecordButton = document.createElement("input");
			removeRecordButton.id = "rmr"+i;
			removeRecordButton.type = "button";
			removeRecordButton.value = "Remove";
			removeRecordButton.addEventListener("click", removeRecord);
			changesCell.appendChild(removeRecordButton);
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
		
		let r = window.prompt(
			"Enter new time intervals in 24 hour format, separated by commas. "+
			"You can also enter times for individual days by separating days with |. "+
			"If amount of days is not 7, modulo is used. \n"+
			"For example, '12:00-14:15,15:30-16:45|9:00-19:00' will make it impossible to visit "+
			"the given site from 12:00 to 14:15 and from 15:30 to 16:45 on odd days "+
			"(counting Sunday as the first day) and from 9:00-19:00 on even days.",
			base);
		
		if(r != null){
			arr[recnum].softhours = r;
		}
		
		chrome.storage.sync.set({websites:JSON.stringify(arr)});
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
								
		let r = window.prompt(
			"Enter new time intervals in 24 hour format, separated by commas. "+
			"You can also enter times for individual days by separating days with |. "+
			"If amount of days is not 7, modulo is used.\n"+
			"For example, '12:00-14:15,15:30-16:45|9:00-19:00' will redirect from "+
			"the given site from 12:00 to 14:15 and from 15:30 to 16:45 on odd days "+
			"(counting Sunday as the first day) and from 9:00-19:00 on even days.",
			base);
		
		if(r != null){
			arr[recnum].hardhours = r;
		}
		
		chrome.storage.sync.set({websites:JSON.stringify(arr)});
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
			"Enter new destination. The address should include protocol (http:// or https://), " +
			"otherwise undesired behaviour may occur.\n" +
			"It is advised to use an address that does not match the pattern, as failing to do "+
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
			"('" + arr[recnum].regex + "' => '" + arr[recnum].destination + "')\n" +
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
/**
 * @file Describes behaviour of interactive elements of extension's options page.
 * @author sdasda7777
 */

import { Record } from "./Record.js";
import { TranslationProvider } from "./TranslationProvider.js";
import { intToTime, timeToInt,
		 validateTimeString, validateTimeStringInput,
		 validateTimeoutString, validateTimeoutStringInput} from "./Misc.js";

let recnum = 0;
let tp = new TranslationProvider();



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


		
function translateGUI(){
	document.querySelector("#langPickerLabel").innerText = tp.getTranslatedString(101);
	document.querySelector("#freqPickerLabel").innerText = tp.getTranslatedString(105);
	document.querySelector("#colorPickerLabel").innerText = tp.getTranslatedString(102);
	document.querySelector("#import").value = tp.getTranslatedString(103);
	document.querySelector("#export").value = tp.getTranslatedString(104);
	
	document.querySelector("#settingsMenuOK").value = tp.getTranslatedString(1);
	document.querySelector("#settingsMenuCancel").value = tp.getTranslatedString(2);
	
	document.querySelector("#patternInputLabel").innerText
		= tp.getTranslatedString(211) + ":";
	document.querySelector("#softLockHoursLabel").innerText
		= tp.getTranslatedString(212) + ":";
	document.querySelector("#hardLockHoursLabel").innerText
		= tp.getTranslatedString(213) + ":";
	document.querySelector("#timeoutsLabel").innerText
		= tp.getTranslatedString(214) + ":";
	document.querySelector("#destinationLabel").innerText
		= tp.getTranslatedString(215) + ":";
	document.querySelector("#recordEditDelete").value = tp.getTranslatedString(217);
	
	document.querySelector("#recordEditOK").value = tp.getTranslatedString(1);
	document.querySelector("#recordEditCancel").value = tp.getTranslatedString(2);
		
	document.querySelector("#tableHint").innerText = tp.getTranslatedString(201);
	document.querySelector("#newsite").placeholder = tp.getTranslatedString(350);
	document.querySelector("#newsiteadd").value = tp.getTranslatedString(351);
	
	document.querySelector("#testertitle").innerText = tp.getTranslatedString(401);
	document.querySelector("#testerinput1").placeholder = tp.getTranslatedString(402);
	document.querySelector("#testerinput2").placeholder = tp.getTranslatedString(403);
	document.querySelector("#testerresultlabel").innerText = tp.getTranslatedString(404);
	let testerresult = document.querySelector("#testerresult");
	if(testerresult.getAttribute("result") == "matching"){
		testerresult.innerText = tp.getTranslatedString(406);
	}else{
		testerresult.innerText = tp.getTranslatedString(405);
	}
	document.querySelector("#testerbutton").value = tp.getTranslatedString(407);
	
	document.querySelector("#personalmessagetitle").innerText
		= tp.getTranslatedString(451);
	document.querySelector("#personalmessagecontent").innerHTML
		= tp.getTranslatedString(452);
	
	constructView();
}			

/**
 * Adds new record into the storage, taking pattern from #newsite element.
 */
function addSite(){
	if(document.getElementById("newsite").value !== ""){
		let sending = chrome.runtime.sendMessage(
		{
			type: "ScheduleBlock_RecordStorage_createNewRecord",
			regex: document.getElementById("newsite").value
		},
		()=>{
			document.getElementById("newsite").value= "";
			constructView();
		});
	}
}

/**
 * Constructs table from storage content.
 */
function constructView(){	
	let buildCallback = (arr) => {
		arr = Record.fromJSON(arr);
		
		let t = document.createElement("table");
	
		// Generate table header row
		let headerRow = document.createElement("tr");
		let headerInnerTexts = [
				tp.getTranslatedString(210),
				tp.getTranslatedString(211),
				tp.getTranslatedString(212),
				tp.getTranslatedString(213),
				tp.getTranslatedString(214),
				tp.getTranslatedString(215),
				tp.getTranslatedString(216)
		];
			
		for(let ii = 0; ii < headerInnerTexts.length; ++ii){
			let tempHeader = document.createElement("th");
			tempHeader.innerText = headerInnerTexts[ii];
			headerRow.appendChild(tempHeader);
		}
		t.appendChild(headerRow);
		
		for(let ii = 0; ii < arr.length; ++ii){
			//logX(rec);
			let row = document.createElement("tr");
			
			// Create order number control
			let recordNumberCell = document.createElement("td");
			let recordNumberBox = document.createElement("input");
			recordNumberBox.id = "mvt"+ii;
			recordNumberBox.type = "number";
			recordNumberBox.value = (ii+1);
			recordNumberBox.min = "1";
			recordNumberBox.addEventListener("keyup", recordNumberBoxKeyEventHandler);
			recordNumberCell.appendChild(recordNumberBox);
			row.appendChild(recordNumberCell);
			
			// Create cells displaying information about records
			{
				let pattern = document.createElement("td");
				pattern.innerText = arr[ii].getRegex();
				row.appendChild(pattern);
				
				let softhours = document.createElement("td");
				softhours.innerHTML = arr[ii].getSoftHours().replace(/\|/g, "|<br>");
				row.appendChild(softhours);
				
				let hardhours = document.createElement("td");
				hardhours.innerHTML = arr[ii].getHardHours().replace(/\|/g, "|<br>");
				row.appendChild(hardhours);
				
				let timeouts = document.createElement("td");
				timeouts.innerHTML = ""+(arr[ii].getNormalBreak() ?
											intToTime(arr[ii].getNormalBreak()) : 0) +
										  "/"+(arr[ii].getNormalTimeout() ?
											intToTime(arr[ii].getNormalTimeout()) : 0);
				row.appendChild(timeouts);
				
				let des = document.createElement("td");
				des.innerText = arr[ii].getAction();
				row.appendChild(des);
			}
			
			// Create edit button
			let editCell = document.createElement("td");
			editCell.className = "editCell";
			let editButton = document.createElement("input");
			editButton.id = "edit" + ii;
			editButton.type = "button";
			editButton.className = "editButton"
			editButton.value = "";
			editButton.addEventListener("click", openRecordEditMenu);
			editCell.appendChild(editButton);
			row.appendChild(editCell);
			
			t.appendChild(row);
		}
		
		document.getElementById("display").innerHTML = "";
		document.getElementById("display").appendChild(t);
	};
	
	let sending = chrome.runtime.sendMessage(
		{
			type: "ScheduleBlock_RecordStorage_getAll"
		},
		buildCallback);
}

function openRecordEditMenu(e){
	recnum = parseInt(this.id.substr(4));
	let callback = (rec) => {
		rec = Record.fromJSON(rec)[0];
		
		document.getElementById("patternInput").value = rec.getRegex();
		document.getElementById("softLockHoursInput").value = rec.getSoftHours();
		document.getElementById("hardLockHoursInput").value = rec.getHardHours();
				
		document.getElementById("timeoutsNATInput").value = intToTime(rec.getNormalBreak());
		document.getElementById("timeoutsNTOInput").value = intToTime(rec.getNormalTimeout());
				
		if(rec.getAction() == "window.close();"){
			document.getElementById("actionInputClose").checked = true;
			document.getElementById("destinationInput").value = "";
			document.getElementById("actionInputCustomCodeArea").value = "";
		}else if(rec.getAction().substring(0, rec.getAction().indexOf("'") + 1)
						== "window.location = '" &&
					rec.getAction().substring(rec.getAction().lastIndexOf("'")) == "';"){
			document.getElementById("actionInputRedirect").checked = true;
			document.getElementById("destinationInput").value
					= rec.getAction().substring(rec.getAction().indexOf("'") + 1,
												rec.getAction().length-2);
			document.getElementById("actionInputCustomCodeArea").value = "";
		}else{
			document.getElementById("actionInputCustom").checked = true;
			document.getElementById("destinationInput").value = "";
			document.getElementById("actionInputCustomCodeArea").value = rec.getAction();
		}
		
		document.getElementById("recordEditOverlay").style.display = "flex";
	}
	
	let sending = chrome.runtime.sendMessage(
		{
			type: "ScheduleBlock_RecordStorage_getOne",
			id: recnum
		},
		callback);
}

/**
 * Handles record number modification (i.e. reordering) using keyboard.
 * @param {KeyboardEvent} e - keyup event to be handled
 */
function recordNumberBoxKeyEventHandler(e){
	if (e.keyCode !== 13) return;
	
	e.preventDefault();
	
	let sending = chrome.runtime.sendMessage(
		{
			type: "ScheduleBlock_RecordStorage_moveRecord",
			id: parseInt(this.id.substr(3)),
			newId: this.valueAsNumber-1
		},
		()=>{
			constructView();
		});
}

/**
 * Handles behaviour of the pattern tester "widget".
 */
function testRegex(){
	let re = document.getElementById("testerinput1").value, str = document.getElementById("testerinput2").value;
	
	let testerresult = document.querySelector("#testerresult");
	
	if(str.match(new RegExp(re))){
		console.log("Tester: '" + re + "' matches '" + str + "'");
		testerresult.setAttribute("result", "matching");
		testerresult.innerText = tp.getTranslatedString(406);
	}else{
		console.log("Tester: '" + re + "' does not match '" + str + "'");
		testerresult.setAttribute("result", "not_matching");
		testerresult.innerText = tp.getTranslatedString(405);
	}
}

export function main(){

	// This code sets up event handlers for static elements and then constructs the current table
	document.getElementById("newsite").addEventListener("keyup", e => {
		if (e.keyCode === 13) {
			e.preventDefault();
			addSite();
		}
	});
	document.getElementById("newsiteadd").addEventListener("click", addSite);
	document.getElementById("testerbutton").addEventListener("click", testRegex);
	document.getElementById("import").addEventListener("click", () => {
		document.getElementById("import2").click();
	});
	document.getElementById("import2").addEventListener("change", () => {
		if(document.getElementById("import2").files){
			document.getElementById("import2").files[0].text()
				.then((text) => {
					let sending = chrome.runtime.sendMessage(
					{
						type: "ScheduleBlock_RecordStorage_importSettings",
						newSettings: text
					},
					() => {
						constructView();
						// This line clears FileList, so that this event will get called properly next time as well
						document.getElementById("import2").value = "";
					});
			});
		}
	});
	document.getElementById("export").addEventListener("click", ()=>{
		let sending = chrome.runtime.sendMessage(
		{
			type: "ScheduleBlock_RecordStorage_exportSettings",
		},
		(result) => {
			let a = document.createElement("a");
			let file = new Blob([result.websites], {type: 'application/json'});
			a.href = URL.createObjectURL(file);
			a.download = "ScheduleBlockBackup_" + new Date().toISOString().slice(0, 10);
			a.click();
		});
	});


	// Set up language picker
	{
		let picker = document.querySelector("#langPicker");
		
		for (let lang in picker){
			picker.remove(lang);
		}
		
		let languages = tp.getStringVersions(0);
		
		for (let lang in languages){
			let option = document.createElement('option');
			option.value = lang;
			option.innerHTML = languages[lang];
			picker.appendChild(option);
		}
		
		picker.addEventListener("change", (e) => {
			tp.setLanguageIndex(e.target.selectedIndex);
			translateGUI();
		});
	}

	// Load preferred language, check frequency, color, set up listeners
	{
		let callback = (result) => {
			console.log(result);
			
			let tmpLangIndex = tp.getStringVersions(0).indexOf(result.Language);
			if(tmpLangIndex != -1){
				document.querySelector("#langPicker").selectedIndex = tmpLangIndex;
				tp.setLanguageIndex(tmpLangIndex);
			}
			
			document.querySelector("#freqPicker").value = result.CheckFrequency;
			
			document.querySelector("#rebuildPersistantStylesheet")
					.innerText = "* { background-color: " + result.Background + "; }";
			
			document.querySelector("#colorPicker").value = result.Background;
			
			translateGUI();
		};
		
		let sending = chrome.runtime.sendMessage(
		{
			type: "ScheduleBlock_RecordStorage_getGeneralProperties"
		},
		callback);
		
		
		// Set up color change listener
		document.getElementById("colorPicker").addEventListener("change", (e) => {
			document.querySelector("#rebuildPersistantStylesheet")
				.innerText = "* { background-color: " + e.srcElement.value + "; }";
		});
	}


	// Set up settings button and settings overlay listeners
	{
		let languageBackup, intervalBackup, colorBackup;
		document.getElementById("settingsButton").addEventListener("click", (e) => {
			if(document.getElementById("settingsButton") !== event.target) return;
			
			languageBackup = tp.getStringVersions(0)[document.getElementById("langPicker")
																	.selectedIndex];
			intervalBackup = parseInt(document.getElementById("freqPicker").value);
			colorBackup = document.getElementById("colorPicker").value;
			
			document.getElementById("settingsChangeOverlay").style.display = "flex";
		});
		
		function resetSettingsBackups(){
			document.getElementById("langPicker").value = tp.getStringVersions(0)
																.indexOf(languageBackup);
			document.getElementById("langPicker").dispatchEvent(new UIEvent('change', {
																	'view': window,
																	'bubbles': true,
																	'cancelable': true}));
			document.getElementById("freqPicker").value = intervalBackup;
			document.getElementById("freqPicker").dispatchEvent(new UIEvent('change', {
																	'view': window,
																	'bubbles': true,
																	'cancelable': true}));
			document.getElementById("colorPicker").value = colorBackup;
			document.getElementById("colorPicker").dispatchEvent(new UIEvent('change', {
																	'view': window,
																	'bubbles': true,
																	'cancelable': true}));
		}
		
		document.getElementById("settingsChangeOverlay").addEventListener("click", (e) => {
			if(document.getElementById("settingsChangeOverlay") !== event.target) return;
			
			resetSettingsBackups();
			document.getElementById("settingsChangeOverlay").style.display = "none";
		});
		
		document.getElementById("settingsMenuCancel").addEventListener("click", (e) => {
			resetSettingsBackups();
			document.getElementById("settingsChangeOverlay").style.display = "none";
		});
		
		
		
		
		document.getElementById("settingsMenuOK").addEventListener("click", (e) => {
			let newLangIndex = document.getElementById("langPicker").selectedIndex;
			let newLangName = tp.getStringVersions(0)[newLangIndex];
			let newCheckFrequency = parseInt(document.getElementById("freqPicker").value);
			let newBackground = document.getElementById("colorPicker").value;
			
			let sending = chrome.runtime.sendMessage(
			{
				type: "ScheduleBlock_RecordStorage_setGeneralProperties",
				newProperties: {Language: newLangName,
									CheckFrequency: newCheckFrequency,
									Background: newBackground}
			},
			()=>{
				document.getElementById("settingsChangeOverlay").style.display = "none";
			});
		});
				
		
	}

	// Set up edit menu listeners
	{
		document.getElementById("recordEditOverlay").addEventListener("click", (e) => {
			if(document.getElementById("recordEditOverlay") !== event.target) return;
				
			document.getElementById("recordEditOverlay").style.display = "none";
		});
		
		document.getElementById("recordEditCancel").addEventListener("click", (e) => {
			document.getElementById("recordEditOverlay").style.display = "none";
		});
		
		
		document.getElementById("recordEditDelete").addEventListener("click", (e) => {
			if(confirm(tp.getTranslatedString(305))){
				let sending = chrome.runtime.sendMessage(
				{
					type: "ScheduleBlock_RecordStorage_deleteRecord",
					id: recnum
				},
				()=>{
					document.getElementById("recordEditOverlay").style.display = "none";
					constructView();
				});
			}
		});

		
		// On change validators
		document.getElementById("softLockHoursInput")
			.addEventListener("change", validateTimeStringInput);
		document.getElementById("hardLockHoursInput")
			.addEventListener("change", validateTimeStringInput);
		document.getElementById("timeoutsNATInput")
			.addEventListener("change", validateTimeoutStringInput);
		document.getElementById("timeoutsNTOInput")
			.addEventListener("change", validateTimeoutStringInput);
		
		document.getElementById("recordEditOK").addEventListener("click", (e) => {
			let softhoursInput = document.getElementById("softLockHoursInput");
			let hardhoursInput = document.getElementById("hardLockHoursInput");
			let timeoutsNATInput = document.getElementById("timeoutsNATInput");
			let timeoutsNTOInput = document.getElementById("timeoutsNTOInput");
			
			if(!validateTimeStringInput({target:softhoursInput}) || 
				!validateTimeStringInput({target:hardhoursInput}) ||
				!validateTimeoutStringInput({target:timeoutsNATInput}) ||
				!validateTimeoutStringInput({target:timeoutsNTOInput})){
				return;
			}
			
			let sending = chrome.runtime.sendMessage(
			{
				type: "ScheduleBlock_RecordStorage_editRecord",
				id: recnum,
				newValue: Record.toJSON([
								new Record(document.getElementById("patternInput").value, 
										softhoursInput.value, hardhoursInput.value,
										
				(document.getElementById("actionInputClose").checked ? 
						"window.close();" :
					document.getElementById("actionInputRedirect").checked ?
						"window.location = '" + document.getElementById("destinationInput").value + "';" :
						document.getElementById("actionInputCustomCodeArea").value)
										,
										timeToInt(timeoutsNATInput.value),
										timeToInt(timeoutsNTOInput.value))])
			},
			()=>{
				document.getElementById("recordEditOverlay").style.display = "none";
				constructView();
			});
		});
	}

	// Construct table
	//constructView();
	//translateGUI();
}
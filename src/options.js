/**
 * @file Describes behaviour of interactive elements of extension's options page.
 * @author sdasda7777
 */

import { Record } from "./Record.js";
import { TranslationProvider } from "./TranslationProvider.js";
import { validateURLInput,
		 intToTime, timeToInt,
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
	document.querySelector("#settingsButton").value = tp.getTranslatedString(3);
	document.querySelector("#import").value = tp.getTranslatedString(103);
	document.querySelector("#export").value = tp.getTranslatedString(104);
	document.querySelector("#langPickerLabel").innerText = tp.getTranslatedString(101);
	document.querySelector("#freqPickerLabel").innerText = tp.getTranslatedString(105);
	document.querySelector("#colorPickerLabel").innerText = tp.getTranslatedString(102);
	document.querySelector("#creditsLabel").innerText = tp.getTranslatedString(106);

	document.querySelector("#lockScreenBaseLabel").innerText = tp.getTranslatedString(107);
	document.querySelector("#lockScreenBaseNote").innerText = tp.getTranslatedString(108);

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

	document.querySelector("#actionInputCloseLabel").innerText
		= tp.getTranslatedString(216);
	document.querySelector("#actionInputLockPageLabel").innerText
		= tp.getTranslatedString(219);
	document.querySelector("#actionInputRedirectLabel").innerText
		= tp.getTranslatedString(217) + ":";
	document.querySelector("#actionInputCustomCodeLabel").innerText
		= tp.getTranslatedString(218) + ":";

	document.querySelector("#recordEditDelete").value = tp.getTranslatedString(249);

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
			type: "ScheduleBlock_RecordStorage_CreateNewRecord",
			regex: document.getElementById("newsite").value
		});
		document.getElementById("newsite").value= "";
	}
}


/**/
function contructViewCallback(data){
	let arr = Record.fromJSON(data);
	
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
			tp.getTranslatedString(250)
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
			timeouts.innerHTML = arr[ii].getTimeout();
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

/**
 * Constructs table from storage content.
 */
function constructView(){	
	
	let sending = chrome.runtime.sendMessage(
		{
			type: "ScheduleBlock_RefreshTable"
		});
}

function openRecordEditMenuCallback(data){
	let rec = Record.fromJSON(data)[0];
	
	// Set up the first four text inputs
	document.getElementById("patternInput").value = rec.getRegex();
	document.getElementById("softLockHoursInput").value = rec.getSoftHours();
	document.getElementById("hardLockHoursInput").value = rec.getHardHours();
	document.getElementById("timeoutStringInput").value = rec.getTimeout();
	
	// Clear and disable all record action inputs
	document.getElementById("destinationInput").value = "";
	document.getElementById("actionInputCustomCodeArea").value = "";
	document.getElementById("destinationInput").disabled = true;
	document.getElementById("actionInputCustomCodeArea").disabled = true;
	
	// Set up record action
	if(rec.getAction() == "window.close();"){
		document.getElementById("actionInputClose").checked = true;	
	}else if(rec.getAction() == "window.location = '$ScheduleBlock_LockScreen$';"){
		document.getElementById("actionInputLockPage").checked = true;
	}else if(rec.getAction().substring(0, rec.getAction().indexOf("'") + 1)
					== "window.location = '" &&
				rec.getAction().substring(rec.getAction().lastIndexOf("'")) == "';"){
		document.getElementById("actionInputRedirect").checked = true;
		document.getElementById("destinationInput").disabled = false;
		document.getElementById("destinationInput").value
				= rec.getAction().substring(rec.getAction().indexOf("'") + 1,
											rec.getAction().length-2);
	}else{
		document.getElementById("actionInputCustom").checked = true;
		document.getElementById("actionInputCustomCodeArea").disabled = false;
		document.getElementById("actionInputCustomCodeArea").value = rec.getAction();
	}
	
	document.getElementById("recordEditOverlay").style.display = "flex";
}

function openRecordEditMenu(e){
	recnum = parseInt(this.id.substr(4));
		
	let sending = chrome.runtime.sendMessage(
	{
		type: "ScheduleBlock_OpenEditMenu",
		id: recnum
	});
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
			type: "ScheduleBlock_RecordStorage_MoveRecord",
			id: parseInt(this.id.substr(3)),
			newId: this.valueAsNumber-1
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

	chrome.runtime.onMessage.addListener((message)=>{
		console.log(message);
		
		if(message.type === "ScheduleBlock_Options_SetTableData"){
			contructViewCallback(message.data);
		}else if(message.type === "ScheduleBlock_Options_OpenEditMenu"){
			openRecordEditMenuCallback(message.data);
		}else if(message.type === "ScheduleBlock_Options_Initialize"){
			console.log(message);
			
			let tmpLangIndex = tp.getStringVersions(0).indexOf(message.properties.Language);
			if(tmpLangIndex != -1){
				document.querySelector("#langPicker").selectedIndex = tmpLangIndex;
				tp.setLanguageIndex(tmpLangIndex);
			}
			
			document.querySelector("#freqPicker").value = message.properties.CheckFrequency;
			
			document.querySelector("#rebuildPersistantStylesheet")
					.innerText = "* { background-color: " + message.properties.Background + "; }";
			
			document.querySelector("#colorPicker").value = message.properties.Background;
			
			document.querySelector("#lockScreenBase").value = message.properties.LockScreenBase;
			
			translateGUI();
		}else if(message.type === "ScheduleBlock_Options_ImportFailed"){
			alert("Import failed because:\n" + message.reason);
		}else if(message.type === "ScheduleBlock_Options_Export"){
			let a = document.createElement("a");
			let file = new Blob([message.settings], {type: 'application/json'});
			a.href = URL.createObjectURL(file);
			a.download = "ScheduleBlockBackup_" + new Date().toISOString().slice(0, 10);
			a.click();
		}
	});



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
						type: "ScheduleBlock_RecordStorage_ImportSettings",
						newSettings: text
					});
			});
			document.getElementById("import2").value = "";
		}
	});
	document.getElementById("export").addEventListener("click", ()=>{
		let sending = chrome.runtime.sendMessage(
		{
			type: "ScheduleBlock_RecordStorage_ExportSettings",
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
		let sending = chrome.runtime.sendMessage(
			{
				type: "ScheduleBlock_InitializeOptions"
			});
		
		
		// Set up color change listener
		document.getElementById("colorPicker").addEventListener("change", (e) => {
			document.querySelector("#rebuildPersistantStylesheet")
				.innerText = "* { background-color: " + e.srcElement.value + "; }";
		});
	}


	// Set up settings button and settings overlay listeners
	{
		let languageBackup, intervalBackup, colorBackup, lockScreenBaseBackup;
		document.getElementById("settingsButton").addEventListener("click", (e) => {
			if(document.getElementById("settingsButton") !== event.target) return;
			
			languageBackup = tp.getStringVersions(0)[document.getElementById("langPicker")
																	.selectedIndex];
			intervalBackup = parseInt(document.getElementById("freqPicker").value);
			colorBackup = document.getElementById("colorPicker").value;
			lockScreenBaseBackup = document.getElementById("lockScreenBase").value;
			
			document.getElementById("settingsChangeOverlay").style.display = "flex";
		});
		
		function resetSettingsBackups(){
			document.getElementById("langPicker").value = tp.getStringVersions(0)
																.indexOf(languageBackup);
			document.getElementById("freqPicker").value = intervalBackup;
			document.getElementById("colorPicker").value = colorBackup;
			document.getElementById("lockScreenBase").value = lockScreenBaseBackup;
			
			[document.getElementById("langPicker"),
			 document.getElementById("freqPicker"),
			 document.getElementById("colorPicker"),
			 document.getElementById("lockScreenBase")
			].forEach((i)=>{i.dispatchEvent(new UIEvent('change', {
														'view': window,
														'bubbles': true,
														'cancelable': true}));});
		}
		
		
		// On change validators
		document.getElementById("lockScreenBase")
			.addEventListener("change", (e) => validateURLInput(e.target, tp));
		
		
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
			if(!validateURLInput(document.getElementById("lockScreenBase"), tp))
				return;
			
			let newLangIndex = document.getElementById("langPicker").selectedIndex;
			let newLangName = tp.getStringVersions(0)[newLangIndex];
			let newCheckFrequency = parseInt(document.getElementById("freqPicker").value);
			let newBackground = document.getElementById("colorPicker").value;
			let newLockScreenBase = document.getElementById("lockScreenBase").value;
			
			let sending = chrome.runtime.sendMessage(
			{
				type: "ScheduleBlock_SaveGeneralProperties",
				newProperties: {Language: newLangName,
									CheckFrequency: newCheckFrequency,
									Background: newBackground,
									LockScreenBase: newLockScreenBase}
			});
			document.getElementById("settingsChangeOverlay").style.display = "none";
		});
				
		
	}

	// Set up edit menu listeners
	{
		let enableActionInputs = (bits) => {
			let inputs = [document.getElementById("destinationInput"),
							document.getElementById("actionInputCustomCodeArea")];
			for(let ii=0; ii < inputs.length; ++ii){
				inputs[ii].disabled = ((bits >> ii) & 1) !== 1;
			}			
		};
		
		document.getElementById("actionInputClose")
			.addEventListener("click", () => { enableActionInputs(0); });
		document.getElementById("actionInputLockPage")
			.addEventListener("click", () => { enableActionInputs(0); });
		document.getElementById("actionInputRedirect")
			.addEventListener("click", () => { enableActionInputs(1); });
		document.getElementById("actionInputCustom")
			.addEventListener("click", () => { enableActionInputs(2); });
		
		
		
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
					type: "ScheduleBlock_RecordStorage_DeleteRecord",
					id: recnum
				});
				document.getElementById("recordEditOverlay").style.display = "none";
			}
		});

		
		// On change validators
		document.getElementById("softLockHoursInput")
			.addEventListener("change", (e)=> validateTimeStringInput(e, tp));
		document.getElementById("hardLockHoursInput")
			.addEventListener("change", (e)=> validateTimeStringInput(e, tp));
		document.getElementById("timeoutStringInput")
			.addEventListener("change", (e)=> validateTimeoutStringInput(e, tp));
		
		document.getElementById("recordEditOK").addEventListener("click", (e) => {
			let softhoursInput = document.getElementById("softLockHoursInput");
			let hardhoursInput = document.getElementById("hardLockHoursInput");
			let timeoutStringInput = document.getElementById("timeoutStringInput");
			
			if(!validateTimeStringInput({target:softhoursInput}, tp) || 
				!validateTimeStringInput({target:hardhoursInput}, tp) ||
				!validateTimeoutStringInput({target:timeoutStringInput}, tp)){
				return;
			}
			
			let sending = chrome.runtime.sendMessage(
			{
				type: "ScheduleBlock_RecordStorage_EditRecord",
				id: recnum,
				newValue: Record.toJSON([
								new Record(document.getElementById("patternInput").value, 
										softhoursInput.value, hardhoursInput.value,
										timeoutStringInput.value,
				(document.getElementById("actionInputClose").checked ? 
						"window.close();" :
				document.getElementById("actionInputLockPage").checked ? 
						"window.location = '$ScheduleBlock_LockScreen$';" :
				document.getElementById("actionInputRedirect").checked ?
						"window.location = '" + document.getElementById("destinationInput").value + "';" :
						document.getElementById("actionInputCustomCodeArea").value))])
			});
			document.getElementById("recordEditOverlay").style.display = "none";
		});
	}

	// Construct table
	//constructView();
	//translateGUI();
}
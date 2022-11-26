/**
 * @file Describes behaviour of interactive elements of extension's options page.
 * @author sdasda7777
 */

// This is object containing all text of the user interface, to allow for translations.
// Translating the user interface into new language should not require changing anything else.
const interfaceStrings = {
	
	// The key 0 contains name of the language, for use in the language combobox.
	// The order must be: english first (since it is the language this project is developed in, 
	//   and if translations are missing, they will default to english), 
	//   and then all other languages ordered by Unicode values of the characters.
	// At all following keys, the translations must be at the same index as the name of the language.
	0: ["english",
		 "čeština"],
	1: ["OK",
		"Budiž"],
	2: ["Cancel",
		"Zrušit"],
	
	// These keys belong to the controls at the top of the page
	101: ["Language:",
		    "Jazyk:"],
	102: ["Background color:",
			"Barva pozadí:"],
	103: ["Import settings",
	        "Importovat nastavení"],
	104: ["Export settings",
			"Exportovat nastavení"],
	105: ["Check period (in seconds):",
			"Perioda kontrol (v sekundách):"],
	
	
	// These keys belong to the main table and controls around and in it
		201: ["Enter websites, times when you want them blocked, and where you want them to redirect you (the term soft lock refers to a state when only new tabs cannot be opened, the term hard lock refers to state when even already open tabs will be redirected):",
		
				"Zadejte stránky, časy, ve které je chcete mít zablokované a kam chcete být přesměrováni (pojem nenavštívitelnost odkazuje na stav, kdy pouze nepůjde otevřít nové karty, pojem znepřístupnění odkazuje na stav, kdy i již otevřené karty budou přesměrovány):"],
	
		210: ["#",
				"#"],
		211: ["Regular expression",
				"Regulární výraz"],
		212: ["Soft locked hours/days",
				"Časy nenavštívitelnosti"],
		213: ["Hard locked hours/days",
				"Časy znepřístupnění"],
		214: ["Timeouts",
				"Časovače"],
		215: ["Destination",
				"Destinace"],
		216: ["Edit",
				"Upravit"],
		217: ["Delete",
				"Odstranit"],

	
		301: ["Must be time intervals in 24 hour format separated by commas. "+
				"Groups of intervals for individual days may be separated with |. ",
				
				"Musí být časové intervaly v 24-hodinovém formátu oddělené čárkami. "+
				"Skupiny intervalů na jednotlivé dny mohou být oddělené symbolem |. "],
		
		302: ["Must be a time duration in format ((H+:)?(MM?:)?SS?), " +
				"preserving unit constraints 00-59 if larger unit is present.",
				
				"Musí být časová doba ve formátu ((H+:)?(MM?:)?SS?), " + 
				"která zachovává omezení jednotek na 00-59 pokud je přítomna větší jednotka."],
		305: ["There is no way to retrieve deleted record, other than importing exported settings or creating it again. " +
				"Are you absolutely sure you want to delete the record \n" + 
				"('{0}' => '{1}' @ (s'{2}' | h'{3}'))\n" +
				"from the list?",
				
				"Neexistuje žádný způsob jak obnovit jednou smazaný záznam, kromě obnovení z exportované zálohy nebo nového vytvoření. " +
				"Jste si naprosto jisti, že chcete vymazat záznam \n" +
				"('{0}' => '{1}' @ (s'{2}' | h'{3}'))\n" +
				"ze seznamu pravidel?"],
		
		350: ["Regular expression that matches the site you want to be blocked",
				"Regulární výraz objímající stránky, které chcete zablokovat"],
		351: ["Add to the list",
				"Přidat na seznam"],
	
	
	// These keys belong to the pattern tester
	401: ["Regular expression tester",
			"Tester regulárních výrazů"],
	402: ["Regular expression to test",
			"Regulární výraz k otestování"],
	403: ["Website to test against",
			"Webová stránka k otestování"],
	404: ["Result:",
			"Výsledek:"],
	405: ["Not matching",
			"Nevyhovuje"],
	406: ["Matching",
			"Vyhovuje"],
	407: ["Check",
			"Otestovat"],
	
	// This is the personal message
	451: ["Personal Message",
			"Osobní zpráva"],
	// It feels weird to use "we", but using "I" would mean changing it the second anyone else does anything, so...
	452: ["Hey, this is the least intrusive way we could think of contacting you.<br/><br/>" +
			"We want you to know that we deeply care about your experience with this little extension. If there is any way we could improve it to make your life easier, let us know, either in a review or by creating an issue on <a href=\"https://github.com/sdasda7777/ScheduleBlock\">project's GitHub page</a>. Same goes for any bugs you might find.<br/><br/>" + 
			"Last but not least, we believe in you, and you've got this.",
			
			"Dobrý den, toto je nejméně rušivý způsob, jakým nás napadlo Vás kontaktovat.<br/><br/>" +
			"Chceme, abyste věděli, že nám záleží na zážitku z používání tohoto malého rozšíření. Pokud by Vás napadl jakýkoli způsob, kterým bychom ho mohli vylepšit, abychom Vám usnadnili život, neváhejte nás kontaktovat, ať už v recenzi, nebo vytvořením Issue na <a href=\"https://github.com/sdasda7777/ScheduleBlock\">stránce projektu na GitHubu</a>. To samé platí o jakýchkoli chybách, které můžete najít.<br/><br/>" + 
			"V poslední řadě chceme, abyste věděli, že ve Vás věříme."]
};

let languageIndex = 0;

function getTranslatedString(messageCode){
	if(!(messageCode in interfaceStrings))
		return false;
	if(languageIndex < interfaceStrings[messageCode].length && interfaceStrings[messageCode][languageIndex] != "")
		return interfaceStrings[messageCode][languageIndex];
	return interfaceStrings[messageCode][0];
}

function translateGUI(){
	document.querySelector("#langPickerLabel").innerText = getTranslatedString(101);
	document.querySelector("#freqPickerLabel").innerText = getTranslatedString(105);
	document.querySelector("#colorPickerLabel").innerText = getTranslatedString(102);
	document.querySelector("#import").value = getTranslatedString(103);
	document.querySelector("#export").value = getTranslatedString(104);
	
	document.querySelector("#settingsMenuOK").value = getTranslatedString(1);
	document.querySelector("#settingsMenuCancel").value = getTranslatedString(2);
	
	document.querySelector("#patternInputLabel").innerText = getTranslatedString(211) + ":";
	document.querySelector("#softLockHoursLabel").innerText = getTranslatedString(212) + ":";
	document.querySelector("#hardLockHoursLabel").innerText = getTranslatedString(213) + ":";
	document.querySelector("#timeoutsLabel").value = getTranslatedString(216) + ":";
	document.querySelector("#destinationLabel").value = getTranslatedString(215) + ":";
	document.querySelector("#recordEditDelete").value = getTranslatedString(217);
	
	document.querySelector("#recordEditOK").value = getTranslatedString(1);
	document.querySelector("#recordEditCancel").value = getTranslatedString(2);
	
	/*
	getTranslatedString(210), getTranslatedString(211),
										getTranslatedString(212), getTranslatedString(213),
										getTranslatedString(216), getTranslatedString(214), 
										getTranslatedString(215)
	*/
	
	document.querySelector("#tableHint").innerText = getTranslatedString(201);
	document.querySelector("#newsite").placeholder = getTranslatedString(350);
	document.querySelector("#newsiteadd").value = getTranslatedString(351);
	
	document.querySelector("#testertitle").innerText = getTranslatedString(401);
	document.querySelector("#testerinput1").placeholder = getTranslatedString(402);
	document.querySelector("#testerinput2").placeholder = getTranslatedString(403);
	document.querySelector("#testerresultlabel").innerText = getTranslatedString(404);
	let testerresult = document.querySelector("#testerresult");
	if(testerresult.getAttribute("result") == "matching"){
		testerresult.innerText = getTranslatedString(406);
	}else{
		testerresult.innerText = getTranslatedString(405);
	}
	document.querySelector("#testerbutton").value = getTranslatedString(407);
	
	document.querySelector("#personalmessagetitle").innerText = getTranslatedString(451);
	document.querySelector("#personalmessagecontent").innerHTML = getTranslatedString(452);
	
	constructView();
}


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

/**
 * Validates settings JSON
 * @param {string} jsonString
 */
function validateExportedJSON(jsonString){
	if(!jsonString){
		console.log("Settings empty or generally invalid");
		return false;
	}
	
	let arr = null;
	
	try{
		arr = JSON.parse(jsonString);
	}catch{
		console.log("Settings could not be parsed by JSON parser");
		return false;
	}
	
	//console.log(arr);
	
	if(!(arr instanceof Array)){
		console.log("Settings do not parse into array");
		return false;
	}
	
	for(let ii = 0; ii < arr.length; ++ii){
		if(arr[ii].regex == undefined || typeof arr[ii].regex != "string"){
			console.log("Settings invalid at record {0}, regular expression is invalid".format(ii+1));
			return false;
		}
		if(arr[ii].softhours == undefined || typeof arr[ii].softhours != "string" ||
				!validateTimeString(arr[ii].softhours)){
			console.log("Settings invalid at record {0}, soft locked time is invalid".format(ii+1));
			return false;
		}
		if(arr[ii].hardhours == undefined || typeof arr[ii].hardhours != "string"  ||
				!validateTimeString(arr[ii].hardhours)){
			console.log("Settings invalid at record {0}, hard locked time is invalid".format(ii+1));
			return false;
		}
		if(arr[ii].destination == undefined || typeof arr[ii].destination != "string"){
			console.log("Settings invalid at record {0}, destination url is invalid".format(ii+1));
			return false;
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
	
	if(!validateExportedJSON(jsonstring)) return false;
	
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
		
		let newsiteelement = document.getElementById("newsite");
		if(newsiteelement.value === "") return;
		
		arr.push({"regex": newsiteelement.value, "softhours":"00:00-23:59", "hardhours":"00:00-23:59", 
										"timeouts": {
											"normal-break": 0,
											"normal-timeout": 0,
											"softlock-break": 0,
											"softlock-timeout": 0,
											"current-streak": 0,
											"last-check": new Date()
										},
										
										"destination": "about:blank"});
		chrome.storage.sync.set({websites:JSON.stringify(arr)});
		newsiteelement.value = "";
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
		const headerInnerTexts = [getTranslatedString(210), getTranslatedString(211),
										getTranslatedString(212), getTranslatedString(213),
										getTranslatedString(214), getTranslatedString(215), 
										getTranslatedString(216)];
		for(let ii = 0; ii < headerInnerTexts.length; ++ii){
			let tempHeader = document.createElement("th");
			tempHeader.innerText = headerInnerTexts[ii];
			headerRow.appendChild(tempHeader);
		}
		t.appendChild(headerRow);
		
		/*
		const changeButtonsIds = ["chp", "chs", "chh", "cht",
											"chd", "rmr"];
		const changeButtonsTexts = [getTranslatedString(251), getTranslatedString(252),
											getTranslatedString(253), getTranslatedString(256),
											getTranslatedString(254),
											getTranslatedString(255)];
		const changeButtonsFunctions = [changePattern, changeSoftHours, changeHardHours, 
												changeTimeouts, changeDestination];
		*/
		
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
				
				let timeouts = document.createElement("td");
				if(arr[ii].timeouts){
					//timeouts.innerHTML = arr[ii].timeouts.replace(/\|/g, "|<br>");
				}
				row.appendChild(timeouts);
				
				let des = document.createElement("td");
				if(arr[ii].destination){
					des.innerText = arr[ii].destination;
				}
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
		
		document.getElementById("display").appendChild(t);
	};
	
	chrome.storage.sync.get(['websites'], callback);
}

let recnum = 0;

function openRecordEditMenu(e){
	function intToTime(timeAsInt){
		let seconds = timeAsInt % 60;
		let minutes = (timeAsInt - seconds) % 3600 / 60;
		let hours = (timeAsInt - 60 * minutes - seconds) / 3600;
				
		return hours + ":" + 
				("00" + minutes).slice(-2) + ":" + 
				("00" + seconds).slice(-2);
	}
	
	recnum = parseInt(this.id.substr(4));
	let callback = (result) => {
		if(!result.websites) return;
		let arr = JSON.parse(result.websites);
		if(recnum >= arr.length) return;
		
		
		document.getElementById("patternInput").value = (arr[recnum].regex ?
															arr[recnum].regex : "");
		document.getElementById("softLockHoursInput").value = (arr[recnum].softhours ?
															arr[recnum].softhours : "");
		document.getElementById("hardLockHoursInput").value = (arr[recnum].hardhours ?
															arr[recnum].hardhours : "");
				
		document.getElementById("timeoutsNATInput").value =
					(arr[recnum].timeouts && arr[recnum].timeouts["normal-break"] ?
						intToTime(arr[recnum].timeouts["normal-break"]) : "0");
		document.getElementById("timeoutsNTOInput").value =
					(arr[recnum].timeouts && arr[recnum].timeouts["normal-timeout"] ?
						intToTime(arr[recnum].timeouts["normal-timeout"]) : "0");
		document.getElementById("timeoutsSATInput").value =
					(arr[recnum].timeouts && arr[recnum].timeouts["softlock-break"] ?
						intToTime(arr[recnum].timeouts["softlock-break"]) : "0");
		document.getElementById("timeoutsSTOInput").value =
					(arr[recnum].timeouts && arr[recnum].timeouts["softlock-timeout"] ?
						intToTime(arr[recnum].timeouts["softlock-timeout"]) : "0");
		
		document.getElementById("destinationInput").value = (arr[recnum].destination ?
															arr[recnum].destination : "");		
		
		document.getElementById("recordEditOverlay").style.display = "flex";
	}
	
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
	
	let testerresult = document.querySelector("#testerresult");
	
	if(str.match(new RegExp(re))){
		console.log("Tester: '" + re + "' matches '" + str + "'");
		testerresult.setAttribute("result", "matching");
		testerresult.innerText = getTranslatedString(406);
	}else{
		console.log("Tester: '" + re + "' does not match '" + str + "'");
		testerresult.setAttribute("result", "not_matching");
		testerresult.innerText = getTranslatedString(405);
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
document.getElementById("testerbutton").addEventListener("click", testRegex);
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


// Set up language picker
{
	let picker = document.querySelector("#langPicker");
	
	for (let lang in picker){
		picker.remove(lang);
	}
		
	for (let lang in interfaceStrings[0]){
		let option = document.createElement('option');
		option.value = lang;
		option.innerHTML = interfaceStrings[0][lang];
		picker.appendChild(option);
	}
	
	picker.addEventListener("change", (e) => {
		let newLanguageName = interfaceStrings[0][e.target.selectedIndex];
		
		let callback = (result) => {
			chrome.storage.sync.set({ScheduleBlockOptionsLanguage: newLanguageName});
		};
		
		chrome.storage.sync.get(['ScheduleBlockOptionsLanguage'], callback);
		
		languageIndex = e.target.selectedIndex;
		translateGUI();
	});
}

// Load preferred language
{
	let callback = (result) => {
		let preferredLanguage = "english";
		if(result.ScheduleBlockOptionsLanguage)
			preferredLanguage = result.ScheduleBlockOptionsLanguage;
		
		let tmpLangIndex = interfaceStrings[0].indexOf(preferredLanguage);
		if(tmpLangIndex != -1){
			document.querySelector("#langPicker").selectedIndex = tmpLangIndex;
			languageIndex = tmpLangIndex;
			translateGUI();
		}
	};
	
	chrome.storage.sync.get(['ScheduleBlockOptionsLanguage'], callback);
}

// Load preferred check frequency
{
	let callback = (result) => {
		let preferredFrequency = (result.ScheduleBlockOptionsCheckFrequency ?
									result.ScheduleBlockOptionsCheckFrequency
									: 15);
		document.querySelector("#freqPicker").value = preferredFrequency;
	};
	
	chrome.storage.sync.get(['ScheduleBlockOptionsCheckFrequency'], callback);
}


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
	
	document.getElementById("colorPicker").addEventListener("change", (e) => {
		let newColor = e.srcElement.value;
		
		let stylesheet = document.querySelector("#rebuildPersistantStylesheet");
		stylesheet.innerText = "* { background-color: " + newColor + "; }";
	});
}


// Set up settings button and settings overlay listeners
{
	let languageBackup = "english";
	let intervalBackup = 15;
	let colorBackup = "#808080";
	document.getElementById("settingsButton").addEventListener("click", (e) => {
		if(document.getElementById("settingsButton") !== event.target) return;
		
		languageBackup = interfaceStrings[0][document.getElementById("langPicker")
																.selectedIndex];
		intervalBackup = parseInt(document.getElementById("freqPicker").value);
		colorBackup = document.getElementById("colorPicker").value;
		
		document.getElementById("settingsChangeOverlay").style.display = "flex";
	});
	
	function resetSettingsBackups(){
		document.getElementById("langPicker").value = interfaceStrings[0]
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
		let newLangName = interfaceStrings[0][newLangIndex];
		let callback1 = (result) => {
			chrome.storage.sync.set({ScheduleBlockOptionsLanguage: newLangName});
		};
		chrome.storage.sync.get(['ScheduleBlockOptionsLanguage'], callback1);
			
		let callback2 = (result) => {
			chrome.storage.sync.set({ScheduleBlockOptionsCheckFrequency:
							parseInt(document.getElementById("freqPicker").value)});
		};
		chrome.storage.sync.get(['ScheduleBlockOptionsCheckFrequency'], callback2);
		
		let callback3 = (result) => {
			chrome.storage.sync.set({ScheduleBlockOptionsBackground:
									document.getElementById("colorPicker").value});
		};
		chrome.storage.sync.get(['ScheduleBlockOptionsBackground'], callback3);
		
		document.getElementById("settingsChangeOverlay").style.display = "none";
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
		let callback = (result) => {
			if(!result.websites) return;
			let arr = JSON.parse(result.websites);
			if(recnum >= arr.length) return;
			
			affirmative = confirm(getTranslatedString(305)
											.format(arr[recnum].regex,
													arr[recnum].destination,
													arr[recnum].softhours,
													arr[recnum].hardhours));
			
			if(affirmative){
				arr.splice(recnum, 1);
				document.getElementById("recordEditOverlay").style.display = "none";
			}
			
			chrome.storage.sync.set({websites:JSON.stringify(arr)});
			constructView();
		};
		
		chrome.storage.sync.get(['websites'], callback);
	});
	
	
	
	// On change validators
	let validateTimeStringInput = (e) => {
		if(!validateTimeString(e.target.value)){
			e.target.setCustomValidity(getTranslatedString(301));
			e.target.reportValidity();
			return false;
		}else{
			e.target.setCustomValidity("");
			return true;
		}
	};
	document.getElementById("softLockHoursInput")
		.addEventListener("change", validateTimeStringInput);
	document.getElementById("hardLockHoursInput")
		.addEventListener("change", validateTimeStringInput);
	
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
	
	let validateTimeoutStringInput = (e) => {
		if(!validateTimeoutString(e.target.value)){
			e.target.setCustomValidity(getTranslatedString(302));
			e.target.reportValidity();
			return false;
		}else{
			e.target.setCustomValidity("");
			return true;
		}
	}
	document.getElementById("timeoutsNATInput")
		.addEventListener("change", validateTimeoutStringInput);
	document.getElementById("timeoutsNTOInput")
		.addEventListener("change", validateTimeoutStringInput);
	document.getElementById("timeoutsSATInput")
		.addEventListener("change", validateTimeoutStringInput);
	document.getElementById("timeoutsSTOInput")
		.addEventListener("change", validateTimeoutStringInput);
	
	function timeToInt(timeoutString){
		let sum = 0;
		let arr = timeoutString.split(":").reverse().map((i)=>(parseInt(i)));
		for(let ii = 0; ii < arr.length; ++ii){
			sum += arr[ii] * Math.pow(60, ii);
		}
		return sum;
	}
	
	document.getElementById("recordEditOK").addEventListener("click", (e) => {
		let callback = (result) => {
			if(!result.websites) return;
			let arr = JSON.parse(result.websites);
			if(recnum >= arr.length) return;
			
				
			let softhoursInput = document.getElementById("softLockHoursInput");
			let hardhoursInput = document.getElementById("hardLockHoursInput");
			let timeoutsNATInput = document.getElementById("timeoutsNATInput");
			let timeoutsNTOInput = document.getElementById("timeoutsNTOInput");
			let timeoutsSATInput = document.getElementById("timeoutsSATInput");
			let timeoutsSTOInput = document.getElementById("timeoutsSTOInput");
			
			if(!validateTimeStringInput({target:softhoursInput}) || 
				!validateTimeStringInput({target:hardhoursInput}) ||
				!validateTimeoutStringInput({target:timeoutsNATInput}) ||
				!validateTimeoutStringInput({target:timeoutsNTOInput}) ||
				!validateTimeoutStringInput({target:timeoutsSATInput}) ||
				!validateTimeoutStringInput({target:timeoutsSTOInput})){
				return;
			}
			
			
			arr[recnum].regex = document.getElementById("patternInput").value;
			arr[recnum].softhours = softhoursInput.value;
			arr[recnum].hardhours = hardhoursInput.value;
			arr[recnum].timeouts = (arr[recnum].timeouts ? arr[recnum].timeouts : {
											"normal-break": 0,
											"normal-timeout": 0,
											"softlock-break": 0,
											"softlock-timeout": 0,
											"current-streak": 0,
											"last-check": new Date()
										});
			
			arr[recnum].timeouts["normal-break"] = timeToInt(timeoutsNATInput.value);
			arr[recnum].timeouts["normal-timeout"] = timeToInt(timeoutsNTOInput.value);
			arr[recnum].timeouts["softlock-break"] = timeToInt(timeoutsSATInput.value);
			arr[recnum].timeouts["softlock-timeout"] = timeToInt(timeoutsSTOInput.value);
			
			document.getElementById("recordEditOverlay").style.display = "none";
			
			chrome.storage.sync.set({websites:JSON.stringify(arr)});
			constructView();
		};
		
		chrome.storage.sync.get(['websites'], callback);
	});
	
	
}


// Construct table
constructView();
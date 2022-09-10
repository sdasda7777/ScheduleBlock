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
	
	
	// These keys belong to the controls at the top of the page
	101: ["Language:",
		    "Jazyk:"],
	102: ["Background color:",
			"Barva pozadí:"],
	103: ["Import settings",
	        "Importovat nastavení"],
	104: ["Export settings",
			"Exportovat nastavení"],
	
	
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
		214: ["Destination",
				"Destinace"],
		215: ["Change record",
				"Upravit záznam"],
		
		251: ["Expression",
				"Výraz"],
		252: ["Soft hours",
				"Nenavštívitelnost"],
		253: ["Hard hours",
				"Znepřístupnění"],
		254: ["Destination",
				"Destinace"],
		255: ["Remove",
				"Odstranit"],
	
		301: ["Enter new regular expression describing the set of sites you want to forbid. \n" +
				"For example expression '.*\\.reddit\\.com.*' will apply the rule to any address containing string '.reddit.com'.",
				
				"Zadejte nový regulární výraz popisující sadu stránek které chcete zakázat." +
				"Například výraz '.*\\.reddit\\.com.*' bude aplikovat pravidlo na jakoukoli adresu obsahující řetězec '.reddit.com'."],
		302: ["Enter new time intervals in 24 hour format, separated by commas. "+
				"You can also enter intervals for individual days by separating days with |. "+
				"If amount of days is not 7, modulo is used. \n"+
				"For example, '12:00-14:15,15:30-16:45|9:00-19:00' will make it impossible to visit "+
				"the given site from 12:00 to 14:15 and from 15:30 to 16:45 on odd days "+
				"(counting Sunday as the first day) and from 9:00 to 19:00 on even days.",
				
				"Zadejte nové časové intervaly v 24-hodinovém formátu, oddělené čárkami. "+
				"Můžete také zadat intervaly na jednotlivé dny, oddělením dnů symbolem |. "+
				"Pokud počet dnů není 7, je použito modulo. \n"+
				"Například, '12:00-14:15,15:30-16:45|9:00-19:00' zakáže navštívení dané stránky "+
				"od 12:00 do 14:15 a od 15:30 do 16:45 v liché dny "+
				"(počítaje neděli jako první den) a od 9:00 do 19:00 v sudé dny."],
		303: ["Enter new time intervals in 24 hour format, separated by commas. "+
			    "You can also enter intervals for individual days by separating days with |. "+
				"If amount of days is not 7, modulo is used.\n"+
				"For example, '12:00-14:15,15:30-16:45|9:00-19:00' will redirect from "+
				"the given site from 12:00 to 14:15 and from 15:30 to 16:45 on odd days "+
				"(counting Sunday as the first day) and from 9:00-19:00 on even days.",
				
				"Zadejte nové časové intervaly v 24-hodinovém formátu, oddělené čárkami. "+
				"Můžete také zadat intervaly na jednotlivé dny, oddělením dnů symbolem |. "+
				"Pokud počet dnů není 7, je použito modulo. \n"+
				"Například, '12:00-14:15,15:30-16:45|9:00-19:00' znepřístupní danou stránku "+
				"od 12:00 do 14:15 a od 15:30 do 16:45 v liché dny "+
				"(počítaje neděli jako první den) a od 9:00 do 19:00 v sudé dny."],
		304: ["Enter new destination. The address should include protocol (most likely http:// or https://), " +
				"otherwise undesired behaviour may occur.\n" +
				"It is advised to use an address that does not match the pattern of the record, " +
				"as failing to do so will lead to an endless loop.",
				
				"Zadejte novou destinaci. Adresa by měla obsahovat protokol (nejpravděpodobněji http:// nebo https://), " +
				"jinak může dojít k neočekávanému chování.\n" +
				"Doporučujeme použít adresu která neodpovídá regulárnímu výrazu pravidla, " +
				"protože v takovém případě by došlo k nekonečné smyčce."],
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

function translateInterface(){
	document.querySelector("#langPickerLabel").innerText = getTranslatedString(101);
	document.querySelector("#colorPickerLabel").innerText = getTranslatedString(102);
	document.querySelector("#import").value = getTranslatedString(103);
	document.querySelector("#export").value = getTranslatedString(104);
	
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
				let res = timeRegex.exec(times[kk]);
				
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
		const headerInnerTexts = [getTranslatedString(210), getTranslatedString(211),
										getTranslatedString(212), getTranslatedString(213),
										getTranslatedString(214), getTranslatedString(215)];
		for(let ii = 0; ii < headerInnerTexts.length; ++ii){
			let tempHeader = document.createElement("th");
			tempHeader.innerText = headerInnerTexts[ii];
			headerRow.appendChild(tempHeader);
		}
		t.appendChild(headerRow);
		
		
		const changeButtonsIds = ["chp", "chs", "chh",
											"chd", "rmr"];
		const changeButtonsTexts = [getTranslatedString(251), getTranslatedString(252),
											getTranslatedString(253), getTranslatedString(254),
											getTranslatedString(255), getTranslatedString(256)];
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
		
		let r = window.prompt(getTranslatedString(301), arr[recnum].regex);
		
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
			r = window.prompt(getTranslatedString(302), r);
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
			r = window.prompt(getTranslatedString(303),	r);
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
		
		let r = window.prompt(getTranslatedString(304),
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
		
		let affirmative = confirm(getTranslatedString(305).format(arr[recnum].regex,
																			arr[recnum].destination,
																			arr[recnum].softhours,
																			arr[recnum].hardhours));
		
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
		translateInterface();
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
			translateInterface();
		}
	};
	
	chrome.storage.sync.get(['ScheduleBlockOptionsLanguage'], callback);
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


// Construct table
constructView();
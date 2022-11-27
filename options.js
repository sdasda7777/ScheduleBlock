/**
 * @file Describes behaviour of interactive elements of extension's options page.
 * @author sdasda7777
 */


let recnum = 0;
let rs = new RecordStorage();
let tp = new TranslationProvider();
validator_tp = tp;
		
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
		rs.createNewRecord(
			document.getElementById("newsite").value,
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
	let t = document.createElement("table");
	
	// Generate table header row
	let headerRow = document.createElement("tr");
	const headerInnerTexts = [
		tp.getTranslatedString(210),
		tp.getTranslatedString(211),
		tp.getTranslatedString(212),
		tp.getTranslatedString(213),
		tp.getTranslatedString(214),
		tp.getTranslatedString(215),
		tp.getTranslatedString(216)];
		
	for(let ii = 0; ii < headerInnerTexts.length; ++ii){
		let tempHeader = document.createElement("th");
		tempHeader.innerText = headerInnerTexts[ii];
		headerRow.appendChild(tempHeader);
	}
	t.appendChild(headerRow);
	
	let callbackFin = (arr) => {
		document.getElementById("display").innerHTML = "";				
		document.getElementById("display").appendChild(t);
	};
	
	let callback = (id, rec) => {
		//logX(rec);
		let row = document.createElement("tr");
		
		// Create order number control
		let recordNumberCell = document.createElement("td");
		let recordNumberBox = document.createElement("input");
		recordNumberBox.id = "mvt"+id;
		recordNumberBox.type = "number";
		recordNumberBox.value = (id+1);
		recordNumberBox.min = "1";
		recordNumberBox.addEventListener("keyup", recordNumberBoxKeyEventHandler);
		recordNumberCell.appendChild(recordNumberBox);
		row.appendChild(recordNumberCell);
		
		// Create cells displaying information about records
		{
			let pattern = document.createElement("td");
			pattern.innerText = rec.getRegex();
			row.appendChild(pattern);
			
			let softhours = document.createElement("td");
			softhours.innerHTML = rec.getSoftHours().replace(/\|/g, "|<br>");
			row.appendChild(softhours);
			
			let hardhours = document.createElement("td");
			hardhours.innerHTML = rec.getHardHours().replace(/\|/g, "|<br>");
			row.appendChild(hardhours);
			
			let timeouts = document.createElement("td");
			timeouts.innerHTML = ""+(rec.getNormalBreak() ?
										intToTime(rec.getNormalBreak()) : 0) +
									  "/"+(rec.getNormalTimeout() ?
										intToTime(rec.getNormalTimeout()) : 0);
			row.appendChild(timeouts);
			
			let des = document.createElement("td");
			des.innerText = rec.getDestination();
			row.appendChild(des);
		}
		
		// Create edit button
		let editCell = document.createElement("td");
		editCell.className = "editCell";
		let editButton = document.createElement("input");
		editButton.id = "edit" + id;
		editButton.type = "button";
		editButton.className = "editButton"
		editButton.value = "";
		editButton.addEventListener("click", openRecordEditMenu);
		editCell.appendChild(editButton);
		row.appendChild(editCell);
		
		t.appendChild(row);
	};
	
	rs.forEach(callback, callbackFin);
}

function openRecordEditMenu(e){
	recnum = parseInt(this.id.substr(4));
	let callback = (rec) => {
		document.getElementById("patternInput").value = rec.getRegex();
		document.getElementById("softLockHoursInput").value = rec.getSoftHours();
		document.getElementById("hardLockHoursInput").value = rec.getHardHours();
				
		document.getElementById("timeoutsNATInput").value = intToTime(rec.getNormalBreak());
		document.getElementById("timeoutsNTOInput").value = intToTime(rec.getNormalTimeout());
		
		document.getElementById("destinationInput").value = rec.getDestination();		
		
		document.getElementById("recordEditOverlay").style.display = "flex";
	}
	
	rs.forOne(recnum, callback);
}

/**
 * Handles record number modification (i.e. reordering) using keyboard.
 * @param {KeyboardEvent} e - keyup event to be handled
 */
function recordNumberBoxKeyEventHandler(e){
	if (e.keyCode !== 13) return;
	
	e.preventDefault();
	
	rs.moveRecord(parseInt(this.id.substr(3)),
					this.valueAsNumber-1,
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
			.then(t => {rs.importSettings(t, ()=>{constructView();})});
		
		// This line clears FileList, so that this event will get called properly next time as well
		document.getElementById("import2").value = "";
	}
});
document.getElementById("export").addEventListener("click", rs.exportSettings);


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
		let preferredLanguage = "english";
		if(result.Language)
			preferredLanguage = result.Language;
		
		let preferredFrequency = 15;
		if(result.CheckFrequency)
			preferredFrequency = result.CheckFrequency;
		
		let preferredColor = "#808080";
		if(result.Background)
			preferredColor = result.Background;
		
		
		let tmpLangIndex = tp.getStringVersions(0).indexOf(preferredLanguage);
		if(tmpLangIndex != -1){
			document.querySelector("#langPicker").selectedIndex = tmpLangIndex;
			tp.setLanguageIndex(tmpLangIndex);
			translateGUI();
		}
		
		document.querySelector("#freqPicker").value = preferredFrequency;
		
		document.querySelector("#rebuildPersistantStylesheet")
				.innerText = "* { background-color: " + preferredColor + "; }";
		
		document.querySelector("#colorPicker").value = preferredColor;
	};
	
	rs.forGeneralProperties(callback);
	
	// Set up color change listener
	document.getElementById("colorPicker").addEventListener("change", (e) => {
		document.querySelector("#rebuildPersistantStylesheet")
			.innerText = "* { background-color: " + e.srcElement.value + "; }";
	});
}


// Set up settings button and settings overlay listeners
{
	let languageBackup = "english";
	let intervalBackup = 15;
	let colorBackup = "#808080";
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
		
		rs.setGeneralProperties({Language: newLangName,
								CheckFrequency: newCheckFrequency,
								Background: newBackground},
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
		let alreadyDeleted = false;
		
		rs.modifyWhere((id, rec)=>{
			if(id !== recnum || alreadyDeleted)
				return rec;
			
			if(confirm(tp.getTranslatedString(305)
										.format(rec.getRegex(),
												rec.getDestination(),
												rec.getSoftHours(),
												rec.getHardHours()))){
				alreadyDeleted = true;
				return false;
			}
			return rec;
		}, ()=>{
			if(alreadyDeleted){
				document.getElementById("recordEditOverlay").style.display = "none";
				constructView();
			}
		});
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
		let allOk = false;
		rs.modifyWhere((id, rec)=>{
			if(id === recnum){
				let softhoursInput = document.getElementById("softLockHoursInput");
				let hardhoursInput = document.getElementById("hardLockHoursInput");
				let timeoutsNATInput = document.getElementById("timeoutsNATInput");
				let timeoutsNTOInput = document.getElementById("timeoutsNTOInput");
				
				if(!validateTimeStringInput({target:softhoursInput}, ) || 
					!validateTimeStringInput({target:hardhoursInput}) ||
					!validateTimeoutStringInput({target:timeoutsNATInput}) ||
					!validateTimeoutStringInput({target:timeoutsNTOInput})){
					return rec;
				}
								
				allOk = true;
				return new Record(document.getElementById("patternInput").value, 
									softhoursInput.value, hardhoursInput.value,
									document.getElementById("destinationInput").value,
									timeToInt(timeoutsNATInput.value),
									timeToInt(timeoutsNTOInput.value));
			}
			
			return rec;
		}, ()=>{
			if(allOk){
				document.getElementById("recordEditOverlay").style.display = "none";
				constructView();
			}
		});		
	});
}

// Construct table
constructView();

var recnum = -1;
var jsonstring = "";

function Import(jsonstr){
	jsonstring = jsonstr;
	
	chrome.storage.sync.get(['websites'], function(result){
		if(jsonstring){
			chrome.storage.sync.set({websites:jsonstring});
			ConstructView();
		}		
	});
	
	document.getElementById("import2").files[0] = null;
}

function Export(){
	chrome.storage.sync.get(['websites'], function(result) {
		var a = document.createElement("a");
		var file = new Blob([result.websites], {type: 'application/json'});
		a.href = URL.createObjectURL(file);
		a.download = "ScheduleBlockBackup" + new Date().toISOString().slice(0, 10);;
		a.click();
	});
}

function AddSite(){
	chrome.storage.sync.get(['websites'], function(result) {
		let arr = result.websites;
		if(!arr){
			arr = [];
		}else{
			arr = JSON.parse(arr);
		}
		let nse = document.getElementById("newsite");
		if(nse.value != ""){
			arr.push({"regex": nse.value, "softhours":"00:00-23:59", "hardhours":"00:00-23:59", 
											"destination": "about:blank"});
			chrome.storage.sync.set({websites:JSON.stringify(arr)});
			nse.value = "";
			ConstructView();
		}
	});
}

function ConstructView(){
	chrome.storage.sync.get(['websites'], function(result) {
		if(result.websites){
			let arr = JSON.parse(result.websites);
			document.getElementById("display").innerHTML = "";
			let t = document.createElement("table");
			let tr0 = document.createElement("tr");
			let th0 = document.createElement("th");
			th0.innerText = "Pattern";
			tr0.appendChild(th0);
			let th1 = document.createElement("th");
			th1.innerText = "Soft locked hours/days";
			tr0.appendChild(th1);
			let th2 = document.createElement("th");
			th2.innerText = "Hard locked hours/days";
			tr0.appendChild(th2);
			let th3 = document.createElement("th");
			th3.innerText = "Destination";
			tr0.appendChild(th3);
			let th4 = document.createElement("th");
			th4.innerText = "Changes";
			tr0.appendChild(th4);
			t.appendChild(tr0);
			
			for(let i = 0; i < arr.length; i++){
				let row = document.createElement("tr");
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
				
				let changes = document.createElement("td");
				let changepattern = document.createElement("input");
				changepattern.id = "chp"+i;
				changepattern.type = "button";
				changepattern.value = "Change pattern";
				changepattern.addEventListener("click", ChangePattern);
				changes.appendChild(changepattern);
				
				let changesofthours = document.createElement("input");
				changesofthours.id = "chs"+i;
				changesofthours.type = "button";
				changesofthours.value = "Change soft hours";
				changesofthours.addEventListener("click", ChangeSoftHours);
				changes.appendChild(changesofthours);
				let changehardhours = document.createElement("input");
				changehardhours.id = "chh"+i;
				changehardhours.type = "button";
				changehardhours.value = "Change hard hours";
				changehardhours.addEventListener("click", ChangeHardHours);
				changes.appendChild(changehardhours);
				
				let changedestination = document.createElement("input");
				changedestination.id = "chd"+i;
				changedestination.type = "button";
				changedestination.value = "Change destination";
				changedestination.addEventListener("click", ChangeDestination);
				changes.appendChild(changedestination);
				let removerec = document.createElement("input");
				removerec.id = "rmr"+i;
				removerec.type = "button";
				removerec.value = "Remove record";
				removerec.addEventListener("click", RemoveRecord);
				changes.appendChild(removerec);
				row.appendChild(changes);
				t.appendChild(row);
			}
			
			document.getElementById("display").appendChild(t);
		}
	});
}

function ChangePattern(){
	recnum = parseInt(this.id.substr(3));
	
	chrome.storage.sync.get(['websites'], function(result){
		let arr = result.websites;
		if(arr){
			arr = JSON.parse(arr);
			
			if(recnum < arr.length){
				let r = window.prompt(
				"Enter new regular expression describing the subset of sites you want to forbid. "+
				"\nFor example '.*\\.reddit\\.com.*' will disable any address with '.reddit.com' in it.", 
				arr[recnum].regex);
				
				if(r!=null){						
					arr[recnum].regex = r;
					chrome.storage.sync.set({websites:JSON.stringify(arr)});
					ConstructView();
				}
			}
		}		
	});
}

function ChangeSoftHours(){
	recnum = parseInt(this.id.substr(3));
	
	chrome.storage.sync.get(['websites'], function(result){
		let arr = result.websites;
		if(arr){
			arr = JSON.parse(arr);
			
			if(recnum < arr.length){
				let base = "";
				
				if(arr[recnum].softhours){
					base = arr[recnum].softhours;
				}
				
				let r = window.prompt(
				"Enter new time intervals in 24 hour format, separated by commas. "+
				"You can also enter times for individual days by separating days with |. "+
				"If amount of days is not 7, modulo is used. "+
				"\nFor example, '12:00-14:15,15:30-16:45|9:00-19:00' will make it impossible to visit "+
				"the given site from 12:00 to 14:15 and from 15:30 to 16:45 on odd days "+
				"(counting Sunday as the first day) and from 9:00-19:00 on even days.",
				base);
				
				if(r!=null){
					arr[recnum].softhours = r;
				}
				
				chrome.storage.sync.set({websites:JSON.stringify(arr)});
				ConstructView();
			}
		}		
	});
}

function ChangeHardHours(){
	recnum = parseInt(this.id.substr(3));
	
	chrome.storage.sync.get(['websites'], function(result){
		let arr = result.websites;
		if(arr){
			arr = JSON.parse(arr);
			
			if(recnum < arr.length){
				let base = "";
				
				if(arr[recnum].hardhours){
					base = arr[recnum].hardhours;
				}
				
				let r = window.prompt(
				"Enter new time intervals in 24 hour format, separated by commas. "+
				"You can also enter times for individual days by separating days with |. "+
				"If amount of days is not 7, modulo is used. "+
				"\nFor example, '12:00-14:15,15:30-16:45|9:00-19:00' will redirect from "+
				"the given site from 12:00 to 14:15 and from 15:30 to 16:45 on odd days "+
				"(counting Sunday as the first day) and from 9:00-19:00 on even days.",
				base);
				
				if(r!=null){
					arr[recnum].hardhours = r;
				}
				
				chrome.storage.sync.set({websites:JSON.stringify(arr)});
				ConstructView();
			}
		}		
	});
}

function ChangeDestination(){
	recnum = parseInt(this.id.substr(3));
	
	chrome.storage.sync.get(['websites'], function(result){
		let arr = result.websites;
		if(arr){
			arr = JSON.parse(arr);
			
			if(recnum < arr.length){
				if(arr[recnum].destination){
					let r = window.prompt(
					"Enter new destination. The address must include protocol (http:// or https://). "+
					"It is advised to use an address that does not match the pattern, as failing to do "+
					"so will lead to an endless loop."
					, arr[recnum].destination);
					if(r!=null){
						arr[recnum].destination = r;
					}
				}else{
					let r = window.prompt("Enter new destination", "");
					if(r!=null){
						arr[recnum].destination = r;
					}
				}
				
				chrome.storage.sync.set({websites:JSON.stringify(arr)});
				ConstructView();
			}
		}		
	});
}

function RemoveRecord(){
	recnum = parseInt(this.id.substr(3));
	
	chrome.storage.sync.get(['websites'], function(result){
		let arr = result.websites;
		if(arr){
			arr = JSON.parse(arr);
			
			if(recnum < arr.length){
				let affirmative = confirm(
				"There is no way to retrieve deleted pattern, other than creating it again. "+
				"Are you absolutely sure you want to delete the pattern '"+arr[recnum].regex+"' from the list?");
				
				if(affirmative){
					arr.splice(recnum, 1);
					
					chrome.storage.sync.set({websites:JSON.stringify(arr)});
					ConstructView();
				}
			}
		}		
	});
}

document.getElementById("newsite").addEventListener("keyup", e => {
	if (e.keyCode === 13) {
		e.preventDefault();
		AddSite();
	}
});
document.getElementById("newsiteadd").addEventListener("click", AddSite);
document.getElementById("import").addEventListener("click", () => {document.getElementById("import2").click();});
document.getElementById("import2").addEventListener("change", () => {
	if(document.getElementById("import2").files){
		document.getElementById("import2").files[0].text().then(t => Import(t))
		}
	});
document.getElementById("export").addEventListener("click", Export);

ConstructView();
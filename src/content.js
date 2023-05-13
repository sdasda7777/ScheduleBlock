/**
 * @file Describes what happens every time any page is loaded.
 * @author sdasda7777
 */

let documentLoaded = false;
window.addEventListener("load", function(){
	documentLoaded = true;
});

// Logging function
function logJ(){
	console.log.apply(this,
		Array.prototype.slice.call(arguments, 0).map((i)=>JSON.stringify(i)));
};

const defaultLocationChangeRegex
	= new RegExp("^window\\.location = '[^']*';$");

chrome.runtime.onMessage.addListener((message)=>{
	if(message.type === "ScheduleBlock_Content_ExecuteAction"){
		//logJ(message.action);
		if(message.action == "window.close();"){
			window.close();
		}else if(defaultLocationChangeRegex.test(message.action)){
			window.location
				= message.action.slice("window.location = '".length, -("';".length));
		}else if(message.action !== undefined){
			const scriptElement = document.createElement('div');
			scriptElement.setAttribute('onclick', message.action);
			document.documentElement.appendChild(scriptElement);
			scriptElement.click();
			scriptElement.remove();
		}
	}else if(message.type === "ScheduleBlock_Content_Initalize"){
		// This sets up continuous hard lock checks
		let checker = setInterval(() => {
			// This condition prevents "Uncaught error: Extension context invalidated"
			//  (would otherwise happen when extension is unloaded during operation)
			if(chrome === undefined || 
				chrome.runtime === undefined ||
				chrome.runtime.id === undefined){
				
				clearInterval(checker);
				return;
			}
					
			// Recurring hard lock check
			let sending = chrome.runtime.sendMessage(
			{
				type: "ScheduleBlock_RecordStorage_TestWebsite",
				urlAddress: window.location.href,
				softCheck: false
			});
		}, message.properties.CheckFrequency * 1000);
	}else if(message.type === "ScheduleBlock_Content_CreateLockScreen"){
		let CreateLockScreenLambda = ()=>{
			// Clear the website
			document.querySelector("html").innerHTML = "";

			// Initialize main elements
			let sourceUrl = atob(new URLSearchParams(window.location.search).get("source"));
			window.top.document.title = sourceUrl;
			let iconOverride = document.createElement("link");
			iconOverride.rel = "icon";
			iconOverride.href = "https://broken.favicon.png";
			window.top.document.querySelector("head").appendChild(iconOverride);

			let sourceDisplay = document.createElement("h2");
			sourceDisplay.id = "sourceDisplay";
			sourceDisplay.innerText = sourceUrl;
			document.querySelector("body").appendChild(sourceDisplay);

			let remainingTimeDisplay = document.createElement("h2");
			remainingTimeDisplay.id = "remainingTimeDisplay";
			document.querySelector("body").appendChild(remainingTimeDisplay);

			let backButton = document.createElement("input");
			backButton.type = "button";
			backButton.value = "Go back";
			document.querySelector("body").appendChild(backButton);
			backButton.addEventListener("click", ()=>{window.location = sourceUrl;});

			// Create style tag, set background color
			let styleSheet = document.createElement("style");
			styleSheet.type = "text/css";
			styleSheet.innerHTML = "*{background-color:" + message.properties.Background + ";}";

			// Initialize timer
			let unlockTime = 0;
			let displayIntervalHandle = null;

			chrome.runtime.onMessage.addListener((message)=>{
				console.log(message);
		
				if(message.type === "ScheduleBlock_LockScreen_SetUnlockTime"){
					if(displayIntervalHandle !== null)
						clearInterval(displayIntervalHandle);
						unlockTime = new Date(message.unlockTime);
			
					let updateTimeDisplay = () => {
						let currentTime = new Date();
						if(currentTime.getTime() >= unlockTime){
							document.getElementById("remainingTimeDisplay").innerText = "00:00:00";
						}else{
							let timeDifference = Math.floor((unlockTime - currentTime.getTime()) / 1000);
							
							let seconds = timeDifference % 60;
							let minutes = ((timeDifference - seconds) / 60) % 60;
							let hours =   ((timeDifference - 60 * minutes - seconds) / 3600);
							
							document.getElementById("remainingTimeDisplay").innerText
								= "" + String("0" + hours).slice(-2)
									+ ":" + String("0" + minutes).slice(-2)
									+ ":" + String("0" + seconds).slice(-2);
						}
					};
				
					updateTimeDisplay();
					displayIntervalHandle = setInterval(updateTimeDisplay, 1000);
				}
			});

			//TODO: clear interval on extension failure
			let storageIntervalHandle = null;
			function updateTimeFromStorage(){
				let sending = chrome.runtime.sendMessage({
					type: "ScheduleBlock_RecordStorage_GetWebsiteUnlockTime",
					urlAddress: sourceUrl
				});
			}

			updateTimeFromStorage();
			storageIntervalHandle = setInterval(updateTimeFromStorage, 3*60*1000);
		};

		if(documentLoaded){
			CreateLockScreenLambda();
		}else{
			window.addEventListener("load", CreateLockScreenLambda);
		}
	}
});


let sending1 = chrome.runtime.sendMessage(
{
	type: "ScheduleBlock_InitialContentCheck",
	urlAddress: window.location.href
});


//console.log("content script initialized");

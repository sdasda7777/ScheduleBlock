

let sourceUrl = atob(new URLSearchParams(window.location.search).get("source"));

document.getElementById("sourceDisplay").innerText = sourceUrl;

document.getElementById("backButton").addEventListener("click", ()=>{window.location = sourceUrl;})

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

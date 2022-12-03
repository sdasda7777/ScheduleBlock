/**
 * @file Describes what happens every time any page is loaded.
 * @author sdasda7777
 */

// Logging function
function logJ(){
	console.log.apply(this,
		Array.prototype.slice.call(arguments, 0).map((i)=>JSON.stringify(i)));
};


chrome.runtime.onMessage.addListener((message)=>{
	if(message.type === "ScheduleBlock_Content_ExecuteAction"){
		//logJ(message.action);
		if(message.action !== undefined){
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
	}
});


let sending1 = chrome.runtime.sendMessage(
{
	type: "ScheduleBlock_RecordStorage_TestWebsite",
	urlAddress: window.location.href,
	softCheck: true
});

let sending2 = chrome.runtime.sendMessage(
{
	type: "ScheduleBlock_InitializeContentScript"
});


//console.log("content script initialized");

/**
 * @file Describes what happens every time any page is loaded.
 * @author sdasda7777
 */

// Logging function
function logJ(){
	console.log.apply(this,
		Array.prototype.slice.call(arguments, 0).map((i)=>JSON.stringify(i)));
};


let sending = chrome.runtime.sendMessage(
{
	type: "ScheduleBlock_RecordStorage_getGeneralProperties"
},

(result) => {
	// Initial soft lock check
	let sending = chrome.runtime.sendMessage(
	{
		type: "ScheduleBlock_RecordStorage_testWebsite",
		urlAddress: window.location.href,
		softCheck: true
	},
	(action) => {
		//logJ(newDestination);
		if(action !== undefined){
			/*
			let scriptElement = document.createElement("script");
			scriptElement.textContent = action;
			document.head.appendChild(scriptElement);
			scriptElement.remove()
			*/
			const scriptElement = document.createElement('div');
			scriptElement.setAttribute('onclick', action);
			document.documentElement.appendChild(scriptElement);
			scriptElement.click();
			scriptElement.remove();
		}
	});

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
			type: "ScheduleBlock_RecordStorage_testWebsite",
			urlAddress: window.location.href,
			softCheck: false
		},
		(action) => {
			//logJ(newDestination);
			if(action !== undefined){
				const scriptElement = document.createElement('div');
				scriptElement.setAttribute('onclick', action);
				document.documentElement.appendChild(scriptElement);
				scriptElement.click();
				scriptElement.remove();
			}
		});
	}, result.CheckFrequency * 1000);
});


//console.log("content script initialized");

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
	(newDestination) => {
		//logJ(newDestination);
		window.location = newDestination;
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
		(newDestination) => {
			//logJ(newDestination);
			window.location = newDestination;
		});
	}, result.CheckFrequency * 1000);
});


//console.log("content script initialized");

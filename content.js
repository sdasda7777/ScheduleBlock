// This file describes what happens every time any page is loaded

// This function checks current location against storage, redirects if match is found
function CheckHours(soft){
	chrome.storage.sync.get(['websites'], function(result){
		if(result.websites){
			let arr = JSON.parse(result.websites);
		loop1:
			for(let i = 0; i < arr.length; ++i){
				if(arr[i].regex){
					let re = new RegExp(arr[i].regex);
		
					if(window.location.href.match(re) && ((!soft && arr[i].hardhours) || (soft && arr[i].softhours))){
						let d = new Date();
						let days = (soft? arr[i].softhours: arr[i].hardhours).split("|");
						
						let dayno = d.getDay();
						
						while(dayno >= days.length){
							dayno -= days.length;
						}
						
						let intervals = days[dayno].split(",");
						
						for(let j = 0; j < intervals.length; ++j){
							let times = intervals[j].split("-");
							
							if(times.length == 2){
								let time0 = times[0].split(":");
								let time1 = times[1].split(":");
								
								let begind = new Date();
								let endd = new Date();
								
								begind.setHours(time0[0]);
								begind.setMinutes(time0[1]);
								endd.setHours(time1[0]);
								endd.setMinutes(time1[1]);
								
								if(begind <= d && d < endd && arr[i].destination){
									window.location = arr[i].destination;
									console.log("Matched");
									break loop1;
								}
							}
						}
					}
				}
			}
		}
	});
}

// Initial soft lock check
CheckHours(true);

// This sets up continuous hard lock checks, check frequency is 15 seconds
let checker = setInterval(function(){
	//Prevents "Uncaught error: Extension context invalidated"
	if(chrome.runtime.id == undefined) {
		clearInterval(checker);
		return;
	}
	CheckHours(false);
}, 15000);
function CheckHardhours(){
	chrome.storage.sync.get(['websites'], function(result){
		if(result.websites){
			let arr = JSON.parse(result.websites);
		loop1:
			for(let i = 0; i < arr.length; i++){
				if(arr[i].regex){
					let re = new RegExp(arr[i].regex);
		
					if(window.location.href.match(re) && arr[i].hardhours){
						let d = new Date();
						let days = arr[i].hardhours.split("|");
						
						let dayno = d.getDay();
						
						while(dayno >= days.length){
							dayno -= days.length;
						}
						
						let intervals = days[dayno].split(",");
						
						for(let j = 0; j < intervals.length; j++){
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

chrome.storage.sync.get(['websites'], function(result){
	
	if(result.websites){
		let arr = JSON.parse(result.websites);
	loop1:
		for(let i = 0; i < arr.length; i++){
			if(arr[i].regex){
				let re = new RegExp(arr[i].regex);

				if(window.location.href.match(re) && arr[i].softhours){		
					
					let d = new Date();
					let days = arr[i].softhours.split("|");
					
					let dayno = d.getDay();
					
					while(dayno >= days.length){
						dayno -= days.length;
					}
					
					let intervals = days[dayno].split(",");
					
					for(let j = 0; j < intervals.length; j++){
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
								break loop1;
							}
						}
					}
				}
			}
		}
	}
});

let checker = setInterval(CheckHardhours, 15000);

chrome.runtime.connect().onDisconnect.addListener(function() {
    clearInterval(checker);
})
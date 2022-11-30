import { Record } from "./Record.js";
import { RecordStorage } from "./RecordStorage.js";

const ScheduleBlock_messages = [
	"ScheduleBlock_RecordStorage_importSettings",		//  0
	"ScheduleBlock_RecordStorage_exportSettings",		//  1
	"ScheduleBlock_RecordStorage_getGeneralProperties",	//  2
	"ScheduleBlock_RecordStorage_setGeneralProperties",	//  3
	"ScheduleBlock_RecordStorage_getAll",				//  4
	"ScheduleBlock_RecordStorage_getOne",				//  5
	"ScheduleBlock_RecordStorage_createNewRecord",		//  6
	"ScheduleBlock_RecordStorage_moveRecord",			//  7
	"ScheduleBlock_RecordStorage_editRecord",			//  8
	"ScheduleBlock_RecordStorage_deleteRecord",			//  9
	"ScheduleBlock_RecordStorage_testWebsite"			// 10
];


//let myHeartbeat = setInterval(()=>{console.log(new Date())}, 5000);
let recordStorage = new RecordStorage();
let currentLastPromise = Promise.resolve();

async function asyncHandler(message, sender, callback){
  console.log("background worker handling ", message, " from ", sender);

  let message_type = ScheduleBlock_messages.indexOf(message.type);
  if(message_type == 0){
	//"ScheduleBlock_RecordStorage_importSettings"
	await recordStorage.importSettings(message.newSettings).then(
		()=>{
			callback();
		}
	);
  }else if(message_type == 1){
	//"ScheduleBlock_RecordStorage_exportSettings"
	await recordStorage.exportSettings().then(
		(settings)=>{
			callback(settings);
		}
	);
  }else if(message_type == 2){
	//"ScheduleBlock_RecordStorage_getGeneralProperties"
	await recordStorage.getGeneralProperties().then(
		(properties)=>{
			callback(properties);
		});
  }else if(message_type == 3){
	//"ScheduleBlock_RecordStorage_setGeneralProperties"
	await recordStorage.setGeneralProperties(message.newProperties).then(
		()=>{
			callback();
		});
  }else if(message_type == 4){
	//"ScheduleBlock_RecordStorage_getAll"
	await recordStorage.getAll().then(
		(arr)=>{
			let json = Record.toJSON(arr);
			//console.log(json);
			callback(json);
		});
  }else if(message_type == 5){
	//"ScheduleBlock_RecordStorage_getOne"
	await recordStorage.getOne(message.id).then(
		(element)=>{
			let json = Record.toJSON([element]);
			//console.log(json);
			callback(json);
		});
  }else if(message_type == 6){
	//"ScheduleBlock_RecordStorage_createNewRecord"
	await recordStorage.createNewRecord(message.regex).then(
		()=>{
			callback();
		});
  }else if(message_type == 7){
	//"ScheduleBlock_RecordStorage_moveRecord"
	await recordStorage.moveRecord(message.id, message.newId).then(
		()=>{
			callback();
		});
  }else if(message_type == 8){
	//"ScheduleBlock_RecordStorage_editRecord"
	await recordStorage.editRecord(message.id, Record.fromJSON(message.newValue)[0]).then(
		()=>{
			callback();
		});
  }else if(message_type == 9){
	//"ScheduleBlock_RecordStorage_deleteRecord"
	await recordStorage.deleteRecord(message.id).then(
		()=>{
			callback();
		});
  }else if(message_type == 10){
	//"ScheduleBlock_RecordStorage_testWebsite"
	await recordStorage.testWebsite(message.urlAddress, message.softCheck).then(
		(newDestination)=>{
			if(newDestination !== false){
				console.log("Redirecting from " + message.urlAddress 
								+ " to " + newDestination);
				callback(newDestination);
			}
		});
  }
}

chrome.runtime.onMessage.addListener((message, sender, callback) => {
  console.log("background worker got message ", message, " from ", sender);
  
  if(ScheduleBlock_messages.indexOf(message.type) != -1){
	  currentLastPromise = currentLastPromise
							.then(() => asyncHandler(message, sender, callback));
	  
	  return true;
  }
});

console.log(Record.toJSON([new Record()]));
// TODO: listen for something? idk really
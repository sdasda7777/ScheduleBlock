import { Record } from "./Record.js";
import { RecordStorage } from "./RecordStorage.js";

const ScheduleBlock_messages = [
	"ScheduleBlock_RecordStorage_ImportSettings",		//  0
	"ScheduleBlock_RecordStorage_ExportSettings",		//  1
	"ScheduleBlock_InitializeOptions",					//  2
	"ScheduleBlock_SaveGeneralProperties",				//  3
	"ScheduleBlock_RefreshTable",						//  4
	"ScheduleBlock_OpenEditMenu",						//  5
	"ScheduleBlock_RecordStorage_CreateNewRecord",		//  6
	"ScheduleBlock_RecordStorage_MoveRecord",			//  7
	"ScheduleBlock_RecordStorage_EditRecord",			//  8
	"ScheduleBlock_RecordStorage_DeleteRecord",			//  9
	"ScheduleBlock_RecordStorage_TestWebsite",			// 10
	"ScheduleBlock_RecordStorage_GetWebsiteUnlockTime",	// 11
	"ScheduleBlock_InitialContentCheck"					// 12
];

export function main()
{
	let recordStorage = new RecordStorage();
	let currentLastPromise = Promise.resolve();

	async function asyncHandler(message, sender, callback)
	{
		console.log("background worker handling ", message, " from ", sender);

		let message_type = ScheduleBlock_messages.indexOf(message.type);
		if(message_type == 1)
		{
			//"ScheduleBlock_RecordStorage_ExportSettings"
			await recordStorage.exportSettings().then(
				(settings) => {
					chrome.tabs.sendMessage(
						sender.tab.id,
						{
							type: "ScheduleBlock_Options_Export",
							settings: settings
						}
					);
				}
			);
		}
		else if(message_type == 2)
		{
			//"ScheduleBlock_InitializeOptions"
			await recordStorage.getGeneralProperties().then(
				(properties) => {
					chrome.tabs.sendMessage(
						sender.tab.id,
						{
							type: "ScheduleBlock_Options_Initialize",
							properties: properties
						}
					);
				}
			);
		}
		else if(message_type == 3)
		{
			//"ScheduleBlock_SaveGeneralProperties"
			await recordStorage.setGeneralProperties(message.newProperties);
		}
		else if(message_type == 5)
		{
			//"ScheduleBlock_OpenEditMenu"
			await recordStorage.getOne(message.id).then(
				(element) => {
					let json = Record.toJSON([element]);
					//console.log(json);
					chrome.tabs.sendMessage(
						sender.tab.id,
						{
							type: "ScheduleBlock_Options_OpenEditMenu",
							data: json
						}
					);
				}
			);
		}
		else if(message_type == 0 || message_type == 4 || message_type == 6
				|| message_type == 7 || message_type == 8 || message_type == 9)
		{
			//"ScheduleBlock_RecordStorage_ImportSettings"
			//"ScheduleBlock_RefreshTable"
			//"ScheduleBlock_RecordStorage_CreateNewRecord"
			//"ScheduleBlock_RecordStorage_MoveRecord"
			//"ScheduleBlock_RecordStorage_EditRecord"
			//"ScheduleBlock_RecordStorage_DeleteRecord"

			(async () => {
				if(message_type == 0)
				{
					await recordStorage.importSettings(message.newSettings).then(
						(result) => {
							if(result !== true)
							{
								chrome.tabs.sendMessage(
									sender.tab.id,
									{
										type: "ScheduleBlock_Options_ImportFailed",
										reason: result
									}
								);
							}
						}
					);
				}
				else if(message_type == 6)
					await recordStorage.saveNewRecord(Record.fromJSON(message.value)[0]);
				else if(message_type == 7)
					await recordStorage.moveRecord(message.id, message.newId);
				else if(message_type == 8)
					await recordStorage.editRecord(message.id, Record.fromJSON(message.newValue)[0]);
				else if(message_type == 9)
					await recordStorage.deleteRecord(message.id);
			})().then(
				async () => {
					await recordStorage.getAll().then(
						(arr) => {
							let json = Record.toJSON(arr);
							//console.log(json);
							chrome.tabs.sendMessage(
								sender.tab.id,
								{
									type: "ScheduleBlock_Options_SetTableData",
									data: json
								}
							);
						}
					);
				}
			);
		}
		else if(message_type == 10)
		{
			//"ScheduleBlock_RecordStorage_TestWebsite"
			await recordStorage.testWebsite(message.urlAddress, message.intitalCheck).then(
				async (userScript) => {
					if(userScript !== false)
					{
						await recordStorage.getGeneralProperties().then(
							(settings) => {
								console.log("Sending script '" + userScript + "' to '" + message.urlAddress + "'");
								chrome.tabs.sendMessage(
									sender.tab.id,
									{
										type: "ScheduleBlock_Content_ExecuteAction",
										action: userScript.replace("$ScheduleBlock_LockScreen$",
																	settings.LockScreenBase
																	+ "?requested_by=ScheduleBlock&source="
																	+ btoa(message.urlAddress))
									}
								);
							}
						);
					}
				}
			);
		}
		else if(message_type == 11)
		{
			//"ScheduleBlock_RecordStorage_GetWebsiteUnlockTime"
			await recordStorage.getWebsiteUnlockTime(message.urlAddress).then(
				(unlockTime) => {
					if(unlockTime !== false)
					{
						/*console.log("Sending script '" + userScript +
								"' to '" + message.urlAddress + "'");*/
						chrome.tabs.sendMessage(
							sender.tab.id,
							{
								type: "ScheduleBlock_LockScreen_SetUnlockTime",
								unlockTime: unlockTime.getTime()
							}
						);
					}
				}
			);
		}
		else if(message_type == 12)
		{
			//"ScheduleBlock_InitialContentCheck"
			await recordStorage.getGeneralProperties().then(
				async (settings) => {
					if(message.urlAddress.indexOf(settings.LockScreenBase) === 0
						&& message.urlAddress.indexOf('requested_by=ScheduleBlock') != -1)
					{
						// Create a lock screen
						chrome.tabs.sendMessage(
							sender.tab.id,
							{
								type: "ScheduleBlock_Content_CreateLockScreen",
								properties: settings
							}
						);
						return;
					}

					await recordStorage.testWebsite(message.urlAddress, true).then(
						(userScript) => {
							if(userScript !== false)
							{
								// Execute action (such as a redirect)
								console.log("Sending script '" + userScript +
										"' to '" + message.urlAddress + "'");
								chrome.tabs.sendMessage(
									sender.tab.id,
									{
										type: "ScheduleBlock_Content_ExecuteAction",
										action: userScript.replace("$ScheduleBlock_LockScreen$",
																settings.LockScreenBase
																+ "?requested_by=ScheduleBlock&source="
																+ btoa(message.urlAddress))
									}
								);
							}
							else
							{
								// Establish check cycle
								chrome.tabs.sendMessage(
									sender.tab.id,
									{
										type: "ScheduleBlock_Content_Initialize",
										properties: settings
									}
								);
							}
						}
					);
				}
			);
		}
	}

	chrome.runtime.onMessage.addListener((message, sender, callback) => {
		//console.log("background worker got message ", message, " from ", sender);

		if(ScheduleBlock_messages.indexOf(message.type) != -1)
		{
			currentLastPromise = currentLastPromise
								.then(() => asyncHandler(message, sender, callback));
		}
	});

	//console.log(Record.toJSON([new Record()]));
	console.log("Background script initialized");
}

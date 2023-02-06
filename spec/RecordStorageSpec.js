import { Record } from '../src/Record.js';
import { RecordStorage } from '../src/RecordStorage.js';

import { loadToBeEqualToRecord } from './RecordHelper.js';
loadToBeEqualToRecord();

describe('RecordStorage', function() {
	let localStorageSpy, storageProvider, recordStorage;
	beforeEach(function(){
		jasmine.setDefaultSpyStrategy(and => and.throwError(new Error("Forbidden Spy Call")));
		localStorageSpy = jasmine.createSpyObj(["get", "set"]);
		storageProvider = jasmine.createSpyObj("???", [], 
											{"storage": {"local": localStorageSpy}});
		jasmine.setDefaultSpyStrategy();
	});

	xit('advanced examples', function(){
		localStorageSpy.get.and.returnValue(42);
		
		
		expect(storageProvider.storage.local.get()).toBe(42);
		expect(() => {
			storageProvider.storage.local.set();
		}).toThrowError("Forbidden Spy Call");
		expect(() => {
			storageProvider.storage.global.set();
		}).toThrowError("Cannot read properties of undefined (reading 'set')");
		
	});
	
	describe('.getAll()',function(){
		it('reads all when possible', async function(){
			let recordsA = [new Record("regexA", "softHoursA", "hardHoursA", "timeoutA",
									"actionA", 42, 43),
							new Record("regexB", "softHoursB", "hardHoursB", "timeoutB",
									"actionB", 44, 45),
							new Record("regexC", "softHoursC", "hardHoursC", "timeoutC",
									"actionC", 46, 47)];
			let serialized = Record.toJSON(recordsA);
			localStorageSpy.get.and.returnValue({ScheduleBlock_Websites:serialized});


			let rs = new RecordStorage(storageProvider);
			let recordsB = await rs.getAll();
			
			
			expect(recordsB.length).toBe(recordsA.length);
			expect(recordsB).toEqual(recordsA);
		});
		
		it('returns empty array when key is not found', async function(){
			localStorageSpy.get.and.returnValue({});


			let rs = new RecordStorage(storageProvider);
			let recordsB = await rs.getAll();
			
			
			expect(recordsB.length).toBe(0);
		});
		
	});
	
	describe('.getOne(recordNumber)', function(){
		beforeEach(function(){
			let recordsA = [new Record("regexA", "softHoursA", "hardHoursA", "timeoutA",
									"actionA", 42, 43),
							new Record("regexB", "softHoursB", "hardHoursB", "timeoutB",
									"actionB", 44, 45),
							new Record("regexC", "softHoursC", "hardHoursC", "timeoutC",
									"actionC", 46, 47)];
			let serialized = Record.toJSON(recordsA);
			localStorageSpy.get.and.returnValue({ScheduleBlock_Websites:serialized});
			recordStorage = new RecordStorage(storageProvider);
		});
		
		it('returns given record if present', async function(){
			let recordB = await recordStorage.getOne(1);
			
			
			expect(recordB).toEqualToRecord(
					new Record("regexB", "softHoursB", "hardHoursB", "timeoutB",
								"actionB", 44, 45));
		});
		it('returns null if record is not present', async function(){
			let recordB = await recordStorage.getOne(4);
			
			
			expect(recordB).toEqual(null);
		});
	});
	
	describe('.createNewRecord(regularExpression)', function(){
		xit('creates ScheduleBlock_Websites key if not present', async function(){
			
			
		});
		xit('doesn\'t modify other records', async function(){
			
			
		});
	});
	
	describe('.moveRecord(recordNumber, newRecordNumber)', function(){
		describe('moves given record if present',function(){
			xit('in general case');
			xit('when destination is 0');
			xit('when destination is less than 0');
			xit('when destination is end');
			xit('when destination is more than end');
		});
		xit('returns false if original record is not present');
	});
	
	describe('.editRecord(recordNumber, newValue)', function(){
		xit('edits record when present');
		xit('returns false if original record is not present');
	});
	
	describe('.deleteRecord(recordNumber)', function(){
		xit('deletes record when present');
		xit('returns false if record is not present');
	});
	
	
	describe('.testWebsite(urlAddress, softCheck)', function(){
		xit('does stuff');
	});
	
	describe('.getWebsiteUnlockTime(urlAddress)', function(){
		xit('does stuff');
	});
});

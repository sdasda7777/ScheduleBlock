import { Record } from '../src/Record.js';

import { loadToBeEqualToRecord } from './RecordHelper.js';
loadToBeEqualToRecord();

describe('Record', function() {

	describe('default values', function() {
		let dateBefore = new Date();
		let record = new Record();
		let dateAfter = new Date();

		it('should be reasonable values', function() {
			expect(record.getRegex())			.toBe("");
			expect(record.getSoftHours())		.toBe("00:00-00:00");
			expect(record.getHardHours())		.toBe("00:00-00:00");
			expect(record.getTimeout())			.toBe("00:01:00/02:00:00");
			expect(record.getAction())			.toBe("window.location = 'about:blank';");
			expect(record.getCurrentDuration())	.toBe(0);
			expect(record.getLastCheck() >= dateBefore &&
				   record.getLastCheck() <= dateAfter).toBe(true);
		});
	});

	describe('modified clone constructors (.withXXX)', function() {
		let dateA, recordA, recordB;
		
		beforeEach(function() {
			dateA = new Date();
			recordA = new Record("regexA", "softHoursA", "hardHoursA", "timeoutA",
									"actionA", 42, dateA);
		});
		
		describe('(1) .withRegex', function() {
			beforeEach(function(){recordB = recordA.withRegex("regexB");});
			
			it('should return copy with modified value', function() {
				expect(recordB).toEqualToRecord(
					new Record("regexB", "softHoursA", "hardHoursA", "timeoutA",
								"actionA", 42, dateA));
				expect(recordB).not.toEqualToRecord(recordA);
			});
			
			it('should not change original values', function() {
				expect(recordA).toEqualToRecord(
					new Record("regexA", "softHoursA", "hardHoursA", "timeoutA",
								"actionA", 42, dateA));
			});
		});
			
		describe('(2) .withSoftHours', function() {
			beforeEach(function(){recordB = recordA.withSoftHours("softHoursB");});
			
			it('should return copy with modified value', function() {
				expect(recordB).toEqualToRecord(
					new Record("regexA", "softHoursB", "hardHoursA", "timeoutA",
								"actionA", 42, dateA));
				expect(recordB).not.toEqualToRecord(recordA);
			});
			
			it('should not change original values', function() {
				expect(recordA).toEqualToRecord(
					new Record("regexA", "softHoursA", "hardHoursA", "timeoutA",
								"actionA", 42, dateA));
			});
		});
		
		describe('(3) .withHardHours', function() {			
			beforeEach(function(){recordB = recordA.withHardHours("hardHoursB");});
			
			it('should return copy with modified value', function() {
				expect(recordB).toEqualToRecord(
					new Record("regexA", "softHoursA", "hardHoursB", "timeoutA",
								"actionA", 42, dateA));
				expect(recordB).not.toEqualToRecord(recordA);
			});
			
			it('should not change original values', function() {
				expect(recordA).toEqualToRecord(
					new Record("regexA", "softHoursA", "hardHoursA", "timeoutA",
								"actionA", 42, dateA));
			});
		});
		
		describe('(4) .withTimeout', function() {			
			beforeEach(function(){recordB = recordA.withTimeout("timeoutB");});
			
			it('should return copy with modified value', function() {
				expect(recordB).toEqualToRecord(
					new Record("regexA", "softHoursA", "hardHoursA", "timeoutB",
								"actionA", 42, dateA));
				expect(recordB).not.toEqualToRecord(recordA);
			});
			
			it('should not change original values', function() {
				expect(recordA).toEqualToRecord(
					new Record("regexA", "softHoursA", "hardHoursA", "timeoutA",
								"actionA", 42, dateA));
			});
		});
		
		describe('(5) .withAction', function() {
			beforeEach(function(){recordB = recordA.withAction("actionB");});			
			
			it('should return copy with modified value', function() {
				expect(recordB).toEqualToRecord(
					new Record("regexA", "softHoursA", "hardHoursA", "timeoutA",
								"actionB", 42, dateA));
				expect(recordB).not.toEqualToRecord(recordA);
			});
			
			it('should not change original values', function() {
				expect(recordA).toEqualToRecord(
					new Record("regexA", "softHoursA", "hardHoursA", "timeoutA",
								"actionA", 42, dateA));
			});
		});
		
		describe('(6) .withCurrentDuration', function() {			
			beforeEach(function(){recordB = recordA.withCurrentDuration(45);});
			
			it('should return copy with modified value', function() {
				expect(recordB).toEqualToRecord(
					new Record("regexA", "softHoursA", "hardHoursA", "timeoutA",
								"actionA", 45, dateA));
				expect(recordB).not.toEqualToRecord(recordA);
			});
			
			it('should not change original values', function() {
				expect(recordA).toEqualToRecord(
					new Record("regexA", "softHoursA", "hardHoursA", "timeoutA",
								"actionA", 42, dateA));
			});
		});
		
		describe('(7) .withLastCheck', function() {
			beforeEach(function(){recordB = recordA.withLastCheck(45);});
			
			it('should return copy with modified value', function() {
				expect(recordB).toEqualToRecord(
					new Record("regexA", "softHoursA", "hardHoursA", "timeoutA",
								"actionA", 42, 45));
				expect(recordB).not.toEqualToRecord(recordA);
			});
			
			it('should not change original values', function() {
				expect(recordA).toEqualToRecord(
					new Record("regexA", "softHoursA", "hardHoursA", "timeoutA",
								"actionA", 42, dateA));
			});
		});
		
	});
	
	describe('querying', function() {
		let recordA, nowDateA, nowDateB, nowDateC, nowDateD;
		
		describe('(1) locks', function() {
			it('(1.1) should return t-1 when no restricting interval is set', function(){
				nowDateA = new Date();
				recordA = new Record("regexA", "", "", "timeoutA",
										"actionA", 42, nowDateA);
				nowDateB = new Date();
				expect(recordA.calculateNearestHoursAvailability(nowDateB, true))
						.toEqual(new Date(nowDateB.getTime()-1));
				expect(recordA.calculateNearestHoursAvailability(nowDateB, false))
						.toEqual(new Date(nowDateB.getTime()-1));
				// expect record to be unchanged
				expect(recordA).toEqualToRecord(new Record("regexA", "", "", "timeoutA",
																"actionA", 42, nowDateA));
			});
			it('(1.2) should return end of interval when restricting interval is set', function(){
				nowDateA = new Date();
				recordA = new Record("regexA", "2:00-4:00", "2:00-6:00",
										"timeoutA", "actionA", 42, nowDateA);
				nowDateB = new Date();
				nowDateB.setHours(3);
				
				nowDateC = new Date(nowDateB);
				nowDateC.setHours(4);
				nowDateC.setMinutes(0);
				nowDateC.setSeconds(0);
				
				nowDateD = new Date(nowDateC);
				nowDateD.setHours(6);
				
				expect(recordA.calculateNearestHoursAvailability(nowDateB, true))
						.toEqual(nowDateC);
				expect(recordA.calculateNearestHoursAvailability(nowDateB, false))
						.toEqual(nowDateD);
				// expect record to be unchanged
				expect(recordA).toEqualToRecord(new Record("regexA", "2:00-4:00", "2:00-6:00",
													"timeoutA",	"actionA", 42, nowDateA));
			});
		})
		
		describe('(2) timeouts', function() {
			it('(2.1) should return t-1 when no restricting interval is set', function(){
				nowDateA = new Date();
				recordA = new Record("regexA", "softHoursA", "hardHoursA",
										"",	"actionA", 61, new Date(nowDateA));
				nowDateB = new Date();
				expect(recordA.calculateNearestTimeoutAvailability(nowDateB))
						.toEqual(new Date(nowDateB.getTime()-1));
				// expect record to be unchanged
				expect(recordA).toEqualToRecord(new Record("regexA", "softHoursA", "hardHoursA",
														"",	"actionA", 61, nowDateA));
			});
			it('(2.2) should return t-1 when break has not been reached', function(){
				nowDateA = new Date();
				recordA = new Record("regexA", "softHoursA", "hardHoursA",
										"1:00/2:00:00",	"actionA", 59999, new Date(nowDateA));
				nowDateB = new Date();
				expect(recordA.calculateNearestTimeoutAvailability(nowDateB))
						.toEqual(new Date(nowDateB.getTime()-1));
				// expect record to be unchanged
				expect(recordA).toEqualToRecord(new Record("regexA", "softHoursA", "hardHoursA",
													"1:00/2:00:00",	"actionA", 59999, nowDateA));
			});
			it('(2.3) should return lastCheck+break when break has been reached', function(){
				nowDateA = new Date();
				recordA = new Record("regexA", "softHoursA", "hardHoursA",
										"1:00/2:00:00",	"actionA", 60000, new Date(nowDateA));
				nowDateB = new Date();
				expect(recordA.calculateNearestTimeoutAvailability(nowDateB))
						.toEqual(new Date(nowDateA.getTime() + 2*60*60*1000));
				// expect record to be unchanged
				expect(recordA).toEqualToRecord(new Record("regexA", "softHoursA", "hardHoursA",
													"1:00/2:00:00",	"actionA", 60000, nowDateA));
			});
			it('(2.4) should return 1 ms after current interval end when next interval has no restriction', 
			function(){
				nowDateA = new Date();
				nowDateA.setHours(20);
				nowDateA.setMinutes(33);
				
				recordA = new Record("regexA", "softHoursA", "hardHoursA",
										"1:00/2:00:00@20:00-21:00", "actionA", 60000, 
										new Date(nowDateA));
				
				nowDateB = new Date(nowDateA);
				nowDateB.setMinutes(34);
				
				nowDateC = new Date(nowDateA);
				nowDateC.setHours(21);
				nowDateC.setMinutes(0);
				nowDateC.setSeconds(0);
				
				expect(recordA.calculateNearestTimeoutAvailability(nowDateB))
						.toEqual(new Date(nowDateC.getTime() + 1));
				// expect record to be unchanged
				expect(recordA).toEqualToRecord(new Record("regexA", "softHoursA", "hardHoursA",
										"1:00/2:00:00@20:00-21:00",	"actionA", 60000, nowDateA));
			});
			it('(2.5) should return 1 ms after current interval end when next interval has less strict break',
			function(){
				nowDateA = new Date();
				nowDateA.setHours(20);
				nowDateA.setMinutes(33);
				
				recordA = new Record("regexA", "softHoursA", "hardHoursA",
										"1:00/2:00:00@20:00-21:00,2:00/2:00:00@21:00-22:00", "actionA", 60000, 
										new Date(nowDateA));
				
				nowDateB = new Date(nowDateA);
				nowDateB.setMinutes(34);
				
				nowDateC = new Date(nowDateA);
				nowDateC.setHours(21);
				nowDateC.setMinutes(0);
				nowDateC.setSeconds(0);
				
				expect(recordA.calculateNearestTimeoutAvailability(nowDateB))
						.toEqual(new Date(nowDateC.getTime() + 1));
				// expect record to be unchanged
				expect(recordA).toEqualToRecord(new Record("regexA", "softHoursA", "hardHoursA",
										"1:00/2:00:00@20:00-21:00,2:00/2:00:00@21:00-22:00",
										"actionA", 60000, nowDateA));
			});
			
			it('(2.6) overlap, same break, larger wait (mid)', function(){
				nowDateA = new Date();
				nowDateA.setHours(20);
				nowDateA.setMinutes(16);
				
				recordA = new Record("regexA", "softHoursA", "hardHoursA",
										"1:00/1:00:00@20:00-21:00,1:00/2:00:00@20:30-23:30", "actionA", 60000, 
										new Date(nowDateA));
				
				nowDateB = new Date(nowDateA);
				nowDateB.setMinutes(34);
				
				nowDateC = new Date(nowDateA);
				nowDateC.setHours(22);
				nowDateC.setMinutes(16);
				
				expect(recordA.calculateNearestTimeoutAvailability(nowDateB))
						.toEqual(new Date(nowDateC.getTime()));
				// expect record to be unchanged
				expect(recordA).toEqualToRecord(new Record("regexA", "softHoursA", "hardHoursA",
										"1:00/1:00:00@20:00-21:00,1:00/2:00:00@20:30-23:30",
										"actionA", 60000, nowDateA));
			});
			
			it('(2.7) overlap, same break, larger wait (end2)', function(){
				nowDateA = new Date();
				nowDateA.setHours(20);
				nowDateA.setMinutes(16);
				
				recordA = new Record("regexA", "softHoursA", "hardHoursA",
										"1:00/1:00:00@20:00-21:00,1:00/4:00:00@20:30-23:30", "actionA", 60000, 
										new Date(nowDateA));
				
				nowDateB = new Date(nowDateA);
				nowDateB.setMinutes(34);
				
				nowDateC = new Date(nowDateA);
				nowDateC.setHours(23);
				nowDateC.setMinutes(30);
				nowDateC.setSeconds(0);
				
				expect(recordA.calculateNearestTimeoutAvailability(nowDateB))
						.toEqual(new Date(nowDateC.getTime()+1));
				// expect record to be unchanged
				expect(recordA).toEqualToRecord(new Record("regexA", "softHoursA", "hardHoursA",
										"1:00/1:00:00@20:00-21:00,1:00/4:00:00@20:30-23:30",
										"actionA", 60000, nowDateA));
			});
			
			
			it('(2.8) overlap, same break, smaller wait (end1)', function(){
				nowDateA = new Date();
				nowDateA.setHours(20);
				nowDateA.setMinutes(16);
				
				recordA = new Record("regexA", "softHoursA", "hardHoursA",
										"1:00/1:00:00@20:00-21:00,1:00/30:00@20:30-23:30",
										"actionA", 60000, new Date(nowDateA));
				
				nowDateB = new Date(nowDateA);
				nowDateB.setMinutes(34);
				
				nowDateC = new Date(nowDateA);
				nowDateC.setHours(21);
				nowDateC.setMinutes(0);
				nowDateC.setSeconds(0);
				
				expect(recordA.calculateNearestTimeoutAvailability(nowDateB))
						.toEqual(new Date(nowDateC.getTime()+1));
				// expect record to be unchanged
				expect(recordA).toEqualToRecord(new Record("regexA", "softHoursA", "hardHoursA",
										"1:00/1:00:00@20:00-21:00,1:00/30:00@20:30-23:30",
										"actionA", 60000, nowDateA));
			});
			it('(2.9) overlap, same break, smaller wait (mid)', function(){
				nowDateA = new Date();
				nowDateA.setHours(20);
				nowDateA.setMinutes(16);
				
				recordA = new Record("regexA", "softHoursA", "hardHoursA",
										"1:00/1:00:00@20:00-21:00,1:00/45:00@20:30-23:30",
										"actionA", 60000, new Date(nowDateA));
				
				nowDateB = new Date(nowDateA);
				nowDateB.setMinutes(34);
				
				nowDateC = new Date(nowDateA);
				nowDateC.setHours(21);
				nowDateC.setMinutes(1);
				
				expect(recordA.calculateNearestTimeoutAvailability(nowDateB))
						.toEqual(new Date(nowDateC.getTime()));
				// expect record to be unchanged
				expect(recordA).toEqualToRecord(new Record("regexA", "softHoursA", "hardHoursA",
										"1:00/1:00:00@20:00-21:00,1:00/45:00@20:30-23:30",
										"actionA", 60000, nowDateA));
			});
			it('(2.10) overlap, same break, smaller wait (end2)', function(){
				nowDateA = new Date();
				nowDateA.setHours(20);
				nowDateA.setMinutes(31);
				
				recordA = new Record("regexA", "softHoursA", "hardHoursA",
										"1:00/1:00:00@20:00-21:00,1:00/55:00@20:30-21:05",
										"actionA", 60000, new Date(nowDateA));
				
				nowDateB = new Date(nowDateA);
				nowDateB.setMinutes(34);
				
				nowDateC = new Date(nowDateA);
				nowDateC.setHours(21);
				nowDateC.setMinutes(5);
				nowDateC.setSeconds(0);
				
				expect(recordA.calculateNearestTimeoutAvailability(nowDateB).getTime())
						.toEqual(new Date(nowDateC.getTime()+1).getTime());
				// expect record to be unchanged
				expect(recordA).toEqualToRecord(new Record("regexA", "softHoursA", "hardHoursA",
										"1:00/1:00:00@20:00-21:00,1:00/55:00@20:30-21:05",
										"actionA", 60000, nowDateA));
			});
		})
		
		describe('(3) combinations of locks and timeouts', function() {
			it('(3.1) check non-matching regex is rejected', function() {
				nowDateA = new Date();
				nowDateA.setHours(20);
				nowDateA.setMinutes(31);
				
				recordA = new Record("^regexA$", "softHoursA", "hardHoursA",
										"timeoutA",	"actionA", 60000, new Date(nowDateA));
				
				nowDateB = new Date(nowDateA);
				nowDateB.setMinutes(34);
				
				expect(recordA.testWebsite("www.duckduckgo.com", true, nowDateB)).toBe(false);
				expect(recordA.testWebsite("www.duckduckgo.com", false, nowDateB)).toBe(false);
				
				// expect record to be unchanged
				expect(recordA).toEqualToRecord(new Record("^regexA$", "softHoursA", "hardHoursA",
										"timeoutA",	"actionA", 60000, nowDateA));
			});
			xit('(3.2) check locks work when both set');
			xit('(3.3) check timeouts work when both set');
		})	
	});
	
	describe('timeout incrementation', function(){
		let recordA, recordB, recordC,
			nowDateA, nowDateB, nowDateC, nowDateD;
		
		it('check incrementing works, but is immutable', function() {
			nowDateA = new Date();			
			nowDateB = new Date(nowDateA.getTime() + 15000);
			nowDateC = new Date(nowDateB.getTime() + 15000);
			
			recordA = new Record("^regexA$", "", "", "0:30/1:00:00",
									"actionA", 0, new Date(nowDateA));
									
			recordB = recordA.getIncrementedTimeout("regexA", nowDateB, 15000);
			recordC = recordB.getIncrementedTimeout("regexA", nowDateC, 15000);
			
			expect(recordA.calculateNearestTimeoutAvailability(nowDateA))
				.toEqual(new Date(nowDateA.getTime() - 1));
			expect(recordB.calculateNearestTimeoutAvailability(nowDateB))
				.toEqual(new Date(nowDateB.getTime() - 1));
			expect(recordC.calculateNearestTimeoutAvailability(nowDateC))
				.toEqual(new Date(nowDateC.getTime() + 60*60*1000));
			
			// expect record to be unchanged
			expect(recordA).toEqualToRecord(new Record("^regexA$", "", "", "0:30/1:00:00",
															"actionA", 0, nowDateA));
			expect(recordB).toEqualToRecord(new Record("^regexA$", "", "", "0:30/1:00:00",
															"actionA", 15000, nowDateB));
			expect(recordC).toEqualToRecord(new Record("^regexA$", "", "", "0:30/1:00:00",
															"actionA", 30000, nowDateC));
		});
		
		it('works properly for timeouts shorter than check interval', function(){
			nowDateA = new Date();			
			nowDateB = new Date(nowDateA.getTime() + 30000);
			nowDateC = new Date(nowDateB.getTime() + 30000);
			
			recordA = new Record("^regexA$", "", "", "0:15/1:00:00",
									"actionA", 0, new Date(nowDateA));
									
			recordB = recordA.getIncrementedTimeout("regexA", nowDateB, 30000);
			recordC = recordB.getIncrementedTimeout("regexA", nowDateC, 30000);
			
			expect(recordA.calculateNearestTimeoutAvailability(nowDateA))
				.toEqual(new Date(nowDateA.getTime() - 1));
			expect(recordB.calculateNearestTimeoutAvailability(nowDateB))
				.toEqual(new Date(nowDateB.getTime() + 60*60*1000));
			
			// expect record to be unchanged
			expect(recordA).toEqualToRecord(new Record("^regexA$", "", "", "0:15/1:00:00",
															"actionA", 0, nowDateA));
			expect(recordB).toEqualToRecord(new Record("^regexA$", "", "", "0:15/1:00:00",
															"actionA", 30000, nowDateB));
			expect(recordC).toEqual(false);
			
		});
		
	});
		
	describe('serialization', function() {
		it('should deserialize to the original values (1)', function() {
			let recordsA = [new Record("regexA", "softHoursA", "hardHoursA", "timeoutA",
									"actionA", 42, 43)];
			
			let serialized = Record.toJSON(recordsA);
						
			let recordsB = Record.fromJSON(serialized);
			
			expect(recordsB.length)		.toBe(recordsA.length);
			expect(recordsB)			.toEqual(recordsA);
		});
		
		it('should deserialize to the original values (2)', function() {
			let recordsA = [new Record("regexB", "softHoursB", "hardHoursB", "timeoutB",
									"actionB", 44, 45),
							new Record("regexC", "softHoursC", "hardHoursC", "timeoutC",
									"actionC", 46, 47)];
			
			let serialized = Record.toJSON(recordsA);
						
			let recordsB = Record.fromJSON(serialized);
			
			expect(recordsB.length)		.toBe(recordsA.length);
			expect(recordsB)			.toEqual(recordsA);
		});
		
		it('should deserialize to the original values (3)', function() {
			let recordsA = [new Record("regexD", "softHoursD", "hardHoursD", "timeoutD",
									"actionD", 48, 49),
							new Record("regexE", "softHoursE", "hardHoursE", "timeoutE",
									"actionE", 50, 51),
							new Record("regexF", "softHoursF", "hardHoursF", "timeoutF",
									"actionF", 52, 53)];
			
			let serialized = Record.toJSON(recordsA);
						
			let recordsB = Record.fromJSON(serialized);
			
			expect(recordsB.length)		.toBe(recordsA.length);
			expect(recordsB)			.toEqual(recordsA);
		});
	});
});

import { Record } from '../src/Record.js';

export function loadToBeEqualToRecord(){
	beforeEach(function () {
		jasmine.addMatchers({
			toEqualToRecord: function () {
				return {
					compare: function (actual, expected) {
						const recordA = actual;
						const recordB = expected;

						return {
							pass: 
							recordA.getRegex() 		=== recordB.getRegex() && 
							recordA.getSoftHours() 	=== recordB.getSoftHours() &&
							recordA.getHardHours()	=== recordB.getHardHours() &&
							recordA.getTimeout()	=== recordB.getTimeout() &&
							recordA.getAction()		=== recordB.getAction() &&
							recordA.getCurrentDuration() === recordB.getCurrentDuration() &&
							recordA.getLastCheck().getTime()	=== recordB.getLastCheck().getTime()
						};
					}
				};
			}
		});
	});
}

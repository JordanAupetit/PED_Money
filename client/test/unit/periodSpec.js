// describe('JavaScript addition operator', function() {
// 	it('adds two numbers together', function() {
// 		expect(1 + 2).toEqual(3);
// 	});
// });


describe('PeriodHelper', function() {

	// Depedency injection
	var periodHelper;
	// The module the object to inject
	beforeEach(module('controllers'));
	// The object to inject
	beforeEach(inject(function(_periodHelper_) {
		periodHelper = _periodHelper_;
	}));


	var fakePeriod = {
		name: 'Loyer 2015',
		dateBegin: '2015-01-15',
		nbRepeat: 2,
		step: 3,
		intervalType: 'M',
		isOver: false,
		opCreat: [],
		operation: {
			value: 300,
			thirdParty: 'M Bougnard',
			description: 'Loyer',
			typeOpt: 'Virement',
			checked: false,
			dateOperation: '2015-01-20',
			datePrelevement: '2015-01-20',
			categoryId: '54684654dqs',
			accountId: 'sddqs1123sqd'
		}
	}

	describe('computeEndDate', function() {


		it('should compute the end date', function() {
			// console.log(new periodHelper.computeEndDate(period))
			// dump(new periodHelper.computeEndDate(period))
			// dump(new Date(2015,03,15))
			expect(new periodHelper.computeEndDate(fakePeriod)).toEqual(new Date(2015, 03, 15)); // 2015-04-15
		});

	});

	describe('genProjection', function() {

		it('should generate the projection', function() {
			// var projection = [
			// 	{
			// 		date: new Date(2015, 00, 15),
			// 		amount: 300
			// 	}, {
			// 		date: new Date(2015, 03, 15),
			// 		amount: 300
			// 	}
			// ]

			var projection = [{
					value: 300,
					thirdParty: 'M Bougnard',
					description: 'Loyer',
					typeOpt: 'Virement',
					checked: false,
					dateOperation: new Date(2015, 00, 15),
					datePrelevement: new Date(2015, 00, 15),
					categoryId: '54684654dqs',
					accountId: 'sddqs1123sqd'
				}, {
					value: 300,
					thirdParty: 'M Bougnard',
					description: 'Loyer',
					typeOpt: 'Virement',
					checked: false,
					dateOperation: new Date(2015, 03, 15),
					datePrelevement: new Date(2015, 03, 15),
					categoryId: '54684654dqs',
					accountId: 'sddqs1123sqd'
				}]
				// dump(projection)
			// dump(new periodHelper.genProjection(fakePeriod))
			expect(new periodHelper.genProjection(fakePeriod)).toEqual(projection);
		});

	});

});
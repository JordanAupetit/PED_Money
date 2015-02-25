describe('JavaScript addition operator', function() {
	it('adds two numbers together', function() {
		expect(1 + 2).toEqual(3);
	});
});


describe('PeriodHelper', function() {

	// Depedency injection
	var periodHelper;
	// The module the object to inject
	beforeEach(module('controllers'));
	// The object to inject
	beforeEach(inject(function(_periodHelper_) {
		periodHelper = _periodHelper_;
	}));

	var period = {
		_id: 2,
		name: 'Loyer',
		dateBegin: '2015-01-15',
		nbRepeat: 2,
		step: 3,
		intervalType: 'M',
		amount: 300
	}

	describe('computeEndDate', function() {


		it('should compute the end date', function() {
			// console.log(new periodHelper.computeEndDate(period))
			// dump(new periodHelper.computeEndDate(period))
			// dump(new Date(2015,03,15))
			expect(new periodHelper.computeEndDate(period)).toEqual(new Date(2015, 03, 15)); // 2015-04-15
		});

	});

	describe('genProjection', function() {

		it('should generate the projection', function() {
			var projection = [{
					date: new Date(2015, 00, 15),
					amount: 300
				}, {
					date: new Date(2015, 03, 15),
					amount: 300
				}]
				// dump(projection)
				// dump(new periodHelper.genProjection(period))
			expect(new periodHelper.genProjection(period)).toEqual(projection);
		});

	});

});
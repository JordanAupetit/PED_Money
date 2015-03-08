var CURRENCYS = (function() {
	return [{
		name: 'EUR(€)',
		code: 'EUR',
		value: 'EUR'
	}, {
		name: 'USD($)',
		code: 'USD',
		value: 'USD'
	}, {
		name: 'GBP(£)',
		code: 'GBP',
		value: 'GBP'
	}]
})();

var ACCOUNT_TYPES = (function() {
	return [{
		name: 'Banking',
		value: 1
	}, {
		name: 'Individual Saving Account',
		value: 2
	}, {
		name: 'Investment',
		value: 3
	}, {
		name: 'Credit card',
		value: 4
	}, {
		name: 'Other',
		value: 10
	}]
})();

var INTERVAL_TYPES = (function() { // TODO rename type to name
	return [{
		type: 'Day',
		value: 1,
		code: 'd'
	}, {
		type: 'Week',
		value: 7,
		code: 'w'
	}, {
		type: 'Month',
		value: 30,
		code: 'M'
	}, {
		type: 'Year',
		value: 365,
		code: 'Y'
	}]
})();
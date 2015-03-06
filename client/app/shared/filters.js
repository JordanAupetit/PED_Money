//filters.js
(function() {
	'use strict';




	function findIntervalByCode(value) {
		var result
		$.each(INTERVAL_TYPES, function(k, type) {
			if (type.code === value) {
				result = type
			}
		})
		return result
	}

	function findAccountTypeByValue(value) {
		var result
		angular.forEach(ACCOUNT_TYPES, function(type) {
			if (type.value == value) { // TODO value is a string
				result = type
			}
		})
		return result
	}

	function findCurrencyByValue(value) {
		var result
		angular.forEach(CURRENCYS, function(currency) {
			if (currency.value === value) {
				result = currency
			}
		})
		return result
	}


	angular.module('filters')
		.filter('date2', ['$filter', function($filter) {
			return function(input, format, timezone) {
				input = $filter('date')(input, format, timezone)
				input = input || 'Infinite';
				return input
			}
		}])
		.filter('repeat', function() {
			return function(input) {
				input = input || 'Unknown';
				input = input < 0 ? 'Infinite' : input;
				return input
			}
		})
		.filter('period', function() {
			return function(input) {
				var result = findIntervalByCode(input).type
				result = result || 'Unknown';
				return result
			}
		})
		.filter('accountType', function() {
			return function(input) {
				var result = findAccountTypeByValue(input)
				result = result !== undefined ? result.name : 'Unknown';
				return result
			}
		})
		.filter('accountCurrency', function() {
			return function(input) {
				var result = findCurrencyByValue(input)
				result = result !== undefined ? result.name : 'Unknown';
				return result
			}
		})

})()
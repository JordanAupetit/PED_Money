//filters.js
(function() {
	'use strict';


	var intervalType = [
				{type:'day', value:1, code:'d'},
				{type:'week', value:7, code:'w'},
				{type:'month', value:30, code:'M'},
				{type:'year', value:365, code:'Y'}
			]

	// function findInterval(value){
	// 	var result
	// 	$.each(intervalType, function(k,type){
	// 		if(type.value === value){
	// 			result = type
	// 		}
	// 	})
	// 	return result
	// }

	function findIntervalByCode(value){
		var result
		$.each(intervalType, function(k,type){
			if(type.code === value){
				result = type
			}
		})
		return result
	}


	angular.module('filters')
	.filter('date2', ['$filter', function($filter){
		return function(input, format, timezone) {
			input = $filter('date')(input, format, timezone)
			input = input || 'Infinite';
			return input
		}
	}])
	.filter('repeat', function(){
		return function(input) {
			input = input || 'Unknown';
			input = input < 0 ? 'Infinite' : input;
			return input
		}
	})
	.filter('period', function(){
		return function(input) {
			var result = findIntervalByCode(input).type
			result = result || 'Unknown';
			return result
		}
	})

})()
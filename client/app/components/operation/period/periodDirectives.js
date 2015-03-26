//periodDirectives.js
(function() {
	'use strict';


	angular.module('directives')
	
		.directive('dateBefore', function() {
			return {
				require: 'ngModel',
				restrict: '',
				link: function(scope, elem, attr, ctrl) {
					if (ctrl) {
						ctrl.$validators.date = function(modelValue) {
							var otherValue = attr.before
							otherValue = otherValue.substr(1, otherValue.length - 2)
								// alert(modelValue+' / '+otherValue)
							if (ctrl.$isEmpty(modelValue) || ctrl.$isEmpty(otherValue)) {
								return true
							}
							if (otherValue === undefined || modelValue === undefined) {
								return false
							}

							if (moment(modelValue).isBefore(moment(otherValue))) {
								return true
							}


							console.log(otherValue)
								// console.log(moment(modelValue).format('L')+" / "+moment(otherValue).format('L'))
							return false

							// return ctrl.$isEmpty(modelValue) || (otherValue !== undefined && moment(modelValue).before(moment(otherValue)))
						}
					}
				}
			}
		})
		.directive('dateAfter', function() {
			return {
				require: 'ngModel',
				restrict: '',
				link: function(scope, elem, attr, ctrl) {
					if (ctrl) {
						ctrl.$validators.date = function(modelValue) {
							var otherValue = attr.after
							otherValue = otherValue.substr(1, otherValue.length - 2)
							if (ctrl.$isEmpty(modelValue) || ctrl.$isEmpty(otherValue)) {
								return true
							}
							if (otherValue === undefined || modelValue === undefined) {
								return false
							}

							if (moment(modelValue).isAfter(moment(otherValue))) {
								return true
							}

							console.log(otherValue)
							return false
						}
					}
				}
			}
		})

})();
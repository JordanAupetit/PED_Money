// datePickerDirective.js
(function() {
	'use strict';


	angular.module('directives')
	.directive('datepicker', function(dateFilter) {
	    return {
	        restrict: 'A',
	        require : 'ngModel',
	        link : function (scope, element, attrs, ngModelCtrl) {
	            $(function(){
	            	// ngModelCtrl.$formatters.unshift(function (modelValue) {
              //       	return dateFilter(modelValue, 'yyyy-MM-dd');
	             //    });

	             //    ngModelCtrl.$parsers.unshift(function(viewValue) {
	             //        return new Date(viewValue);
	             //    });
	                element.datepicker({
	                    dateFormat:'dd/mm/yy',
	                    onSelect:function (date) {
	                        scope.$apply(function () {
	                            ngModelCtrl.$setViewValue(date);
	                        });
	                    }
	                });
	            });
	        }
	    }
	})

})()
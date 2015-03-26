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
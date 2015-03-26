// budgetDirective.js
(function() {
    'use strict';


    angular.module('directives')
        .directive('yearBtn', function () {
            return {
                restrict: 'AE',
                replace: false,
                transclude: false,
                scope: {
                },
                link: function (scope, element, attrs) {
                	element.bind('click', clickingCallback); 
                	function clickingCallback(){
                        scope.$parent.$parent[attrs.selector] = attrs.value
                        scope.$parent.$parent[attrs.trig](attrs.value) 
					}
                }
            };
        })

})();
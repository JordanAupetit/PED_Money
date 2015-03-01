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
                    // selector:'=selector'
                },
                link: function (scope, element, attrs) {
                	// console.log('Directive for "year-btn"')
                	// console.log(attrs)
                	element.bind('click', clickingCallback); 
                	function clickingCallback(){
                        // console.log(scope.$parent[attrs.selector])
                        console.log(scope.$parent.$parent[attrs.selector])
                        // scope.$parent[attrs.selector] = attrs.value
                        scope.$parent.$parent[attrs.selector] = attrs.value
                        scope.$parent.$parent[attrs.trig](attrs.value) 
                        console.log('clicked! '+attrs.value)
					}
                }
            };
        })

        // .directive('yearSelector', function () {
        //     return {
        //         restrict: 'AE',
        //         template: '<a value="{{year.year}}" class="budget-btn" ng-repeat="year in years" ng-click="changeYear($index)">{{year.year}}</a>' 
        //         replace: true,
        //         transclude: false,
        //         scope: {},
        //         link: function (scope, element, attrs) {
        //             console.log('Directive for "year-btn"')
        //             console.log(attrs)
        //             element.bind('click', clickingCallback); 
        //             function clickingCallback(){
        //                 scope.$parent.$parent[attrs.selector] = attrs.value
        //                 console.log('clicked! '+attrs.value)
        //             }
        //         }
        //     };
        // })

})();
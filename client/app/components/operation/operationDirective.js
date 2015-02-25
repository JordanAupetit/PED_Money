(function() {
    'use strict';


    angular.module('appModule')
        .directive('mydatepicker', function () {
            return {
                restrict: 'AE',
                replace: false,
                transclude: false,
                link: function (scope, element, attrs) {
                    $(element).datepicker({dateFormat:'dd/mm/yy'})
                }
            };
        })

        .directive('tooltip', function () {
            return {
                restrict: 'AE',
                replace: false,
                transclude: false,
                link: function (scope, element, attrs) {
                    $(element).tooltip()
                }
            };
        })

        .directive('btnAddOperation', function () {
            return {
                restrict: 'AE',
                replace: false,
                transclude: false,
                link: function (scope, element, attrs) {
                    $(element).click(function() {
                        $(".menuCreateOperation").animate({ "right": "0" }, "slow" );
                    });
                }
            };
        })

        .directive('closeMenuCreateOperation', function () {
            return {
                restrict: 'AE',
                replace: false,
                transclude: false,
                link: function (scope, element, attrs) {
                    $(element).click(function() {
                        $(".menuCreateOperation").animate({ "right": "-300px" }, "slow" );
                    });
                }
            };
        })

})();
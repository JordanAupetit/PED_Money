(function() {
    'use strict';


    angular.module('appModule')
        .directive('mydatepicker', function () {
            return {
                restrict: 'AE',
                replace: false,
                transclude: false,
                link: function (scope, element, attrs) {
                    $(element).datepicker({dateFormat:'yy/mm/dd'})
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
                        $("#sidebar-wrapper-right").animate({ "right": "0" }, "slow" );
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
                        $("#sidebar-wrapper-right").animate({ "right": "-350px" }, "slow" );
                    });
                }
            };
        })

        .directive('showSidebarMenu', function () {
            return {
                restrict: 'AE',
                replace: false,
                transclude: false,
                link: function (scope, element, attrs) {
                    $(element).click(function() {
                        $("#sidebar-wrapper-left").animate({ "left": "0" }, "slow" );
                    });
                }
            };
        })

        .directive('hideSidebarMenu', function () {
            return {
                restrict: 'AE',
                replace: false,
                transclude: false,
                link: function (scope, element, attrs) {
                    $(element).click(function() {
                        $("#sidebar-wrapper-left").animate({ "left": "-300px" }, "slow" );
                    });
                }
            };
        })

        .directive('buttonCheckbox', function () {
            return {
                restrict: 'AE',
                replace: false,
                transclude: false,
                link: function (scope, element, attrs) {
                    $(element).click(function() {
                        $(this).find("input").click();
                    });
                }
            };
        })

        .directive('hoverOperation', function () {
            return {
                restrict: 'AE',
                replace: false,
                transclude: false,
                link: function (scope, element, attrs) {

                    var btns = $(element).find(".operationButtons")
                    btns.hide()

                    $(element).hover(function() {
                        btns.show()
                    },
                    function(){
                        btns.hide()
                    })
                }
            };
        })

})();
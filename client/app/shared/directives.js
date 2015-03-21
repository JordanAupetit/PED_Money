(function() {
    'use strict';


    angular.module('directives')
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

        .directive('closeRightMenu', function () {
            return {
                restrict: 'AE',
                replace: false,
                transclude: false,
                link: function ($scope, element, attrs) {
                    $scope.closeRightMenu = function(){
                        $('#sidebar-wrapper-right').animate({ 'right': '-350px' }, 'slow' );
                    }
                }
            };
        })

        .directive('ngReallyClick', function() {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    element.bind('click', function() {
                        var message = attrs.ngReallyMessage;
                        if (message && confirm(message)) {
                            scope.$apply(attrs.ngReallyClick);
                        }
                    });
                }
            }
        })

})();
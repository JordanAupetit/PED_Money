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

})();
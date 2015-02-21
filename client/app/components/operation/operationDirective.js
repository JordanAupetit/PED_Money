(function() {
    'use strict';

    angular.module('controllers')
    .directive('datepicker', function () {
        return {
            restrict: 'AE',
            replace: false,
            transclude: false,
            link: function (scope, element, attrs) {
                $(element).datepicker({dateFormat:'dd/mm/yy'})
            }
        };
    });

})();




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

})();
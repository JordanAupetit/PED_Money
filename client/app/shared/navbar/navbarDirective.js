(function() {
    'use strict';

    angular.module('directives')
        .directive('toggleSidebarMenu', function () {
            var state = false
            return {
                restrict: 'AE',
                replace: false,
                transclude: false,
                link: function (scope, element, attrs) {
                    $(element).click(function() {
                        state = !state
                        if(state){ // Open
                            $('#sidebar-wrapper-left').animate({ 'left': '0' }, 'slow' ); 
                        }else{ // Close
                            $('#sidebar-wrapper-left').animate({ 'left': '-300px' }, 'slow' );
                        }
                    });
                }
            };
        })

})();
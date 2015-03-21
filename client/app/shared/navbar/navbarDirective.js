(function() {
    'use strict';

    angular.module('directives')
        .directive('toggleSidebarMenu', function () {
            //var state = false
            return {
                restrict: 'AE',
                replace: false,
                transclude: false,
                link: function (scope, element, attrs) {
                    $(element).click(function() {
                        //state = !state

                        // Le système de state ne fonctionne pas car il n'est pas reset 
                        // quand on selectionne un compte (par exemple)
                        if($('#sidebar-wrapper-left').css("left") !== "0px"){ // Open
                            $('#sidebar-wrapper-left').animate({ 'left': '0' }, 'slow' ); 
                        }else{ // Close
                            $('#sidebar-wrapper-left').animate({ 'left': '-200px' }, 'slow' );
                        }
                    });
                }
            };
        })

})();
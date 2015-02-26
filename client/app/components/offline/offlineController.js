(function(){

'use strict';

    angular
        .module('appModule')
        .controller('offlineController', ['$scope', '$rootScope', 'offlineService', '$state', 'localStorageService', 



            function($scope, $rootScope, offlineService, $state, localStorageService) {
                
                
                $scope.ajout = function() {
                    console.log("ajout")
                    $.jStorage.set("key", "value")
                }
                
                $scope.flush = function() {
                    console.log("flush")

                    $.jStorage.flush()
                }
            }]);
})();
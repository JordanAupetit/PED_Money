(function() {

    'use strict';

    angular
        .module('appModule')
        .controller('SettingsController', ['$scope', '$rootScope', '$state','SettingsService' , 'initService', 'StorageServices', 
            function($scope, $rootScope, $state, SettingsService, initService, StorageServices) {
                var info = StorageServices.getUser();
                //console.log(StorageServices.getUser())

                /*
                 Get user info 
                    */ 
                $scope.info = StorageServices.getUser(); 


                /*
                save changes and change the localstorage
                    */
                $scope.EditController = function() {

                var item = $scope.info;
                var EditUser = new SettingsService(item);
                //console.log(EditUser)
                EditUser.$save(function(res) {
                    if (res.type == false) {

                        alert(res.data);
                    } else {
                        //initService.initRessources(ipCookie('token'))
                        StorageServices.login(res.data)
                        $rootScope.$emit('login');
                        $state.go('accounts');
                    }
                });


            };

        }]);

})();
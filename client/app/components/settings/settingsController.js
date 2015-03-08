(function() {

    'use strict';

    angular
        .module('appModule')
        .controller('SettingsController', ['$scope', '$rootScope', '$state', 'ipCookie', 'SettingsService' , 'userInfos', 'initService', 'StorageServices', 
            function($scope, $rootScope, $state, ipCookie, SettingsService, userInfos, initService, StorageServices) {
                var info = StorageServices.getUser();
                $scope.info = info; 

                $scope.EditController = function() {

                var item = $scope.info;
                var EditUser = new SettingsService(item);
                //console.log(EditUser)
                EditUser.$save(function(res) {
                    if (res.type == false) {

                        alert(res.data);
                    } else {
                        ipCookie('token', res.data.token);
                        ipCookie('user', res.data.username);
                        $rootScope.currentUserSignedIn = res.data.token;
                        $rootScope.utlisateurCourant = res.data.username;
                        userInfos.set({
                            token: res.data.token,
                            user: res.data.username
                        })
                        initService.initRessources(ipCookie('token'))
                        StorageServices.login(res.data)
                        $state.go('accounts');
                    }
                });


            };

        }]);

})();
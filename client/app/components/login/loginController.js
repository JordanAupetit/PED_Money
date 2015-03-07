(function() {

    'use strict';

    angular
        .module('appModule')
        .controller('LoginController', ['$scope', '$rootScope', 'StorageServices', 'LoginService', '$state', 'ipCookie', 
            function($scope, $rootScope, StorageServices, LoginService, $state, ipCookie) {

            $scope.signin = function() {

                var formData = {
                    username: $scope.username,
                    password: $scope.password
                }

                var loginUser = new LoginService(formData);
                loginUser.$query(function(res) {
                    if (res.type == false) {
                        alert(res.data);
                    }else{
                        StorageServices.login(res.data)
                        $state.go('accounts');
                    }
                });
            };

            $scope.SignupController = function() {

                var item = $scope.User;
                var newUser = new LoginService(item);
                newUser.$save(function(res) {
                    if (res.type == false) {
                        alert(res.data);
                    } else {
                        //localStorageService.cookie.set('token',res.data.token);
                        $state.go('login');
                    }
                });


            };

        }]);

})();
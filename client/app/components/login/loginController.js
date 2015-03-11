(function() {

    'use strict';

    angular
        .module('appModule')
        .controller('LoginController', ['$scope', '$rootScope', 'LoginService', '$state', 'StorageServices', 
            function($scope, $rootScope, LoginService, $state, StorageServices) {


            /**
             * Redirect user if already login
             */
            if(StorageServices.getUser() !== undefined){
                $state.go('accounts');
            }

            /**
             * Login fct
             */
            $scope.signin = function() {

                var formData = {
                    username: $scope.username,
                    password: $scope.password
                }

                var loginUser = new LoginService(formData);
                loginUser.$query(function(res) {
                    if (res.type == false) {
                        alert(res.data);
                    } else {
                        StorageServices.login(res.data)
                        $rootScope.$emit('login');
                        //console.log($rootScope.$emit('login'))
                        $state.go('accounts');
                    }
                });
            };

            /**
             * Signup fct
             */
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
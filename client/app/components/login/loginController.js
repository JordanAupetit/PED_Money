(function() {

    'use strict';

    angular
        .module('appModule')
        .controller('LoginController', ['$scope', '$stateParams', '$rootScope', '$http', 'LoginService', '$state', 'StorageServices', LoginController])

    function LoginController($scope, $stateParams, $rootScope, $http, LoginService, $state, StorageServices) {
        /**
         * Redirect user if already login
         */
        if (StorageServices.getUser() !== undefined) {
            $state.go('accounts')
        }

        /**
         * Login fct
         */
        $scope.signin = function(data) {

            var formData = {
                username: data.username,
                password: data.password
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
        }

        //C'est quoi ce truc ?
        if ($stateParams.username !== undefined && $stateParams.token !== undefined) {
            // console.log("oui")
            $scope.signin($stateParams)
        }


        $scope.loginFB = function() {
            $http.get('/auth/facebook')
                .success(function(data, status, headers, config) {
                    console.log('success')
                    console.log(data)
                })
                .error(function(data, status, headers, config) {
                    console.log('error')
                    console.log(data)
                });
        }

        /**
         * Signup fct
         */
        $scope.SignupController = function() {
            var item = $scope.User
            var newUser = new LoginService(item)
            newUser.$save(function(res) {
                if (res.type == false) {
                    alert(res.data)
                } else {
                    //localStorageService.cookie.set('token',res.data.token);
                    $state.go('login')
                }
            })
        }
    }

})();
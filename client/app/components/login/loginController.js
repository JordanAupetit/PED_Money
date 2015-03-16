(function() {

    'use strict';

    angular
        .module('appModule')
        .controller('LoginController', ['$scope', '$stateParams', '$rootScope', '$http', 'LoginService', '$state', 'StorageServices', 
            function($scope, $stateParams, $rootScope, $http, LoginService, $state, StorageServices) {
/*
            console.log($stateParams)
            console.log('test')

            if($stateParams.id !== undefined && $stateParams.cid !== undefined){
                console.log("yeeeeeeeeep")
            }
*/
// http://localhost:8754/#/login?id=5506b658c45&cid=10206070
// http://localhost:8754/#/login?id=azert&cid=azerty

            

            /**
             * Redirect user if already login
             */
             /*
            if(StorageServices.getUser() !== undefined){
                $state.go('accounts');
            }
            */

            /**
             * Login fct
             */
            $scope.signin = function(data) {

                var formData = data;

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

            if($stateParams.username !== undefined && $stateParams.token !== undefined){
                console.log("oui")
                $scope.signin($stateParams)
            }

            $scope.loginFB = function(){
                $http.get('/auth/facebook').
                    success(function(data, status, headers, config) {
                        console.log('success')
                        console.log(data)
                    }).
                    error(function(data, status, headers, config) {
                        console.log('error')
                        console.log(data)
                    });
            }

            /**
             * Signup fct
             */
            $scope.SignupController = function(User) {

                var item = User;
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
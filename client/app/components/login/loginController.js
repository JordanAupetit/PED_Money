(function() {

    'use strict';

    angular
        .module('appModule')
        .controller('LoginController', ['$scope', '$stateParams', '$rootScope', '$http', 'LoginService', '$state', 'StorageServices', 
            function($scope, $stateParams, $rootScope, $http, LoginService, $state, StorageServices) {

            $scope.myInterval = 5000;
            var slides = $scope.slides = [];
            $scope.addSlide = function() {
                var newWidth =  slides.length + 1;
                slides.push({
                      image: 'assets/img/slide/budget'+newWidth+'.png' ,
                      text: ['Budget ','Budget'][slides.length % 4] + ' ' +
                        ['Account', 'Camembert'][slides.length % 4]
                        });
            };
              for (var i=0; i<2; i++) {
                $scope.addSlide();
              }

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
                        $rootScope.bool=true;
                        //console.log($rootScope.$emit('login'))
                        $state.go('accounts');
                    }
                });
            }

            if($stateParams.username !== undefined && $stateParams.token !== undefined){
                $scope.signin($stateParams)
            }
            else if(!StorageServices.isOnline()){
                $state.go('offline')
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
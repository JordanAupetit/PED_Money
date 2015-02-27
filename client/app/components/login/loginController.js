(function(){

'use strict';

    angular
        .module('appModule')
        .controller('LoginController', ['$scope', '$rootScope', 'LoginService', '$state', 'localStorageService', 

            function($scope, $rootScope, LoginService, $state, localStorageService) {

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
                            localStorageService.cookie.set('token',res.data.token);
                            $rootScope.currentUserSignedIn = res.data.token

                            // (jordan) Peut être temporaire, j'ai besoin de l'ID pour les catégories
                            $rootScope.currentUserSignedInId = res.data._id
                            console.log($rootScope)
                            $state.go('accounts');    
                        }
                    });
                };
        
            }]);
})();
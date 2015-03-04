(function(){

'use strict';

    angular
        .module('appModule')
        .controller('LoginController', ['$scope','$rootScope','LoginService','$state','ipCookie', function($scope,$rootScope,LoginService,$state,ipCookie) {



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
                ipCookie('token', res.data.token);
                ipCookie('user', res.data.username);
                $rootScope.currentUserSignedIn = res.data.token;
                $rootScope.utlisateurCourant = res.data.username;
                $state.go('accounts');    
            }
        });
    };
        
}]);
})();
(function(){

'use strict';

    angular

        .module('controllers')
        .controller('NavbarController', ['$scope','$rootScope','$state','ipCookie', function($scope,$rootScope,$state,ipCookie) {
                $rootScope.currentUserSignedIn = ipCookie('token');
                $rootScope.utlisateurCourant = ipCookie('user');
           $scope.logout = function() {
                ipCookie.remove('token');
                ipCookie.remove('user');
                $rootScope.currentUserSignedIn = null;
                $rootScope.utlisateurCourant = null ;
                $state.go('login');


            }, function() {
                alert("Failed to logout!");
            
            };
        
}]);
	
})();
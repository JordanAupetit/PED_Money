(function(){

'use strict';

    angular
        .module('controllers')
        .controller('NavbarController', ['$scope','$rootScope','$state','ipCookie', 'AccountResource', function($scope, $rootScope, $state, ipCookie, AccountResource) {
            

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

            var getAccounts = function() {
                AccountResource.getAll().$promise.then(function(accounts){
                    $scope.accounts = accounts
                })
            }

            getAccounts();
        
        }]);
	
})();
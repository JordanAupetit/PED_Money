(function(){

    'use strict';

    angular

        .module('controllers')
        .controller('NavbarController', ['$scope','$rootScope','$state','ipCookie', 'initService', NavbarController])




    function NavbarController($scope, $rootScope, $state, ipCookie, initService) {
        $rootScope.currentUserSignedIn = ipCookie('token')
        $rootScope.utlisateurCourant = ipCookie('user')

        $scope.logout = function() {
                ipCookie.remove('token')
                ipCookie.remove('user')
                $rootScope.currentUserSignedIn = null
                $rootScope.utlisateurCourant = null 
                $state.go('login')
        }
        
        $scope.initData = function(){
            initService.loadDataset1()
            .then(function(){
                console.log('Db init OK')
            })
        }
    }
	
})();
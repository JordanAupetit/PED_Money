(function(){

    'use strict';

    angular
        .module('controllers')
        .controller('NavbarController', ['$scope','$rootScope','$state','ipCookie', 'initService', 'userInfos', NavbarController])




    function NavbarController($scope, $rootScope, $state, ipCookie, initService, userInfos) {
        $rootScope.currentUserSignedIn = ipCookie('token')
        $rootScope.utlisateurCourant = ipCookie('user')
        userInfos.set({
            token: ipCookie('token'),
            user: ipCookie('user')
        })
        initService.initRessources(ipCookie('token'))

        $scope.logout = function() {
                ipCookie.remove('token')
                ipCookie.remove('user')
                $rootScope.currentUserSignedIn = null
                $rootScope.utlisateurCourant = null 
                userInfos.set(undefined)
                console.log('OK')
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
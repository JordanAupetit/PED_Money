(function(){
    'use strict';

    angular
        .module('controllers')
        .controller('NavbarController', ['$scope','$rootScope','$state','ipCookie', 'initService', 'userInfos', 'StorageServices', NavbarController])

    function NavbarController($scope, $rootScope, $state, ipCookie, initService, userInfos, StorageServices) {
        $rootScope.currentUserSignedIn = ipCookie('token')
        $rootScope.utlisateurCourant = ipCookie('user')

        var user = StorageServices.getUser()
        if(user != null)
            $rootScope.login = true
        else
            $rootScope.login = false
        
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
                StorageServices.logout()
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
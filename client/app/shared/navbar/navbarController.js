(function(){
    'use strict';

    angular
        .module('controllers')
        .controller('NavbarController', ['$scope','$rootScope', 'StorageServices', '$state','ipCookie', 'initService', NavbarController])


    function NavbarController($scope, $rootScope, StorageServices, $state, ipCookie, initService) {
        
        var user = StorageServices.getUser()
        if(user != null)
            $rootScope.login = true
        else
            $rootScope.login = false

        $scope.logout = function() {
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
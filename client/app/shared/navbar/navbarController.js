(function(){
    'use strict';

    angular
        .module('controllers')
        .controller('NavbarController', ['$scope','$rootScope', 'StorageServices', '$state','ipCookie', 'initService', NavbarController])


    function NavbarController($scope, $rootScope, StorageServices, $state, ipCookie, initService) {
        
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
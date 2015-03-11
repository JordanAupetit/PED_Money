(function(){
    'use strict';

    angular
        .module('controllers')
        .controller('NavbarController', ['$scope','$rootScope','$state', 'initService', 'StorageServices', NavbarController])

    function NavbarController($scope, $rootScope, $state, initService, StorageServices) {

        $scope.user = StorageServices.getUser()

        /**
         * Trigger on login
         * Refresh $scope.user value
         */
        $rootScope.$on('login', function(event) {
            // console.log('login evt'); 
            $scope.user = StorageServices.getUser()
        })

        $scope.logout = function() {
            StorageServices.logout()
            initService.initRessources(undefined)
            $scope.user = undefined
            $state.go('login')
        }
        
        $scope.initData = function(){
            initService.loadDataset1()
            .then(function(){
                console.log('Db init OK')
            })
        }

        /*var getAccounts = function() {
            AccountResource.getAll().$promise.then(function(accounts){
                $scope.accounts = accounts
            })
        }

        getAccounts();*/
    }	
})();
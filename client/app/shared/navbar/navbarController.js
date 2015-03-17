(function(){
    'use strict';

    angular
        .module('controllers')
        .controller('NavbarController', ['$scope','$rootScope','$state', 'initService', 'StorageServices', 'AccountResource', NavbarController])

    function NavbarController($scope, $rootScope, $state, initService, StorageServices, AccountResource) {

        $scope.user = StorageServices.getUser()

        /**
         * Trigger on login
         * Refresh $scope.user value
         */
        $rootScope.$on('login', function(event) {
            // console.log('login evt'); 
            $scope.user = StorageServices.getUser()
            getAccounts();
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

        function callback(accounts){
            $scope.accounts = accounts
        }

        var getAccounts = function() {
            StorageServices.getAccounts(callback)
        }

        // Si on est deja connecté lors du F5, récupérer les accounts
        if(StorageServices.getUser()) {
            getAccounts();
        }
    }	
})();
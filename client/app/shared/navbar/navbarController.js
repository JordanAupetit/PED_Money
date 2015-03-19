(function(){
    'use strict';

    angular
        .module('controllers')
        .controller('NavbarController', ['$scope','$rootScope','$state', 'initService', 'StorageServices', 'AccountResource', '$location', NavbarController])

    function NavbarController($scope, $rootScope, $state, initService, StorageServices, AccountResource, $location) {

        $scope.user = StorageServices.getUser()

        // On récupère toujours l'URL courante même en la changeant à la main
        // cela permet de ne pas afficher la navbar sur le login
        $rootScope.$watch(function() { 
            return $location.path(); 
        },
        function(url){  
            $scope.currentUrl = url
        });

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
            StorageServices.logout(function(){
                initService.initRessources(undefined)
                $scope.user = undefined
                $state.go('login')
            })
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
            if($location.url() === "/login") {
                $scope.logout()
            } else {
                getAccounts();
            }
        }
    }	
})();
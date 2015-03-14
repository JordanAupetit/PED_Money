(function(){
    'use strict';

    angular
        .module('controllers')
        .controller('NavbarController', ['$scope','$rootScope','$state', 'initService', 'StorageServices', '$http', NavbarController])

    function NavbarController($scope, $rootScope, $state, initService, StorageServices, $http) {

        $scope.user = StorageServices.getUser()
        $scope.initSelector = 'dataset_etienne.json'

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
            var accountId = $state.params.accountId

            if(accountId === undefined){
                console.log('Got to an account to init data')
            }else{
                // console.log(accountId)
                $http.get('datasets/'+$scope.initSelector).success(function(data){
                    initService.loadDataset(data, accountId).then(function(){
                        console.log('Db init OK')
                    })
                }).error(function(data, status, headers, config){
                    console.log(data)
                    console.log(status)
                    console.log(headers)
                    console.log(config)
                })
                // initService.loadDataset1()
                // .then(function(){
                //     console.log('Db init OK')
                // })
            }
            
        }

        /*var getAccounts = function() {
            AccountResource.getAll().$promise.then(function(accounts){
                $scope.accounts = accounts
            })
        }

        getAccounts();*/
    }	
})();
(function(){
    'use strict';

    angular
        .module('controllers')
        .controller('NavbarController', ['$scope','$rootScope','$state', 'initService', 'StorageServices', NavbarController])

    function NavbarController($scope, $rootScope, $state, initService, StorageServices) {

        $scope.user = StorageServices.getUser()

        /**
         * Init ressources on page reload
         */
        if($scope.user !== undefined){
            initService.initRessources($scope.user.token)
        }
        

        
        /**
         * Trigger on login
         * Init ressources o n login
         */
        $rootScope.$on('login', function(event) {
            // console.log('login evt'); 
            $scope.user = StorageServices.getUser()
            initService.initRessources($scope.user.token)
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
    }	
})();
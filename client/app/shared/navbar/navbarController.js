(function(){

    'use strict';

    angular
        .module('controllers')
        .controller('NavbarController', ['$scope','$rootScope','$state','localStorageService', 'initService', NavbarController])




    function NavbarController($scope, $rootScope, $state, localStorageService, initService) {
        $rootScope.currentUserSignedIn = localStorageService.cookie.get('token');
        //alert($localStorage.token);
        $scope.logout = function() {
            localStorageService.cookie.remove('token');
            $rootScope.currentUserSignedIn = null;
            $state.go('login');
        }, function() {
            alert('Failed to logout!');
        };
        
        $scope.initData = function(){
            initService.loadDataset1()
            .then(function(){
                console.log('Db init OK')
            })
        }
    }
	
})();
(function() {

    'use strict';

    angular
        .module('appModule')
        .controller('LoginController', ['$scope', '$stateParams', '$rootScope', 'LoginService', '$state', 'StorageServices', LoginController])

    function LoginController($scope, $stateParams, $rootScope, LoginService, $state, StorageServices) {
       $scope.team = [
                {
                    name: 'Etienne Grandier',
                    picture: 'assets/img/etienne.jpg',
                    email: 'jackiller33@gmail.com'
                },
                {
                    name: 'Jordan Aupetit',
                    picture: 'assets/img/jaupetit.jpg',
                    email: 'jordan.aupetit@gmail.com'
                },
                {
                    name: 'Dimitri Ranc',
                    picture: 'assets/img/dranc.jpg',
                    email: 'ranc.dimitri@gmail.com'
                },
                {
                    name: 'Youssef Sahri',
                    picture: 'assets/img/default.jpg',
                    email: 'sahri.youssef@gmail.com'
                },
                {
                    name: 'Abdessamad Essaydi',
                    picture: 'assets/img/default.jpg',
                    email: 'abdessaydi@gmail.com'
                }
            ]

        if($stateParams.username !== undefined && $stateParams.token !== undefined){
            var loginUser = new LoginService($stateParams);
            loginUser.$query(function(res) {
                if (res.type == false) {
                    alert(res.data);
                } else {
                    StorageServices.login(res.data)
                    $rootScope.$emit('login')
                    $state.go('accounts')
                }
            })
        }
    }

})();
 (function() {
    'use strict';


  angular
        .module('appModule')
        .controller('NewPassController', ['$scope', '$stateParams', '$rootScope', '$http', 'PassService', '$state', 'StorageServices', 
            function($scope, $stateParams, $rootScope, $http, PassService, $state, StorageServices) {

                
                $scope.confirm =function(user){
                    var formData = user;

                var loginUser = new PassService(formData);
                loginUser.$query({token : $stateParams.token},function(res) {
                    if (res.type == false) {
                        alert(res.data);
                    } else {
                        $state.go('login');
                    }
                });
                }


                  }]);
})();
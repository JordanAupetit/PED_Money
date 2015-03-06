(function(){

'use strict';

angular
    .module('appModule')
    .controller('offlineController', ['$scope', '$rootScope', '$state', 'localStorageService', 'OperationResource',
        function($scope, $rootScope, $state, localStorageService, OperationResource) {
            $scope.up = true
            
            function synchWithServer(){
                var wfc = eval('('+localStorage.getItem('waitingforconnection')+')')
                for(var i in wfc.operations.POSTs){
                    //TODO add un promise et supprimer de la liste seulement si recu
                    OperationResource.add(wfc.operations.POSTs[i])
                }           
                initWaitingForConnection()
            }

            function initWaitingForConnection(){
                wfc = {
                    'operations': {
                        'POSTs': []
                    }
                }
                localStorage.setItem('waitingforconnection', JSON.stringify(wfc))
            }

            var wfc = eval('('+localStorage.getItem('waitingforconnection')+')')
            if(wfc == null || wfc == ''){
                initWaitingForConnection()
            }
            synchWithServer()

            // ne pas stocker les requetes
            // Offline.options.requests = false
            // Offline.options.checkOnLoad = true

            Offline.on('down', function(){
                console.info('connection lost')
                $scope.up = false
            }, null)
            
            Offline.on('up', function(){
                console.info('connected')
                $scope.up = true
                synchWithServer()
            }, null)
            Offline.check()
        }]);
})();
(function(){
    'use strict';

    angular
        .module('controllers')
        .controller('offlineController', ['$scope', '$rootScope', '$state', 'localStorageService', 'OperationResource',
            function($scope, $rootScope, $state, localStorageService, OperationResource) {
            
                /*
                function synchWithServer(){
                    var wfc = eval("("+localStorage.getItem("waitingforconnection")+")")
                    for(var i in wfc.operations.POSTs){
                        //TODO add un promise et supprimer de la liste seulement si recu
                        OperationResource.add(wfc.operations.POSTs[i])
                    }           
                    initWaitingForConnection()
                }

                function initWaitingForConnection(){
                    wfc = {
                        "operations": {
                            "POSTs": []
                        }
                    }
                    localStorage.setItem("waitingforconnection", JSON.stringify(wfc))
                }

                var wfc = eval("("+localStorage.getItem("waitingforconnection")+")")
                if(wfc == null || wfc == ""){
                    initWaitingForConnection()
                }
                synchWithServer()
                */
                // ne pas stocker les requetes
                // Offline.options.requests = false
                // Offline.options.checkOnLoad = false
               
                function initWaitingForConnection(){
                    wfc = {
                        "OperationResource": {
                            "add": []
                        }
                    }
                    localStorage.setItem("waitingforconnection", JSON.stringify(wfc))
                }

                var wfc = eval("("+localStorage.getItem("waitingforconnection")+")")
                if(wfc == null || wfc == ""){
                    initWaitingForConnection()
                }

                $scope.offline = false
                $rootScope.offline = false

                Offline.on("down", function(){
                    console.info("connection lost")
                    $scope.offline = true
                    $rootScope.offline = true
                }, null)
                
                Offline.on("confirmed-up", function(){
                    $scope.offline = false
                    $rootScope.offline = false
                    //synchWithServer()
                }, null)

                Offline.check()
        }]);
})();
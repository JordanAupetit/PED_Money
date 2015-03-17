(function() {
    'use strict';

    angular.module('services')
    .factory('StorageServices', ['$rootScope', 'OperationResource', 'AccountResource', 'localStorageService', 
    function($rootScope, OperationResource, AccountResource, localStorageService){
        
        function wfc(resource, fct, data){
            this.resource = resource
            this.fct = fct
            this.data = data
        }

        function getWaitingForConnection(){
            var data = localStorageService.get("WFC")
            if(data === null)
                return []
            else
                return data
        }

        function addWaitingForConnection(wfc){
            var data = getWaitingForConnection()
            data.push(wfc)
            localStorageService.set("WFC", JSON.stringify(data))
        }

        function getLocalData(){
            return localStorageService.get("DATA")
            /*
            var data = localStorageService.get("DATA")
            if(data === null) // If DATA is not define
                return {'user': undefined, 'accounts': []}
            //TODO remettre return {} quand le lien avec la connection
            //sera fait
            else
                return data
            */
        }

        function setLocalData(data){
            localStorageService.set("DATA", JSON.stringify(data))
        }

        var online = true

        Offline.on("down", function(){
            console.info("connection lost")
            $rootScope.offline = true
            online = false
        }, null)
        
        Offline.on("up", function(){
            $rootScope.offline = false
            online = true
        }, null)

        return {
            isOnline: function(){
                Offline.check()
                return online
            },
            login: function(user) {
                localStorageService.set("USER", user)                
            },
            logout: function() {
                localStorageService.clearAll()
            },
            getUser: function(){
                return localStorageService.get("USER")
            },
            getAccount: function(accountId){
                return localStorageService.get("ACCOUNT-"+accountId)
            },
            setAccount: function(accountId, account){
                return localStorageService.set("ACCOUNT-"+accountId, account)
            },
            getOperations: function(accountId){
                /*
                var data = getLocalData()
                for(var i in data.accounts){
                    if(data.accounts[i]._id == accountId)
                        return data.accounts[i].operations
                }
                return {}
                */
            },
            setOperations: function(accountId, operations){
                /*
                var data = getLocalData()
                for(var i in data.accounts){
                    if(data.accounts[i]._id == accountId){
                        data.accounts[i].operations = operations
                    }
                }
                setLocalData(data)
                */
            },            
            postOperation: function(accountId, operation){
                /*
                addWaitingForConnection(new wfc('OperationResource', 'add', operation))
                var data = getLocalData()
                for(var i in data.accounts){
                    if(data.accounts[i]._id == accountId){
                        if(!data.accounts[i].hasOwnProperty('operations'))
                            data.accounts[i].operations = []
                        data.accounts[i].operations.push(operation)
                    }
                }
                setLocalData(data)
                */
            },
            updateOperation: function(operation){
            },
            deleteOperation: function(operation){

            }
        }
    }])
})();
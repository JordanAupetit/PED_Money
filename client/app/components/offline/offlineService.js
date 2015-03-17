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

        function getLocalAccount(){
            var accounts = []
            var keys = localStorageService.keys()
            for(var i in keys){
                if(keys[i] === "USER"){
                    accounts.push(localStorageService.get(keys))
                }
            }
            return accounts
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
            getAccount: function(accountId, callback){
                AccountResource.get(accountId).$promise.then(function(account){
                    localStorageService.set(account._id, account)
                    callback(account)
                }, function(err){
                    callback(localStorageService.get(accountId))
                })                
            },
            getAccounts: function(callback){
                AccountResource.getAll().$promise.then(function(accounts){
                    for(var i in accounts){
                        if(accounts[i]._id)
                            localStorageService.set(accounts[i]._id, accounts[i])
                    }
                    callback(accounts)
                }, function(err){
                    callback(getLocalAccounts())
                })
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
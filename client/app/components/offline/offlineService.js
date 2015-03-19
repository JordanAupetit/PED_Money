(function() {
    'use strict';

    angular.module('services')
    .factory('StorageServices', ['$rootScope', '$http', 'OperationResource', 'AccountResource', 'localStorageService', 
    function($rootScope, $http, OperationResource, AccountResource, localStorageService){
        
        function wfc(fct, data){
            this.fct = fct
            this.data = data
        }

        function addWaitingForConnection(wfc){
            var data = localStorageService.get("WFC")
            if(data === null)
                data = []
            data.push(wfc)
            localStorageService.set("WFC", data)
        }

        function updateWaitingForConnection(operation, update){
            var data = localStorageService.get("WFC")
            if(data !== null){
                for(var i in data){
                    if(data.wfc.data._id === operation._id){
                        if(update)
                            account.operations[i] = operation                            
                        else
                            account.operations.splice(i,1)
                        break
                    }
                }
            }
            localStorageService.set("WFC", data)
        }

        function getLocalAccounts(){
            var accounts = []
            var keys = localStorageService.keys()
            for(var i in keys){
                if(keys[i] !== "USER" && keys[i] !== "WFC"){
                    accounts.push(localStorageService.get(keys[i]))
                }
            }
            return accounts
        }

        /**
        *   @Description
        *   save an account in the local storage of the browser
        *   to keep all the data, we check if we have got some field
        *   that is not in the new version of the account (for exemple
        *   the balance of the account that is not send when you call, get 
        *   all of the accounts)
        */
        function saveAccount(account){
            var data = localStorageService.get(account._id)
            if(data !== null){
                for(var k in data){
                    if(!account.hasOwnProperty(k)){
                        account.k = data.k
                    }
                }
            }
            localStorageService.set(account._id, account)
        }

        function savePostOperation(operation, callback){
            var account = localStorageService.get(operation.accountId)
            if(!account.operations)
                account.operations = []
            operation._id = new Date()
            operation.wfc = true
            account.operations.push(operation)
            localStorageService.set(operation.accountId, account)
            addWaitingForConnection(new wfc("postOperation", operation))
            if(callback)
                callback()
        }

        function saveDeleteOperation(operation, callback){
            var account = localStorageService.get(operation.accountId)
            var operation
            for(var i in account.operations){
                if(account.operations[i]._id === operation._id){
                    operation = account.operations[i]
                    account.operations.splice(i,1)
                    break
                }
            }

            if(operation && operation.wfc)
                updateWaitingForConnection(operation, true)
            else
                addWaitingForConnection(new wfc("deleteOperation", operation))

            if(callback)
                   callback()
        }

        function saveUpdateOperation(operation, callback){
            var account = localStorageService.get(operation.accountId)
            for(var i in account.operations){
                if(account.operations[i]._id === operation._id){
                    account.operations[i] = operation
                }
            }

            if(operation && operation.wfc)
                updateWaitingForConnection(operation, false)
            else
                addWaitingForConnection(new wfc("updateOperation", operation))
            
            if(callback)
                callback()
        }

        /**
        *   @Description
        *   Try to add an operation to the bdd, if the user is offline,
        *   we store it for later. Anyway, we call the fonction callback
        *   when it's done
        */
        function postOperation(operation, callback){
            if($rootScope.state === 'ONLINE'){
                OperationResource.add(operation).$promise.then(function(operation){
                    callback()
                }).catch(function(error) {
                    savePostOperation(operation, callback)
                    ping()
                })
            }
            else{
                savePostOperation(operation, callback)
            }
        }

        function updateOperation(operation, callback){
            if($rootScope.state === 'ONLINE'){
                OperationResource.update(operation).$promise.then(function(){
                    if(callback)
                        callback()
                }).catch(function(error){
                    saveUpdateOperation(operation, callback)
                    ping()
                })
            }
            else{
                saveUpdateOperation(operation, callback)
            }
        }

        function deleteOperation(operation, callback){
            if($rootScope.state === 'ONLINE'){
                OperationResource.remove(operation._id).$promise.then(function(){
                    callback()
                }).catch(function(error){
                    saveDeleteOperation(operation, callback)
                    ping()
                })
            }
            else{
                saveDeleteOperation(operation, callback)
            }
        }

        /**
        *   @Description
        *   This method is called when the user is online again, it should
        *   send all element that is waiting for connection (wfc), delete all the
        *   storage (except the user), and refresh the page to be sure the user don't have
        *   data that is expired
        */
        function connecting(){
            var WFCs = localStorageService.get("WFC")
            localStorageService.remove("WFC")
            if(WFCs && WFCs.length>0){
                for(var i in WFCs){
                    var wfc = WFCs[i]
                    if(wfc.fct === 'postOperation'){
                        postOperation(wfc.data, function(){
                            console.info("The operation has been created")
                        })
                    }
                    else if(wfc.fct === 'updateOperation'){
                        updateOperation(wfc.data, function(){
                            console.info("The operation has been edited")
                        })
                    }
                    else if(wfc.fct === 'deleteOperation'){
                        deleteOperation(wfc.data, function(){
                            console.info("The operation has been deleted")
                        })
                    }
                    else{
                        console.error(wfc.fct + " is not implemented yet")
                    }
                }
            }
            $rootScope.state = 'ONLINE'
        }

        function ping(){
            $rootScope.state = 'TESTING'
            $http.get('/favicon.ico').
                success(function(data, status, headers, config) {
                    $rootScope.state = 'CONNECTING'
                    $rootScope.offline = false
                    connecting()
                }).
                error(function(data, status, headers, config) {
                    $rootScope.offline = true
                    $rootScope.state = 'OFFLINE'
                    setTimeout(function(){ ping()}, 3000)
                });
        }
        ping()

        return {
            login: function(user) {
                localStorageService.set("USER", user)                
            },
            logout: function(callback) {
                localStorageService.clearAll()
                callback()
            },
            getUser: function(){
                return localStorageService.get("USER")
            },
            getAccount: function(accountId, callback){
                if($rootScope.state === 'ONLINE'){
                    AccountResource.get(accountId).$promise.then(function(account){
                        saveAccount(account)
                        callback(account)
                    }, function(err){
                        callback(localStorageService.get(accountId))    
                    })
                }
                else{
                    callback(localStorageService.get(accountId))
                }      
            },
            getAccounts: function(callback){
                if($rootScope.state === 'ONLINE'){
                    AccountResource.getAll().$promise.then(function(accounts){
                        for(var i in accounts){
                            if(accounts[i]._id)
                                saveAccount(accounts[i])
                        }
                        callback(accounts)
                    }, function(err){
                        callback(getLocalAccounts())
                    })
                }
                else{
                    callback(getLocalAccounts())
                }
            },  
            postOperation: function(operation, callback){
                postOperation(operation, callback)
            },
            updateOperation: function(operation, callback){
                updateOperation(operation, callback)
            },
            deleteOperation: function(operation, callback){
                deleteOperation(operation, callback)
            }
        }
    }])
})();
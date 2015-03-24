(function() {
    'use strict';

    angular
        .module('controllers')
        .controller('AccountSettingsController', ['$scope', '$rootScope', '$state', 'StorageServices', 'AccountResource', 'OperationResource', 'initService', AccountSettingsController])

    function AccountSettingsController($scope, $rootScope, $state, StorageServices, AccountResource, OperationResource, initService) {

        /**
        *   We store the account out of the scope, so the user can change the alerts
        *   and keep the samename of the account if he want to
        */
        var accountBeforeChange

        /**
        *   @Description
        *   Refresh the scope. It's used when the controller is loaded and each time
        *   the account is changed
        */
        function refreshScope(){
            $scope.newalert = {"level": 0, "message": ''}
            $scope.currencies = CURRENCYS
            $scope.accountTypes = ACCOUNT_TYPES
            $scope.importButtonTitle = "No operations to import"
            $scope.operationsToAdd = []
            getAccount()
        }

        /**
        *   @Description
        *   Get the account, called the webservice to get the account information
        */
        function getAccount(){
            StorageServices.getAccount($state.params.accountId, function(account){
                accountBeforeChange = account
                if(account === null) return;

                var curPos
                angular.forEach($scope.currencies, function(cur, pos) {
                    if (cur.code === account.currency) {
                        curPos = pos
                    }
                })
                account.currency = $scope.currencies[curPos]

                var typePos
                angular.forEach(ACCOUNT_TYPES, function(type, pos) {
                    if (type.value === account.type) {
                        typePos = pos
                    }
                })
                account.type = ACCOUNT_TYPES[typePos]

                $scope.account = account
                $scope.rebalance = account.balance
                $rootScope.account = account
                $rootScope.$emit('accountSelected');
            })  
        }

        /**
        *   @Description
        *   Update the account. Send it to the server and refresh the scope. It's the variable
        *   accountBeforeChange that is send, not the scope one.
        */
        function updateAccount(){
            AccountResource.update(accountBeforeChange).$promise.then(function (account){
                refreshScope()
                $rootScope.$emit('accountRefresh');
            }, function(err){
                console.log("Something went wrong ... " + err)
            })
        }

        /**
        *   @Description
        *   Add an operation to the account in order to rebalance the amount
        *   of this account, in fact the account is not changed
        */
        $scope.rebalanceAccount = function(){
            if($scope.rebalance != $scope.account.balance){
                if(event !== undefined){
                    var target = event.target
                    target.textContent = "loading ..."
                    target.disabled = true
                }

                var operation = {
                    "value": $scope.rebalance-$scope.account.balance,
                    "accountId":$scope.account._id,
                    "dateOperation": moment().format('YYYY-MM-DD'),
                    "datePrelevement": moment().format('YYYY-MM-DD'),
                    "description": 
                    "Rebalance from " + 
                    $scope.account.balance + " " + $scope.account.currency 
                    + " to " + 
                    $scope.rebalance + " " + $scope.account.currency,
                }

                StorageServices.postOperation(operation, function(operation){
                    refreshScope()
                    if(target !== undefined){
                        target.textContent = "Save"
                        target.disabled = false
                    }
                })
            }
        }

        /**
        *   @Description
        *   Update the account (the name, the currency ...)
        */
        $scope.updateAccount = function(){
            accountBeforeChange.name = $scope.account.name
            accountBeforeChange.currency = $scope.account.currency.code
            accountBeforeChange.type = $scope.account.type.value

            updateAccount()
        }

        /**
        *   @Description
        *   Delete an alert and update the account
        *   @Param {Number} The index of the alert to delete
        */
        $scope.deleteAlert = function(index){
            accountBeforeChange.alerts.splice(index, 1)
            accountBeforeChange.currency = accountBeforeChange.currency.code
            accountBeforeChange.type = accountBeforeChange.type.value

            updateAccount()
        }

        /**
        *   @Description
        *   Add an alert and update the account
        */
        $scope.addAlert = function(){
            accountBeforeChange.alerts.push($scope.newalert)
            accountBeforeChange.currency = accountBeforeChange.currency.code
            accountBeforeChange.type = accountBeforeChange.type.value

            updateAccount()
        }

        /**
        *   @Description
        *   Ask the user if he is sure, delete the account and go to the accounts page
        */
        $scope.deleteAccount = function(accountId){
            AccountResource.remove(accountId).$promise.then(function() {
                $state.go('accounts')
            })
        }

        /**
             * @Description
             * Parse the content of the csv file and convert it to Json
             * @Param {string} $fileContent Content of the csv file
             */
            $scope.importCsv = function($fileContent){
                var ops = []
                var csvToJson = Papa.parse($fileContent)
                csvToJson = csvToJson.data

                if(csvToJson.length < 5) {
                    console.log("Le fichier csv n'est pas correct ou est vide.")
                } else {
                    var headerLine = 3
                    // On commence après les 3 premières lignes
                    for(var i = (headerLine + 1); i < csvToJson.length; i++) {
                        var newOp = {}
                        for(var j = 0; j < csvToJson[i].length; j++) {
                            newOp[csvToJson[headerLine][j]] = csvToJson[i][j]

                            if($state.params.accountId !== "") {
                                newOp.accountId = $state.params.accountId
                            }
                        }

                        if(newOp.hasOwnProperty("value")) {
                            newOp = OperationResource.correctDateOfOperation(newOp)
                            ops.push(newOp)
                        }
                    }
                }

                $scope.operationsToAdd = ops

                if(ops.length > 0) {
                    $scope.importButtonTitle = "Import " + ops.length + " operations"
                } else {
                    $scope.importButtonTitle = "No operations to import"
                }
            }

            /**
             * @Description
             * Add all operations extract from the csv file
             */
            $scope.addOperationsFromCsv = function() {
                if($scope.operationsToAdd.length > 0) {
                    // On ajoute une liste d'opérations
                    StorageServices.postOperation($scope.operationsToAdd, function(){
                        refreshScope()
                    })
                }
                $scope.importButtonTitle = "No operations to import"
            }

        /**
        *   When the Controller is loaded, the scope must be refreshed
        */
        refreshScope()
    }
})();
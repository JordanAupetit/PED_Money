(function() {

    'use strict';

    var accountTypes = [
                {
                    name: 'Banking',
                    value: 1
                },
                {
                    name: 'Individual Saving Account',
                    value: 2
                },
                {
                    name: 'Investment',
                    value: 3
                },
                {
                    name: 'Credit card',
                    value: 4
                },
                {
                    name: 'Other',
                    value: 10
                }
            ]

    var currencies = [
                {
                    name: 'EUR(€)',
                    code: 'EUR',
                    value: 'EUR'
                },{
                    name: 'USD($)',
                    code: 'USD',
                    value: 'USD'
                },{
                    name: 'GBP(£)',
                    code: 'GBP',
                    value: 'GBP'
                }
            ]


    function findAccountTypeByValue(value){
        var result
        angular.forEach(accountTypes, function(type){
            if(type.value == value){ // TODO value is a string
                result = type
            }
        })
        return result
    }

    function findCurrencyByValue(value){
        var result
        angular.forEach(currencys, function(currency){
            if(currency.value === value){ 
                result = currency
            }
        })
        return result
    }

    angular
        .module('controllers')
        .controller('AccountSettingsController', ['$scope', '$state', 'StorageServices', 'AccountResource', 'OperationResource', 'initService', AccountSettingsController])

        function AccountSettingsController($scope, $state, StorageServices, AccountResource, OperationResource, initService) {

            function getAccount(){    
                if(StorageServices.isOnline()){
                    AccountResource.get(accountId).$promise.then(function(account){
                        StorageServices.setAccount(accountId, account)
                        $scope.account = account
                        $scope.account.rebalance = account.balance
                    }, function(err){
                        getAccount()
                    })
                }
                else{
                    $scope.account = StorageServices.getAccount(accountId)
                }
            }

            $scope.addAlert = function(){
                /*
                console.log($scope.newalert)
                $scope.account.alerts.push($scope.newalert)
                $scope.newalert.level = 0
                $scope.newalert.message = ''
                */
            }

            $scope.deleteAccount = function(){
                if (confirm('Are you sure you want to delete this account')) {
                    AccountResource.remove(accountId).$promise.then(function() {
                    
                    })
                }
            }

            $scope.updateAccount = function(){
                AccountResource.update(account).$promise.then(function (account){
                    $scope.account = account
                    $scope.account.rebalance = account.balance
                }, function(err){
                    //DO SOMETHING OR NOT ?
                })
            }

            $scope.rebalanceAccount = function(){
                if( $scope.account.rebalance != $scope.account.balance){
                    var target = event.target
                    target.textContent = "loading ..."
                    target.disabled = true

                    var operation = {
                        "value": $scope.account.rebalance-$scope.account.balance,
                        "accountId":accountId,
                        "description": 
                        "Rebalance from " + 
                        $scope.account.balance + " " + $scope.account.currency 
                        + " to " + 
                        $scope.account.rebalance + " " + $scope.account.currency,
                    }

                    OperationResource.add(operation).$promise.then(function(operation){
                        target.textContent = "Save"
                        target.disabled = false
                        getAccount()
                    }, function(err){
                        //TODO ???
                    })

                }
            }

            var accountId = $state.params.accountId
            $scope.newalert= {"level": 0, "message": ''}
            $scope.accountTypes = accountTypes
            $scope.currencies = currencies
            getAccount()
        }
})();
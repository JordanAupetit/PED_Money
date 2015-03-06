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

    var currencys = [
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
        .controller('AccountController', ['$scope', 'AccountResource', 'initService', AccountController])
        .filter('accountType', function(){
            return function(input) {
                var result = findAccountTypeByValue(input)
                result = result !== undefined ? result.name :'Unknown';
                return result
            }
        })
        .filter('accountCurrency', function(){
            return function(input) {
                var result = findCurrencyByValue(input)
                result = result !== undefined ? result.name :'Unknown';
                return result
            }
        })

        function AccountController($scope, AccountResource, initService) {
            // initService.populateAccount()

            $scope.accountCreateModel = {};

            $scope.currencys = [
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

            $scope.accountTypes = [
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

            // $scope.accountCreateModel = {
            //     name: 'test',
            //     type: 1,
            //     currency: $scope.currencys[0]
            // }

           function refresh(){
                AccountResource.getAll().$promise.then(function(accounts) {
                    $scope.accounts = accounts
                })
            }

            function resetForm(){
                $scope.accountCreateModel = {}
                $scope.accountForm.$setPristine();
                $scope.accountForm.$setUntouched();
            }

            refresh()


            $scope.addAccount = function(accountCreateModel) {
                if($scope.accountForm.$valid){
                    accountCreateModel.currency = accountCreateModel.currency.code
                    console.log(accountCreateModel)
                    AccountResource.add(accountCreateModel, function(res){
                        console.log(res)
                        resetForm()
                        refresh()
                    })
                }
            }

            $scope.deleteAccount = function(idAccount) {
                AccountResource.remove(idAccount).$promise.then(function() {
                    refresh()
                })
            }

            $scope.updateAccount = function(account) {
                account.editable = false
                account.currency = account.currency.code
                AccountResource.update(account)
            }

            $scope.showUpdateAccount = function(account) {
                account.editable = true

                var curPos
                angular.forEach($scope.currencys, function(cur, pos){
                    if(cur.code == account.currency){
                        curPos = pos
                    }
                })
                account.currency = $scope.currencys[curPos]
            }
        }

})();
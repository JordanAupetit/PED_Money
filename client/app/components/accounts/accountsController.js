(function() {

    'use strict';




    angular
        .module('controllers')
        .controller('AccountController', ['$scope', 'AccountResource', 'initService', AccountController])
        

        function AccountController($scope, AccountResource, initService) {
            // initService.populateAccount()

            $scope.accountCreateModel = {};

            $scope.currencys = CURRENCYS


            $scope.accountTypes = ACCOUNT_TYPES

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
(function(){

'use strict';

    angular
        .module('appModule')
        .controller('AccountController', ['$scope', 'AccountResource', function($scope, AccountResource) {


            var acc1 = {
                name: "loisir",
                type: "type 1",
                balance:23456,
                currency: "EUR(€)"
            }

            var acc2 = {
                name: "course",
                type: "type 2",
                balance: 3543 ,
                currency: "USD($)"
            }


          

            AccountResource.add(acc1)
            AccountResource.add(acc2)


            $scope.accountCreateModel = {};

            var getAccounts = function() {
                AccountResource.getAll().$promise.then(function(accounts){
                    $scope.accounts = accounts

                    // $scope.solde = 0

                    // for(var i = 0; i < accounts.length; i++) {
                    //     $scope.solde += accounts[i].solde
                    // }
                })
            }

            getAccounts()


            $scope.addAccount = function() {
               AccountResource.add($scope.accountCreateModel)
                $scope.accountCreateModel = {}
                getAccounts()
            }

            $scope.deleteAccount = function(idAccount) {
                AccountResource.remove(idAccount).$promise.then(function(){
                    getAccounts()
                })
            }

             $scope.updateAccount = function(account) {
                account.editable = false
                AccountResource.update(account)
            }

            $scope.showUpdateAccount = function(account) {
                account.editable = true
            }


        }]);

})();

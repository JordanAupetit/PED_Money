(function(){

'use strict';

    angular
        .module('controllers')
        .controller('AccountController', ['$scope', 'AccountResource', 'initService', function($scope, AccountResource, initService) {


            // initService.populateAccount()

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

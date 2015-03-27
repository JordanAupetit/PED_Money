(function() {
    'use strict';

    angular
        .module('controllers')
        .controller('AccountController', ['$scope', '$rootScope', 'AccountResource', 'initService', 'StorageServices', AccountController])

    function AccountController($scope, $rootScope, AccountResource, initService, StorageServices) {
        $scope.currencys = CURRENCYS
        $scope.accountTypes = ACCOUNT_TYPES
        $scope.accountCreateModel = {};

        /**
         * Refresh the account view
         */
        $scope.refresh = function() {
            StorageServices.getAccounts(function(accounts){
                $scope.accounts = accounts
            })
        }

        /**
         * @Description
         * Reset the form
         * Close it and reset values to default
         */
        $scope.resetForm = function(){
            $scope.closeRightMenu()
            $scope.accountCreateModel = {}
            $scope.accountForm.$setPristine();
            $scope.accountForm.$setUntouched();
        }

        /**
         * @Description
         * Add the account from de given model
         * Add the account in bdd, reset the form and refresh the page
         * @Param {Object} accountCreateModel The model of the account to add
         */
        $scope.addAccount = function(accountModel) {
            if($scope.accountForm.$valid) {
                accountModel.currency = accountModel.currency.code
                //accountModel.type = accountModel.type.value
                accountModel.type = ACCOUNT_TYPES[0].value // ONLY Banking
                AccountResource.add(accountModel, function(res) {
                    $scope.resetForm()
                    $scope.refresh()

                    // Permet de rafraichir la liste de comptes dans la navbar
                    $rootScope.$emit('accountRefresh');
                })
            }
        }

        /**
         * @Description
         * Delete account
         * @Param {Object} accountId The id of the account to delete
         */
        $scope.deleteAccount = function(accountId) {
            AccountResource.remove(accountId).$promise.then(function() {
                $scope.refresh()
            })
        }


        $scope.refresh()

    }

})();
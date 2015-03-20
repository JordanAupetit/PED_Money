(function() {
    'use strict';

    angular
        .module('controllers')
        .controller('AccountController', ['$scope', '$rootScope', 'AccountResource', 'initService', 'StorageServices', AccountController])

    function AccountController($scope, $rootScope, AccountResource, initService, StorageServices) {
        $scope.currencys = CURRENCYS
        $scope.accountTypes = ACCOUNT_TYPES
        $scope.accountCreateModel = {};
        // $scope.accountCreateModel = {
        //     name: 'test',
        //     type: 1,
        //     currency: $scope.currencys[0]
        // }


        /**
         * Refresh the account view
         * TODO Add reset form ??
         */
        function refresh() {
            StorageServices.getAccounts(function(accounts){
                $scope.accounts = accounts
            })
        }

        refresh()

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
                accountModel.type = accountModel.type.value
                AccountResource.add(accountModel, function(res) {
                    $scope.resetForm()
                    refresh()

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
                refresh()
            })
        }

        /**
         * @Description
         * Switch account line to view mode and save it
         * @Param {Object} account The model of the account to save
         */
        $scope.updateAccount = function(account) {
            account.editable = false
            account.currency = account.currency.code
            account.type = account.type.value
            AccountResource.update(account)
        }


        /**
         * @Description
         * Switch account line to edit mode
         * @Param {Object} account The model of the account to edit
         */
        $scope.showUpdateAccount = function(account) {
            account.editable = true

            var curPos
            angular.forEach($scope.currencys, function(cur, pos) {
                if (cur.code === account.currency) {
                    curPos = pos
                }
            })
            account.currency = $scope.currencys[curPos]

            var typePos
            angular.forEach(ACCOUNT_TYPES, function(type, pos) {
                if (type.value === account.type) {
                    typePos = pos
                }
            })
            account.type = ACCOUNT_TYPES[typePos]
        }
    }

})();
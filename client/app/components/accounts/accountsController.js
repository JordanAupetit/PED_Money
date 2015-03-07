(function() {

    'use strict';



    angular
        .module('controllers')
        .controller('AccountController', ['$scope', 'AccountResource', 'initService', AccountController])


    function AccountController($scope, AccountResource, initService) {
        // initService.populateAccount()

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
            AccountResource.getAll().$promise.then(function(accounts) {
                $scope.accounts = accounts
            })
        }

        /**
         * @Description
         * Reset the form
         * Close it and reset values to default
         */
        function resetForm() {
            $scope.closeRightMenu()
            $scope.accountCreateModel = {}
            $scope.accountForm.$setPristine();
            $scope.accountForm.$setUntouched();

        }

        refresh()

        $scope.resetForm = resetForm

        /**
         * @Description
         * Add the account from de given model
         * Add the account in bdd, reset the form and refresh the page
         * @Param {Object} accountCreateModel The model of the account to add
         */
        $scope.addAccount = function(accountModel) {
            if ($scope.accountForm.$valid) {
                accountModel.currency = accountModel.currency.code
                accountModel.type = accountModel.type.value
                    // console.log(accountModel)
                AccountResource.add(accountModel, function(res) {
                    // console.log(res)
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
            account.type = account.type.value
            AccountResource.update(account)
        }

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
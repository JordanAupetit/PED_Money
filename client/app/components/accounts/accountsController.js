(function(){

'use strict';

    angular
        .module('appModule')
        .controller('AccountController', ['$scope', 'AccountResource', function($scope, AccountResource) {


            var acc1 = {
                name: "loisir",
                type: "type 1",
                solde:23456,
                currency: "EUR(€)"
            }

            var acc2 = {
                name: "course",
                type: "type 2",
                solde: 3543 ,
                currency: "USD($)"


            }
            var acc3 = {
                name: "course",
                type: "type 2",
                solde: 343 ,
                currency: "USD($)"


            }

            AccountResource.add(acc1)
            AccountResource.add(acc2)
            AccountResource.add(acc3)



            $scope.accountCreateModel = {};

            var getAccounts = function() {
                AccountResource.getAll().$promise.then(function(accounts){
                    $scope.accounts = accounts

                    $scope.solde = 0

                    for(var i = 0; i < accounts.length; i++) {
                        $scope.solde += accounts[i].solde
                    }
                })
            }

            getAccounts()
            
            /*  
                ==== TODO ====
                - Gérer les erreurs / champs vides dans le formulaire d'ajout d'operations

            */


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


        }]);

})();

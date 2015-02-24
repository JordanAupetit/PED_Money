
(function() {
    'use strict';

    angular
        .module('controllers')
        .controller('OperationController', ['$scope', 'OperationResource', 'CategoryResource', 'initService', '$state', OperationController])


        function OperationController($scope, OperationResource, CategoryResource, initService, $state) {

            var accountId = $state.params.accountId
            // console.log($state.params.accountId)
            // initService.populateOperation(accountId)
            // initService.populateOperation('other')
            


            $scope.editable = false
            $scope.operationCreateModel = {}


            var getOperations = function() {
                OperationResource.getAll(accountId).$promise.then(function(operations){
                    $scope.operations = operations

                    updateSolde()
                })
            }

            var updateSolde = function() {
                $scope.solde = 0

                for(var i = 0; i < $scope.operations.length; i++) {
                    // 2 decimal au maximum
                    $scope.solde += parseFloat($scope.operations[i].value)
                }

                $scope.solde = $scope.solde.toFixed(2)
            }

            var getCategories = function() {
                CategoryResource.getAll('54e4d019e6d52f98153df4c9').$promise.then(function(categories){
                    $scope.categories = []
                    for(var i in categories){
                        $scope.categories.push(categories[i])
                        for(var j in categories[i].subCategories){
                            $scope.categories.push({name: "-    -- "+categories[i].subCategories[j]})
                        }
                    }

                    //$scope.categories = categories
                })
            }

            getOperations()

            // getCategories()            

            

            

            /*  
                ==== TODO ====
                - Gérer les erreurs / champs vides dans le formulaire d'ajout d'operations

            */


            $scope.addOperation = function() {
                OperationResource.add($scope.operationCreateModel)
                $scope.operationCreateModel = {}
                getOperations()
            }

            $scope.deleteOperation = function(idOperation) {
                OperationResource.remove(idOperation).$promise.then(function(){
                    getOperations()
                })
            }

            $scope.validateOperation = function(operation) {
                OperationResource.update(operation)
            }

            $scope.updateOperation = function(operation) {
                operation.editable = false
                OperationResource.update(operation)
                updateSolde()
            }

            $scope.showUpdateOperation = function(operation) {
                operation.editable = true
            }

        }

})();

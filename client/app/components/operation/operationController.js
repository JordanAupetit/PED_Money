
(function() {
    'use strict';

    angular
        .module('controllers')
        .controller('OperationController', ['$scope', 'OperationResource', function($scope, OperationResource) {

            var op1 = {
                value: -50,
                thirdParty: "Auchan",
                description: "Règlement des courses",
                type: "Chèque",
                checked: false,
                dateOperation: "20/01/2015",
                datePrelevement: "25/01/2015",
                categoryId: "54684654dqs",
                subOperations: []
            }

            var op2 = {
                value: 100,
                thirdParty: "Maman",
                description: "Argent de poche",
                type: "Virement",
                checked: true,
                dateOperation: "01/01/2015",
                datePrelevement: "12/01/2015",
                categoryId: "eza5484654dqs",
                subOperations: []
            }


            OperationResource.add(op1)
            OperationResource.add(op2)


            $scope.editable = false
            $scope.operationCreateModel = {}

            var getOperations = function() {
                OperationResource.getAll().$promise.then(function(operations){
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

            getOperations()

            
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

        }]);

})();

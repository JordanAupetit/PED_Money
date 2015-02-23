
(function() {
    'use strict';

    angular
        .module('controllers')
        .controller('OperationController', ['$scope', 'OperationResource', 'CategoryResource', function($scope, OperationResource, CategoryResource) {

            var op1 = {
                value: -50,
                thirdParty: "Auchan",
                description: "Règlement des courses",
                type: "Chèque",
                checked: false,
                // dateOperation: "20/01/2015",
                // datePrelevement: "25/01/2015",
                dateOperation: new Date(2015, 0, 20),
                datePrelevement: new Date(2015, 0, 25),
                categoryId: "54684654dqs",
                subOperations: []
            }

            var op2 = {
                value: 100,
                thirdParty: "Maman",
                description: "Argent de poche",
                type: "Virement",
                checked: true,
                // dateOperation: "01/01/2015",
                // datePrelevement: "12/01/2015",
                dateOperation: new Date(2015, 0, 1),
                datePrelevement: new Date(2015, 0, 12),
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
                - Peut etre virer les GetOperations() qui ralentissent la page
            */


            $scope.addOperation = function() {
                OperationResource.add($scope.operationCreateModel)
                $scope.operationCreateModel = {}
                getOperations()
            }

            $scope.deleteOperation = function(idOperation, index) {
                OperationResource.remove(idOperation).$promise.then(function(){
                    //getOperations()
                    $scope.operations.splice(index, 1)
                    updateSolde();
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

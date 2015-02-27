
(function() {
    'use strict';

    angular
        .module('controllers')
        .controller('OperationController', ['$scope', '$rootScope', 'OperationResource', 'CategoryResource', 'initService', '$state', OperationController])


        function OperationController($scope, $rootScope, OperationResource, CategoryResource, initService, $state) {

            var accountId = $state.params.accountId
            $scope.categories = []


            // initService.populateOperation(accountId)
            // initService.populateOperation('other')
            
            var resetOperationCreate = function () {
                $scope.operationCreateModel = {}
                $scope.operationCreateModel.advanced = false
            }


            $scope.editable = false
            resetOperationCreate()


            var getOperations = function() {
                OperationResource.getAll(accountId).$promise.then(function(operations){
                    for(var i = 0; i < operations.length; i++) {
                        if(operations[i].categoryId !== "") {

                            operations[i].categoryName = "No category"

                            console.log("chtulu")

                            for(var j = 0; j < $scope.categories.length; j++) {
                                console.log("FUCK")
                                console.log($scope.categories[j].id)
                                console.log(operations[i].categoryId)
                                if($scope.categories[j].id === operations[i].categoryId) {
                                    operations[i].categoryName = $scope.categories[j].name
                                }
                            }
                        }
                    }

                    console.log("HERE")
                    console.log(operations)
                    console.log($scope.categories)
                    
                    $scope.operations = operations

                    updateSolde()
                })
            }

            var updateSolde = function() {
                $scope.solde = 0

                for(var i = 0; i < $scope.operations.length; i++) {
                    // 2 decimal au maximum
                    if($scope.operations[i].value !== "" && $scope.operations[i].value !== undefined) {
                        $scope.solde += parseFloat($scope.operations[i].value)
                    }
                }

                $scope.solde = $scope.solde.toFixed(2)
            }

            $scope.getCategoriesOperation = function() {
                var idUser = $rootScope.currentUserSignedInId
                
                if(idUser !== "" && idUser !== undefined) {
                    CategoryResource.getAll(idUser).$promise.then(function(categories){
                        $scope.categories = []
                        for(var i = 0; i < categories.length; i++) {
                            if(categories[i] !== null) {
                                $scope.categories.push(categories[i])
                            }
                        }
                        console.log($scope.categories)
                    })
                }
            }

            $scope.getCategoriesOperation()
            getOperations()
            

            

            /*  
                ==== TODO ====
                - Gérer les erreurs / champs vides dans le formulaire d'ajout d'operations
            */


            $scope.addOperation = function() {
                if(accountId !== "") {
                    $scope.operationCreateModel.accountId = accountId
                }

                console.log($scope.operationCreateModel)

                if($scope.operationCreateModel.hasOwnProperty("category")) {
                    $scope.operationCreateModel.categoryId = $scope.operationCreateModel.category.id
                }

                // TODO: Add a promise HERE
                OperationResource.add($scope.operationCreateModel)
                resetOperationCreate()
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

            $scope.createOperationAdvanced = function() {
                $scope.operationCreateModel.advanced = true
            }

        }

})();

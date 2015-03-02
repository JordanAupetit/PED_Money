
(function() {
    'use strict';

    angular
        .module('controllers')
        .controller('OperationController', ['$scope', '$rootScope', 'OperationResource', 'CategoryResource', 'initService', '$state', OperationController])


        function OperationController($scope, $rootScope, OperationResource, CategoryResource, initService, $state) {

            $scope.resetOperationCreate = function () {
                $scope.operationCreateModel = {}
                $scope.operationCreateModel.advanced = false
            }

            var accountId = $state.params.accountId
            $scope.categories = []
            $scope.editable = false
            $scope.resetOperationCreate()
            $scope.operations = []


            $scope.getOperations = function() {
                OperationResource.getAll(accountId).$promise.then(function(operations){
                    console.log(operations)
                    for(var i = 0; i < operations.length; i++) {

                        operations[i].categoryName = "No category"

                        if(operations[i].categoryId !== "") {

                            for(var j = 0; j < $scope.categories.length; j++) {
                                if($scope.categories[j].id === operations[i].categoryId) {
                                    operations[i].categoryName = $scope.categories[j].name
                                    operations[i].category = $scope.categories[j]
                                }
                            }
                        }
                    }

                    $scope.operations = operations

                    $scope.updateSolde()
                })
            }

            $scope.updateSolde = function() {
                $scope.solde = 0

                for(var i = 0; i < $scope.operations.length; i++) {
                    if($scope.operations[i].value !== "" && $scope.operations[i].value !== undefined) {
                        $scope.solde += parseFloat($scope.operations[i].value)
                    }
                }

                // 2 decimal au maximum
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
                    })
                }
            }

            $scope.getCategoriesOperation()
            $scope.getOperations()
            

            

            /*  
                ==== TODO ====
                - Gérer les erreurs / champs vides dans le formulaire d'ajout d'operations
                - Lorsque l'on raffraichis la page (F5), le rootScope est vidé, et on ne
                possède plus l'User ID, et donc plus de requêtes qui ont besoin de cet ID
            */


            $scope.addOperation = function() {
                if(accountId !== "") {
                    $scope.operationCreateModel.accountId = accountId
                }

                console.log($scope.operationCreateModel)

                if($scope.operationCreateModel.hasOwnProperty("category") && $scope.operationCreateModel.category !== undefined) {
                    $scope.operationCreateModel.categoryId = $scope.operationCreateModel.category.id
                }

                // TODO: Verifier le bon format de la date
                if( !$scope.operationCreateModel.hasOwnProperty("dateOperation") 
                    || $scope.operationCreateModel.dateOperation === ""
                    || !moment($scope.operationCreateModel.dateOperation).isValid) {

                    $scope.operationCreateModel.dateOperation = moment().format('DD/MM/YYYY')
                }

                if( !$scope.operationCreateModel.hasOwnProperty("datePrelevement") 
                    || $scope.operationCreateModel.datePrelevement === ""
                    || !moment($scope.operationCreateModel.datePrelevement).isValid) {

                    $scope.operationCreateModel.datePrelevement = $scope.operationCreateModel.dateOperation
                }

                if( $scope.operationCreateModel.hasOwnProperty("periodic")
                    && $scope.operationCreateModel.periodic) {

                    // TODO: Add operation periodic

                } else { // Add normal operation

                    // TODO: Add a promise HERE
                    OperationResource.add($scope.operationCreateModel)
                }

                $scope.resetOperationCreate()
                $scope.getOperations()
            }

            $scope.deleteOperation = function(idOperation, index) {
                OperationResource.remove(idOperation).$promise.then(function(){
                    //$scope.getOperations()
                    $scope.operations.splice(index, 1)
                    $scope.updateSolde();
                })
            }

            $scope.validateOperation = function(operation) {
                OperationResource.update(operation)
            }

            $scope.updateOperation = function(operation) {
                operation.editable = false

                if(operation.hasOwnProperty("category") && operation.category !== undefined) {
                    operation.categoryId = operation.category.id

                } else { // Plus de catégories
                    operation.categoryId = ""
                    operation.categoryName = "No category"
                }

                console.log(operation)

                OperationResource.update(operation).$promise.then(function(){
                    // Permet principalement la Mise à jour du nom de la catégorie
                    $scope.getOperations()
                })
            }

            $scope.showUpdateOperation = function(operation) {
                operation.editable = true
            }

            $scope.createOperationAdvanced = function() {
                $scope.operationCreateModel.advanced = true
            }

        }

})();


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
            $scope.groupOfOperations = []
            $scope.operationsOfGroup = []

            function saveOperationsOffline(accountId, operations){
                localStorage.setItem("operations-"+accountId, JSON.stringify(operations))
            }

            // TODO: Il ne faut pas afficher qu'il n'y a pas d'opérations avant d'avoir fait le premier getOperations


            /*$scope.getOperations = function() {
                OperationResource.getAll(accountId).$promise.then(function(operations){
                    for(var i = 0; i < operations.length; i++) {

                        operations[i].categoryName = "No category"

                        if(operations[i].categoryId !== "") {*/


            function postOperation(accountId, operation){
                // TODO: Add a promise HERE
                if(Offline.state == "up"){
                    //console.log($scope.operationCreateModel)
                    //OperationResource.add($scope.operationCreateModel)

                    OperationResource.add($scope.operationCreateModel).$promise.then(function(){
                        $scope.getOperations()
                    })
                }
                else{
                    var wfc = eval("("+localStorage.getItem("waitingforconnection")+")")        
                    wfc.operations.POSTs.push(operation)
                    localStorage.setItem("waitingforconnection", JSON.stringify(wfc))
                }
            }

            $scope.getOperations = function() {
                if(Offline.state == "up"){
                    OperationResource.getAll(accountId).$promise.then(function(operations){

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
                        saveOperationsOffline(accountId, operations)       
                        $scope.updateSolde()
                    })
                }
                else{
                    $scope.operations = eval("("+localStorage.getItem("operations-"+accountId)+")")
                }
            }

            $scope.getOperations()

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

                        // On réactualise les opérations dans le cas où des
                        // catégories auraient été supprimées
                        $scope.getOperations()
                    })
                }
            }

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

                    postOperation(accountId, $scope.operationCreateModel)
                }

                $scope.resetOperationCreate()
            }

            $scope.deleteOperation = function(idOperation, index) {
                OperationResource.remove(idOperation).$promise.then(function(){
                    //$scope.getOperations()

                    // On clique sur le delete d'une operation d'un group
                    if($scope.operationsOfGroup.length > 0) {
                        $scope.operationsOfGroup.splice(index, 1)
                        $scope.updateGroups();
                    } else {
                        $scope.operations.splice(index, 1)
                        $scope.updateSolde();
                    }
                    
                })
            }

            $scope.validateOperation = function(operation) {
                OperationResource.update(operation)
            }

            // TODO: Update non fonctionnel au CREMI, à vérifier

            $scope.updateOperation = function(operation) {
                operation.editable = false

                if(operation.hasOwnProperty("category") && operation.category !== undefined) {
                    operation.categoryId = operation.category.id

                } else { // Plus de catégories
                    operation.categoryId = ""
                    operation.categoryName = "No category"
                }

                /*if(operation.value == "" || operation.value == null) {
                    operation.value = 0
                }*/

                OperationResource.update(operation).$promise.then(function(){
                    // Permet principalement la Mise à jour du nom de la catégorie
                    $scope.getOperations()
                })
            }

            $scope.showUpdateOperation = function(operation) {
                operation.editable = true
            }

            $scope.showOperationAdvanced = function() {
                $scope.operationCreateModel.advanced = true
            }

            $scope.hideOperationAdvanced = function() {
                $scope.operationCreateModel.advanced = false
            }

            $scope.groupOperation = function() {

                $scope.groupOfOperations = []
                $scope.operationsOfGroup = []

                if($scope.groupedBy !== "") {

                    for(var i = 0; i < $scope.operations.length; i++) {
                        var found = false
                        var operationGroupedByField = ""

                        // TODO: Voir si on groupe aussi par date différée
                        if($scope.groupedBy === "date") { 
                            operationGroupedByField = $scope.operations[i].dateOperation
                        } else if($scope.groupedBy === "category") {
                            operationGroupedByField = $scope.operations[i].categoryName
                        } else if($scope.groupedBy === "type") {
                            operationGroupedByField = $scope.operations[i].type
                        } else if($scope.groupedBy === "thirdParty") {
                            operationGroupedByField = $scope.operations[i].thirdParty
                        } else {
                            // Il doit y avoir une erreur dans le "select"
                            break
                        }

                        if(operationGroupedByField === "" || operationGroupedByField === undefined) {
                            operationGroupedByField = "Empty field"
                        }

                        for(var j = 0; j < $scope.groupOfOperations.length; j++) {
                            if(operationGroupedByField === $scope.groupOfOperations[j].groupedByField) {
                                $scope.groupOfOperations[j].value += $scope.operations[i].value
                                $scope.groupOfOperations[j].subOperations.push($scope.operations[i])
                                found = true
                                break
                            }
                        }

                        if(!found) {
                            $scope.groupOfOperations.push({
                                groupedBy: $scope.groupedBy,
                                groupedByField: operationGroupedByField,
                                value: $scope.operations[i].value,
                                subOperations: [$scope.operations[i]]
                            })
                        }
                    }

                } else {
                    $scope.getOperations()
                }
            }

            // TODO: Dans le cas de la suppression d'une operation d'un groupe 
            // ne contenant qu'une operation il faudra supprimer le groupe

            $scope.updateGroups = function() {
                for(var i = 0; i < $scope.groupOfOperations.length; i++) {
                    $scope.groupOfOperations[i].value = 0

                    for(var j = 0; j < $scope.groupOfOperations[i].subOperations.length; j++) {
                        $scope.groupOfOperations[i].value += $scope.groupOfOperations[i].subOperations[j].value
                    }
                }
            }

            $scope.showOperationsOfGroup = function(index) {

                for(var i = 0; i < $scope.groupOfOperations.length; i++) {
                    $scope.groupOfOperations[i].showOps = false
                }

                $scope.groupOfOperations[index].showOps = true
                $scope.operationsOfGroup = $scope.groupOfOperations[index].subOperations
            }
        }

})();

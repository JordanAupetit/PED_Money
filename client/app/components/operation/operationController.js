
(function() {
    'use strict';

    angular
        .module('controllers')
        .controller('OperationController', ['$scope', '$rootScope', 'OperationResource', 'AccountResource', 'CategoryResource', 'initService', '$state', OperationController])

        function OperationController($scope, $rootScope, OperationResource, AccountResource, CategoryResource, initService, $state) {
            $scope.resetOperationCreate = function () {
                $scope.operationCreateModel = {}
                $scope.operationCreateModel.advanced = false
            }

            var accountId = $state.params.accountId
            $scope.categories = []
            $scope.editable = false
            $scope.resetOperationCreate()
            $scope.operations = []

            function saveOperationsOffline(accountId, operations){
                localStorage.setItem("operations-"+accountId, JSON.stringify(operations))
            }

            function postOperation(accountId, operation){
                // TODO: Add a promise HERE
                if(Offline.state == "up"){
                    //console.log($scope.operationCreateModel)
                    OperationResource.add($scope.operationCreateModel)
                }
                else{
                    var wfc = eval("("+localStorage.getItem("waitingforconnection")+")")        
                    wfc.operations.POSTs.push(operation)
                    localStorage.setItem("waitingforconnection", JSON.stringify(wfc))
                }
                getAccount()
            }

            function getAccount(){
                AccountResource.get($state.params.accountId).$promise.then(function(account){
                    $scope.account = account
                })
            }
            getAccount()

            function getOperations() {
                if(Offline.state == "up"){
                    OperationResource.getAll(accountId).$promise.then(function(operations){
                        for(var i = 0; i < operations.length; i++) {
                            if(operations[i].categoryId !== "") {
                                operations[i].categoryName = "No category"
                                for(var j = 0; j < $scope.categories.length; j++) {
                                    if($scope.categories[j].id === operations[i].categoryId) {
                                        operations[i].categoryName = $scope.categories[j].name
                                    }
                                }
                            }
                        }
                        $scope.operations = operations
                        saveOperationsOffline(accountId, operations)       
                    })
                }
                else{
                    $scope.operations = eval("("+localStorage.getItem("operations-"+accountId)+")")
                }
            }

            getOperations()

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
                getAccount()
                getOperations()
            }

            $scope.deleteOperation = function(idOperation, index) {
                OperationResource.remove(idOperation).$promise.then(function(){
                    //$scope.getOperations()
                    $scope.operations.splice(index, 1)
                    $scope.updateSolde();
                    getAccount()
                    getOperations()
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

                OperationResource.update(operation).$promise.then(function(){
                    // Permet principalement la Mise à jour du nom de la catégorie
                    getOperations()
                    getAccount()
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

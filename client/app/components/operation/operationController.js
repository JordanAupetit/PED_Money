
(function() {
    'use strict';

    angular
        .module('controllers')
        .controller('OperationController', ['$scope', '$rootScope', 'StorageServices', 'OperationResource', 'AccountResource', 'CategoryResource', 'periodRessource', 'initService', '$state', OperationController])

        function OperationController($scope, $rootScope, StorageServices, OperationResource, AccountResource, CategoryResource, periodRes, initService, $state) {

            /**
             * @Description
             * Reset few variables for add an operation
             */
            $scope.resetOperationCreate = function () {
                $scope.operationCreateModel = {
                    period: {
                        intervalType: INTERVAL_TYPES[2]
                    }
                }
                $scope.operationCreateModel.advanced = false

                if($scope.addOperationForm !== undefined){
                    $scope.addOperationForm.$setPristine();
                }
            }  

            $scope.intervalType = INTERVAL_TYPES
            var accountId = $state.params.accountId
            $scope.accountId = accountId
            $scope.categories = []
            $scope.editable = false
            $scope.resetOperationCreate()
            $scope.groupOfOperations = []
            $scope.operationsOfGroup = []
            $scope.orderProp = "dateOperation"
            $scope.showDeferredOps = true
            $scope.csvFileImported = ""
            $scope.ventilateOperation = null
            $scope.subOperationModel = {}
            var dateFormat = 'YYYY-MM-DD'


            // $scope.operationCreateModel = {
            //     period: {
            //         intervalType: INTERVAL_TYPES[2],
            //         step : 2,
            //         occurency: 3
            //     },
            //     accountId: '54ec74a2b5edf01c2c3a3552',
            //     advanced: true,
            //     dateOperation: '2015/03/05',
            //     datePrelevement: '2015/03/05',
            //     description: 'ceci est un test',
            //     periodic: true,
            //     thirdParty: 'Steam',
            //     type: 'CB',
            //     value: 45
            // }
                

            /**
             * @Description
             * Choose between an online or an offline post of an operation
             * @Param {Object} operationToSend An object operation to send
             */    
            function postOperation(operationToSend){
                StorageServices.postOperation(operationToSend, refresh)
                /*
                if(StorageServices.isOnline()){
                    OperationResource.add(operationToSend).$promise.then(function(operation){
                        refresh()
                    }, function(err){
                        postOperation(operation)
                    })
                }   
                else{
                    StorageServices.postOperation(accountId, operation)
                }
                */               
            }

            /**
             * @Description
             * Clone an object
             * @Param {Object} operations An object to clone
             */  
            function clone(obj) {
                var target = {};
                for (var i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        target[i] = obj[i];
                    }
                }
                return target;
            }

            /**
             * @Description
             * Update the balance and the deferred balance with the operations
             */  
            $scope.updateSolde = function() {
                $scope.balance = 0
                $scope.deferredBalance = 0

                for(var i = 0; i < $scope.account.operations.length; i++) {
                    var operation = $scope.account.operations[i]
                    if(operation.value !== '' && operation.value !== undefined) {

                        if(!operation.datePrelevementIsAfterToday) {
                            $scope.balance += parseFloat(operation.value)
                        }

                        $scope.deferredBalance += parseFloat(operation.value)
                    }
                }

                // 2 decimal au maximum
                $scope.balance = $scope.balance.toFixed(2)
                $scope.deferredBalance = $scope.deferredBalance.toFixed(2)
            }
            

             /**
             * @Description
             * Get categories, save in scope 
             * and then format them to the select
             * Finaly launch fixOperations to bind category
             */  
            function genCategories() {
                var categories = StorageServices.getUser().categories
                $scope.categories = []
                angular.forEach(categories, function(categorie){
                    $scope.categories.push(categorie)
                })


                $scope.categoriesSelect = []
                angular.forEach(categories, function(categorie){
                    $scope.categoriesSelect.push({
                        id: categorie.id,
                        name: categorie.name
                    })
                    angular.forEach(categorie.subCategories, function(subCategorie){
                        $scope.categoriesSelect.push({
                            id: subCategorie.id,
                            name: '---- '+subCategorie.name
                        })
                    })
                })

                // console.log($scope.categories)
                // console.log($scope.categoriesSelect)
                //fixOperations()
            }

            function getAccount(account){
                $scope.account = account
                $rootScope.account = account
                $rootScope.$emit('accountSelected');

                if(!account.operations){
                    account.operations = []
                }

                genCategories()

                // Le fix doit se faire avant l'update
                // if(account.operations){
                //     console.log("if")
                    fixOperations()
                    $scope.updateSolde()
                // }

                generateCsv()

                // Dans le cas où l'on ajoute une operation lors d'un regroupement
                // Il ne faut pas le faire si on est sans groupe sinon cela fait
                // une boucle infinie
                if($scope.groupedBy !== '') {
                    $scope.groupOperation();
                }
            }

            /**
             * @Description
             * Refresh account page
             */ 
            function refresh() {
                StorageServices.getAccount(accountId, getAccount)
            }

            /**
             * @Description
             * Correct few variables of operations
             */
            function fixOperations() {
                $scope.countOfOperationsAfterToday = 0;
                $scope.countOfOperationsNotAfterToday = 0;

                
                for(var i = 0; i < $scope.account.operations.length; i++) {
                    var operation = $scope.account.operations[i]
                    operation.categoryName = 'No category'

                    var catToFind = operation.categoryId

                    if(catToFind !== '') {
                        angular.forEach($scope.categories, function(categorie){
                            if(categorie.id === catToFind) {
                                operation.categoryName = categorie.name
                                operation.category = categorie
                            }else if(catToFind % categorie.id < 100) {
                                angular.forEach(categorie.subCategories, function(subCategorie) {
                                    if(subCategorie.id === catToFind) {
                                        operation.categoryName = subCategorie.name
                                        operation.category = categorie
                                    }
                                })
                            }
                        })
                    }

                    operation.dateOperationIsAfterToday = false
                    if(moment(operation.dateOperation, dateFormat).isAfter(moment())) {
                        operation.dateOperationIsAfterToday = true
                    }

                    operation.datePrelevementIsAfterToday = false
                    if(moment(operation.datePrelevement, dateFormat).isAfter(moment())) {
                        operation.datePrelevementIsAfterToday = true
                    }

                    if(operation.dateOperationIsAfterToday || operation.datePrelevementIsAfterToday) {
                        $scope.countOfOperationsAfterToday++
                    } else {
                        $scope.countOfOperationsNotAfterToday++
                    }
                }
            }

            /*  
                ==== TODO ====
                - Lorsque l'on raffraichis la page (F5), le rootScope est vidé, et on ne
                possède plus l'User ID, et donc plus de requêtes qui ont besoin de cet ID
                On verra quand la gestion du compte sera terminée
            */

            /**
             * @Description
             * Do few verifications before to call the previous postOperation
             */
            $scope.addOperation = function() {

                var newOperation = $scope.operationCreateModel
                if(accountId !== '') {
                    newOperation.accountId = accountId
                }

                if(newOperation.hasOwnProperty('category') && newOperation.category !== undefined) {
                    newOperation.categoryId = newOperation.category.id
                }

                if(!newOperation.advanced){ // Simple operation
                    var toSend = {
                            accountId: newOperation.accountId,
                            value: newOperation.value,
                            categoryId: newOperation.categoryId,
                            dateOperation: moment().format('YYYY-MM-DD'),
                            datePrelevement: moment().format('YYYY-MM-DD')
                        }

                    postOperation(toSend) 
                } else { // Advanced or periodic operation

                    newOperation = OperationResource.correctDateOfOperation(newOperation)

                    if (newOperation.hasOwnProperty('periodic') 
                        && newOperation.periodic) { // Periodic operation

                        // Clean dateBegin
                        if (!newOperation.period.hasOwnProperty('dateBegin') 
                            || newOperation.period.dateBegin === '' 
                            || !moment(newOperation.period.dateBegin, dateFormat).isValid) {

                            newOperation.period.dateBegin = newOperation.dateOperation
                        } else {
                            newOperation.period.dateBegin = moment(newOperation.period.dateBegin, dateFormat).format('YYYY-MM-DD')
                        }

                        // var newOpt = clone($scope.operationCreateModel)
                        var newOpt = newOperation

                        if (newOpt.period.isInfinite) {
                            newOpt.period.nbRepeat = -1
                        }

                        var toSend = {
                            name: newOpt.description,
                            dateBegin: newOpt.period.dateBegin,
                            nbRepeat: newOpt.period.occurency,
                            step: newOpt.period.step,
                            intervalType: newOpt.period.intervalType.code,
                            operation: {
                                value: newOpt.value,
                                thirdParty: newOpt.thirdParty,
                                description: newOpt.description,
                                typeOpt: newOpt.type,
                                // checked: false,
                                dateOperation: newOpt.dateOperation,
                                datePrelevement: newOpt.datePrelevement,
                                categoryId: newOpt.categoryId,
                                accountId: newOpt.accountId
                            }
                        }

                        console.log(toSend)

                        periodRes.add(toSend).$promise.then(function() {
                            // refresh()
                            // TODO popup for confirmation
                        })

                    } else { // Advanced operation
                        var toSend = newOperation
                        delete toSend.period
                        delete toSend.periodic
                        delete toSend.advanced

                        console.log(toSend)
                        postOperation(toSend) 
                    }
                }

                $scope.resetOperationCreate()
            }

            /**
             * @Description
             * Delete an operation
             * @Param {number} idOperation An id of an operation
             * @Param {number} index An index of the operation in the list
             */
            $scope.deleteOperation = function(operation, index) {
                StorageServices.deleteOperation(operation, function(){
                    //refresh()

                    console.log(index)

                    // On clique sur le delete d'une operation d'un groupe
                    if($scope.operationsOfGroup.length > 0) {
                        $scope.operationsOfGroup.splice(index, 1)
                        $scope.updateGroups();
                    }

                    for(var i = 0; i < $scope.account.operations.length; i++) {
                        if($scope.account.operations[i]._id === operation._id) {
                            $scope.account.operations.splice(i, 1)
                            break
                        }
                    }
                    
                    $scope.updateSolde()
                    fixOperations()
                    generateCsv()
                    //getAccountAndGenerateCsv()
                    //refresh()
                })
            }

            /**
             * @Description
             * Update an operation
             * @Param {Object} operation Operation to update
             */
            $scope.validateOperation = function(operation) {
                StorageServices.updateOperation(operation)
            }

            /**
             * @Description
             * Update an operation
             * @Param {Object} operation Operation to update
             */
            $scope.updateOperation = function(operation) {
                operation.editable = false

                operation = OperationResource.correctDateOfOperation(operation)

                /*if(operation.hasOwnProperty('category') && operation.category !== undefined) {
                    operation.categoryId = operation.category.id

                } else { // Plus de catégories
                    operation.categoryId = ''
                    operation.categoryName = 'No category'
                }*/

                StorageServices.updateOperation(operation, refresh())
            }

            /**
             * @Description
             * Close an editable operation
             * @Param {Object} operation Operation editable to close
             */
            $scope.closeUpdateOperation = function(operation) {
                operation.editable = false
                refresh()
            }

            /**
             * @Description
             * Show an editable operation
             * @Param {Object} operation Operation editable to show
             */
            $scope.showUpdateOperation = function(operation) {
                //TODO Gérer le select pour les catégories
                operation.editable = true
            }

            /**
             * @Description
             * Show the page to modifify the ventilation of an operation
             * @Param {Object} operation Operation to ventilate
             */
            $scope.showVentilation = function(operation) {
                $scope.ventilateOperation = clone(operation)
                $scope.balanceToAssign = $scope.ventilateOperation.value

                if(!$scope.ventilateOperation.hasOwnProperty('subOperations')) {
                    $scope.ventilateOperation.subOperations = []
                } else {
                    for(var i = 0; i < $scope.ventilateOperation.subOperations.length; i++) {
                        $scope.balanceToAssign -= $scope.ventilateOperation.subOperations[i].value
                    }
                }
            }

            /**
             * @Description
             * Hide ventilation of an operation
             */
            $scope.hideVentilation = function() {
                $scope.ventilateOperation = null
                refresh()
            }

            /**
             * @Description
             * Add a subOperation in local variable
             */
            $scope.addSubOperation = function() {
                $scope.ventilateOperation.subOperations.push({
                    description: $scope.subOperationModel.description,
                    value: $scope.subOperationModel.value
                })

                $scope.balanceToAssign -= $scope.subOperationModel.value

                $scope.subOperationModel = {}
            }

            /**
             * @Description
             * Delete a suboperation in local variable
             * @Param {Object} operation Operation to delete
             * @Param {number} index Index of the operation in the list
             */
            $scope.deleteSubOperation = function(operation, index) {
                $scope.balanceToAssign += operation.value
                $scope.ventilateOperation.subOperations.splice(index, 1)
            }

            /**
             * @Description
             * Save the ventilation in BDD
             */
            $scope.saveVentilation = function() {
                if($scope.balanceToAssign === 0) {
                    OperationResource.update($scope.ventilateOperation)
                }
            }

            /**
             * @Description
             * Show advanced fields to add operation
             */
            $scope.showOperationAdvanced = function() {
                $scope.operationCreateModel.advanced = true
            }

            /**
             * @Description
             * Hide advanced fields to add operation
             */
            $scope.hideOperationAdvanced = function() {
                $scope.operationCreateModel.advanced = false
            }

            /**
             * @Description
             * Group operations by a "select"
             */
            $scope.groupOperation = function() {

                $scope.groupOfOperations = []
                $scope.operationsOfGroup = []

                if($scope.groupedBy !== '') {

                    for(var i = 0; i < $scope.account.operations.length; i++) {
                        var operation = $scope.account.operations[i]
                        var found = false
                        var operationGroupedByField = ''

                        // TODO: Voir si on groupe aussi par date différée
                        if($scope.groupedBy === 'date') { 
                            operationGroupedByField = operation.dateOperation
                        } else if($scope.groupedBy === 'category') {
                            operationGroupedByField = operation.categoryName
                        } else if($scope.groupedBy === 'type') {
                            operationGroupedByField = operation.type
                        } else if($scope.groupedBy === 'thirdParty') {
                            operationGroupedByField = operation.thirdParty
                        } else {
                            // Il doit y avoir une erreur dans le 'select'
                            break
                        }

                        if(operationGroupedByField === '' || operationGroupedByField === undefined) {
                            operationGroupedByField = 'Empty field'
                        }

                        for(var j = 0; j < $scope.groupOfOperations.length; j++) {
                            if(operationGroupedByField === $scope.groupOfOperations[j].groupedByField) {
                                $scope.groupOfOperations[j].value += operation.value
                                $scope.groupOfOperations[j].subOperations.push(operation)
                                found = true
                                break
                            }
                        }

                        if(!found) {
                            $scope.groupOfOperations.push({
                                groupedBy: $scope.groupedBy,
                                groupedByField: operationGroupedByField,
                                value: operation.value,
                                subOperations: [operation]
                            })
                        }
                    }

                } else {
                    refresh()
                }
            }

            // TODO: Dans le cas de la suppression d'une operation d'un groupe 
            // ne contenant qu'une operation il faudra supprimer le groupe
            // OU peut etre pas, comme ça on voit bien le groupe vide

            /**
             * @Description
             * Update the value of groups of operation
             */
            $scope.updateGroups = function() {
                for(var i = 0; i < $scope.groupOfOperations.length; i++) {
                    $scope.groupOfOperations[i].value = 0

                    for(var j = 0; j < $scope.groupOfOperations[i].subOperations.length; j++) {
                        $scope.groupOfOperations[i].value += $scope.groupOfOperations[i].subOperations[j].value
                    }
                }
            }

            /**
             * @Description
             * Toggle a group of operations
             * @Param {number} index Index of the group of operation
             * @Param {boolean} currentState Actual state of the group (open / close)
             */
            $scope.toggleOperationsOfGroup = function(index, currentState) {

                for(var i = 0; i < $scope.groupOfOperations.length; i++) {
                    $scope.groupOfOperations[i].showOps = false
                }

                // Not Editable
                for(var i = 0; i < $scope.groupOfOperations[index].subOperations.length; i++) {
                    $scope.groupOfOperations[index].subOperations[i].editable = false
                }

                $scope.groupOfOperations[index].showOps = !currentState
                $scope.operationsOfGroup = $scope.groupOfOperations[index].subOperations
            }

            /**
             * @Description
             * Toggle deferred operations
             */
            $scope.toggleDeferredOps = function() {
                $scope.showDeferredOps = !$scope.showDeferredOps
            }

            /**
             * @Description
             * Generate the url for the csv of operations
             */
            function generateCsv() {
                $scope.urlCsv = ""

                var operations = []
                var account = [clone($scope.account)]

                // On enlève tous les champs inutiles
                delete account[0].$promise
                delete account[0].$resolved
                delete account[0].__v
                delete account[0]._id
                delete account[0].alerts
                delete account[0].balance
                delete account[0].operations
                delete account[0].type
                delete account[0].userId

                for(var i = 0; i < $scope.account.operations.length; i++) {
                    var operation = $scope.account.operations[i]
                    operations.push(clone(operation))

                    delete operations[i].__v
                    delete operations[i]._id
                    delete operations[i].accountId
                    delete operations[i].dateOperationIsAfterToday
                    delete operations[i].datePrelevementIsAfterToday
                    delete operations[i].__propo__
                    delete operations[i].subOperations
                    delete operations[i].$$hashKey
                }

                var csvAccount = Papa.unparse(account)

                //console.log(operations)
                var csv = Papa.unparse(operations)
                //console.log(csv)

                var blob = new Blob([ csvAccount + "\r\n\r\n" + csv ], { type : 'text/plain' })
                $scope.urlCsv = (window.URL || window.webkitURL).createObjectURL( blob )
                //console.log("Url generated")
            }

            // Initiatilisation
            refresh()
        }
})();

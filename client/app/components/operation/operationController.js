
(function() {
    'use strict';

    angular
        .module('controllers')
        .controller('OperationController', ['$scope', '$rootScope', 'StorageServices', 'OperationResource', 'AccountResource', 'CategoryResource', 'initService', '$state', OperationController])

        function OperationController($scope, $rootScope, StorageServices, OperationResource, AccountResource, CategoryResource, initService, $state) {

            $scope.resetOperationCreate = function () {
                $scope.operationCreateModel = {}
                $scope.operationCreateModel.advanced = false

                if($scope.addOperationForm !== undefined){
                    $scope.addOperationForm.$setPristine();
                }
            }  

            var accountId = $state.params.accountId
            $scope.accountId = accountId
            $scope.categories = []
            $scope.editable = false
            $scope.resetOperationCreate()
            $scope.operations = []
            $scope.groupOfOperations = []
            $scope.operationsOfGroup = []


            $scope.intervalType = INTERVAL_TYPES

            $scope.operationCreateModel = {
                period: {
                    intervalType: INTERVAL_TYPES[2]
                }
            }

            // $scope.operationCreateModel = {
            //     period: {
            //         intervalType: intervalType[2],
            //         step : 2,
            //         occurency: 3
            //     },
            //     accountId: '54ec74a2b5edf01c2c3a3552',
            //     advanced: true,
            //     dateOperation: '05/03/2015',
            //     datePrelevement: '05/03/2015',
            //     description: 'ceci est un test',
            //     periodic: true,
            //     thirdParty: 'Steam',
            //     type: 'CB',
            //     value: 45
            // }

                

            function postOperation(operation){ // DUPLICATE
                // if(StorageServices.isOnline()){ // TMP COMMENT TO MAKE IT WORKS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    OperationResource.add($scope.operationCreateModel).$promise.then(function(operation){
                        getOperations()
                    }, function(err){
                        postOperation(operation)
                    })
                // }
                // else{
                //     StorageServices.postOperation(accountId, operation)
                // }                
            }

            function getAccount(){
                if(StorageServices.isOnline()){
                    AccountResource.get($state.params.accountId).$promise.then(function(account){
                        StorageServices.setAccount(accountId, account)
                        $scope.account = account
                    }, function(err){
                        getAccount()
                    })
                }
                else{
                    $scope.account = StorageServices.getAccount(accountId)
                }
            }

            function saveOperationsOffline(accountId, operations){
                localStorage.setItem('operations-' + accountId, JSON.stringify(operations))
            }

            function clone(obj) {
                var target = {};
                for (var i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        target[i] = obj[i];
                    }
                }
                return target;
            }

            // TODO: Il ne faut pas afficher qu'il n'y a pas d'opérations avant d'avoir fait le premier getOperations

            // function postOperation(accountId, operation){ // DUPLICATE
            //     if(Offline.state === 'up'){
            //         //console.log($scope.operationCreateModel)
            //         //OperationResource.add($scope.operationCreateModel)

            //         OperationResource.add(operation).$promise.then(function(){
            //             getOperations()
            //         })
            //     }
            //     else{
            //         var wfc = eval('('+localStorage.getItem('waitingforconnection')+')')        
            //         wfc.operations.POSTs.push(operation)
            //         localStorage.setItem('waitingforconnection', JSON.stringify(wfc))
            //     }
            // }

            function getOperations() {
                if(StorageServices.isOnline()){
                    OperationResource.getAll(accountId).$promise.then(function(operations){

                        for(var i = 0; i < operations.length; i++) {

                            operations[i].categoryName = 'No category'

                            if(operations[i].categoryId !== '') {

                                for(var j = 0; j < $scope.categories.length; j++) {
                                    if($scope.categories[j].id === operations[i].categoryId) {
                                        operations[i].categoryName = $scope.categories[j].name
                                        operations[i].category = $scope.categories[j]
                                    }
                                }
                            }

                            operations[i].dateOperationIsAfterToday = false
                            if(moment(operations[i].dateOperation).isAfter(moment())) {
                                operations[i].dateOperationIsAfterToday = true
                            }

                            operations[i].datePrelevementIsAfterToday = false
                            if(moment(operations[i].datePrelevement).isAfter(moment())) {
                                operations[i].datePrelevementIsAfterToday = true
                            }
                        }
                        StorageServices.setOperations(accountId, operations)
                        $scope.operations = operations
                    }, function(err){
                        getOperations()
                    })
                }
                else{
                    $scope.operations = StorageServices.getOperations(accountId)
                }
            }

            getOperations()
            getAccount()

            $scope.updateSolde = function() {
                $scope.balance = 0
                $scope.deferredBalance = 0

                for(var i = 0; i < $scope.operations.length; i++) {
                    if($scope.operations[i].value !== '' && $scope.operations[i].value !== undefined) {

                        if(!$scope.operations[i].datePrelevementIsAfterToday) {
                            $scope.balance += parseFloat($scope.operations[i].value)
                        }

                        $scope.deferredBalance += parseFloat($scope.operations[i].value)
                    }
                }

                // 2 decimal au maximum
                $scope.balance = $scope.balance.toFixed(2)
                $scope.deferredBalance = $scope.deferredBalance.toFixed(2)
            }

            $scope.getCategoriesOperation = function() {
                var idUser = $rootScope.currentUserSignedInId
                
                if(idUser !== '' && idUser !== undefined) {
                    CategoryResource.getAll(idUser).$promise.then(function(categories){
                        $scope.categories = []
                        for(var i = 0; i < categories.length; i++) {
                            if(categories[i] !== null) {
                                $scope.categories.push(categories[i])
                            }
                        }

                        // On réactualise les opérations dans le cas où des
                        // catégories auraient été supprimées
                        getOperations()
                    })
                }
            }

            /*  
                ==== TODO ====
                - Lorsque l'on raffraichis la page (F5), le rootScope est vidé, et on ne
                possède plus l'User ID, et donc plus de requêtes qui ont besoin de cet ID
                On verra quand la gestion du compte sera terminée
            */

            $scope.addOperation = function() {
                if(accountId !== '') {
                    $scope.operationCreateModel.accountId = accountId
                }

                if($scope.operationCreateModel.hasOwnProperty('category') && $scope.operationCreateModel.category !== undefined) {

                    $scope.operationCreateModel.categoryId = $scope.operationCreateModel.category.id
                }

                // TODO: Verifier le bon format de la date
                if( !$scope.operationCreateModel.hasOwnProperty('dateOperation') 
                    || $scope.operationCreateModel.dateOperation === ''
                    || !moment($scope.operationCreateModel.dateOperation).isValid) {

                    $scope.operationCreateModel.dateOperation = moment().format('YYYY/MM/DD')
                }

                if( !$scope.operationCreateModel.hasOwnProperty('datePrelevement') 
                    || $scope.operationCreateModel.datePrelevement === ''
                    || !moment($scope.operationCreateModel.datePrelevement).isValid) {

                    $scope.operationCreateModel.datePrelevement = $scope.operationCreateModel.dateOperation
                }

                if( $scope.operationCreateModel.hasOwnProperty('periodic')
                    && $scope.operationCreateModel.periodic) {

                    var newOpt = clone($scope.operationCreateModel)

                    var toSend = {
                        name: newOpt.description,
                        dateBegin: newOpt.period.dateBegin === undefined ? newOpt.dateOperation : newOpt.period.dateBegin,
                        nbRepeat: newOpt.period.occurency,
                        step: newOpt.period.step,
                        intervalType: newOpt.period.intervalType.code,
                        operation : {
                            value: newOpt.value,
                            thirdParty: newOpt.thirdParty,
                            description: newOpt.description,
                            typeOpt: newOpt.type,
                            // checked: false,
                            dateOperation: newOpt.dateOperation,
                            datePrelevement: newOpt.datePrelevement,
                            // categoryId: newOpt.category,
                            accountId: newOpt.accountId
                        }
                    }

                    console.log(toSend)

                    periodRes.add(toSend).$promise.then(function() {
                        // refresh()
                        // TODO popup for confirmation
                    })

                    // periodService.add(tmp).$promise.then(function() {
                    //     // refresh()
                    //     resetAddForm()
                    //     $modalInstance.close();
                    // })

                    // addPeriodOpt($scope.operationCreateModel)

                } else { // Add normal operation
                    var newOpt = clone($scope.operationCreateModel)

                    if(!newOpt.advanced){
                        var toSend = {
                            accountId: newOpt.accountId,
                            value: newOpt.value,
                            categoryId: newOpt.categoryId,
                            dateOperation: newOpt.dateOperation,
                            datePrelevement: newOpt.datePrelevement
                        }
                    }else {
                        toSend = newOpt
                        delete toSend.period
                    }


                    postOperation(toSend)                    
                }

                $scope.resetOperationCreate()
                getAccount()
                getOperations()
            }

            $scope.deleteOperation = function(idOperation, index) {
                OperationResource.remove(idOperation).$promise.then(function(){
                    //getOperations()

                    // On clique sur le delete d'une operation d'un groupe
                    if($scope.operationsOfGroup.length > 0) {
                        $scope.operationsOfGroup.splice(index, 1)
                        $scope.updateGroups();

                        for(var i = 0; i < $scope.operations.length; i++) {
                            if($scope.operations[i]._id === idOperation) {
                                $scope.operations.splice(i, 1)
                                break
                            }
                        }
                    } else {
                        $scope.operations.splice(index, 1)
                    }
                    
                    $scope.updateSolde();
                    getAccount()
                    getOperations()
                })
            }

            $scope.validateOperation = function(operation) {
                OperationResource.update(operation)
            }

            // TODO: Update non fonctionnel au CREMI, à vérifier

            $scope.updateOperation = function(operation) {
                operation.editable = false

                if(operation.hasOwnProperty('category') && operation.category !== undefined) {
                    operation.categoryId = operation.category.id

                } else { // Plus de catégories
                    operation.categoryId = ''
                    operation.categoryName = 'No category'
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

            $scope.showOperationAdvanced = function() {
                $scope.operationCreateModel.advanced = true
            }

            $scope.hideOperationAdvanced = function() {
                $scope.operationCreateModel.advanced = false
            }

            $scope.groupOperation = function() {

                $scope.groupOfOperations = []
                $scope.operationsOfGroup = []

                if($scope.groupedBy !== '') {

                    for(var i = 0; i < $scope.operations.length; i++) {
                        var found = false
                        var operationGroupedByField = ''

                        // TODO: Voir si on groupe aussi par date différée
                        if($scope.groupedBy === 'date') { 
                            operationGroupedByField = $scope.operations[i].dateOperation
                        } else if($scope.groupedBy === 'category') {
                            operationGroupedByField = $scope.operations[i].categoryName
                        } else if($scope.groupedBy === 'type') {
                            operationGroupedByField = $scope.operations[i].type
                        } else if($scope.groupedBy === 'thirdParty') {
                            operationGroupedByField = $scope.operations[i].thirdParty
                        } else {
                            // Il doit y avoir une erreur dans le 'select'
                            break
                        }

                        if(operationGroupedByField === '' || operationGroupedByField === undefined) {
                            operationGroupedByField = 'Empty field'
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
                    getOperations()
                }
            }

            // TODO: Dans le cas de la suppression d'une operation d'un groupe 
            // ne contenant qu'une operation il faudra supprimer le groupe
            // OU peut etre pas, comme ça on voit bien le groupe vide

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

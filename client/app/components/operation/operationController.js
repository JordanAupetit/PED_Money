
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


            //OperationResource.add(op1)
            //OperationResource.add(op2)

            $scope.operationCreateModel = {};
            var getOperations = function() {
                OperationResource.getAll().$promise.then(function(operations){
                    $scope.operations = operations

                    $scope.solde = 0

                    for(var i = 0; i < operations.length; i++) {
                        //console.log(operations[i])

                        $scope.solde += operations[i].value
                    }
                })
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

            



            

            getCategories()            

            

            

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


        }]);

})();

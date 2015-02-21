(function() {
    'use strict';

    angular
    .module('controllers')
    .controller('ManageCategoriesController', 
        ['$scope', 'CategoryResource', function ManageCategoriesController($scope, CategoryResource) {
            
            function CategorieUnderConstruction(subCategory){
                this.name = ""
                this.isSubCategory = false
                this.subCategory = subCategory
            }

            function Categorie(name){
                this.name = name
                this.subCategories = []
            }
            
            /*
            var op = {
                    name: "Shooping",
                    subCategories:[
                        "Food",
                        "Clothes",
                        "Gifts"
                    ]
                }


            //CategoryResource.add(op)
            /*

            $scope.categories = [
                {
                    name: "Shooping",
                    subCategories:[
                        "Food",
                        "Clothes",
                        "Gifts"
                    ]
                },
                {
                    name: "Loisir",
                    subCategories:[
                        "Football",
                        "Cinema",
                        "Others"
                    ]
                },
                {   
                    name: "Others",
                    subCategories:[
                        "Pets"
                    ]
                }
            ];

            */
            var getCategories = function() {
                CategoryResource.getAll('54e4d019e6d52f98153df4c9').$promise.then(function(categories){
                    $scope.categories = categories
                    $scope.newCategory = new CategorieUnderConstruction($scope.categories[0])
                })
            }

            // getCategories()

            $scope.createCategory = function(){
                if($scope.newCategory.name){
                    if($scope.newCategory.isSubCategory){
                        var index = $scope.categories.indexOf($scope.newCategory.subCategory)
                        $scope.categories[index].subCategories.push($scope.newCategory.name)
                    }
                    else{
                        $scope.categories.push(new Categorie($scope.newCategory.name))
                    }
                    $scope.newCategory = new CategorieUnderConstruction($scope.categories[0])
                }
            }

            $scope.deleteCategory = function(categories, category){
                var index = categories.indexOf(category)
                categories.splice(index, 1)

                if(categories.length>0)
                    $scope.newCategory = new CategorieUnderConstruction($scope.categories[0])
            }

            $scope.moveCategory = function(categories, category, up){
                var index = categories.indexOf(category)            
                if(up){
                    if(index>0){
                        categories[index] = categories[index-1]
                        categories[index-1] = category
                    }
                }
                else{
                    if(index<categories.length-1){
                        categories[index] = categories[index+1]
                        categories[index+1] = category
                    }
                }
            }

            $scope.saveChanges = function(){
                var target = event.target
                target.textContent = "loading ..."
                target.disabled = true;
                
                CategoryResource.update('54e4d019e6d52f98153df4c9', $scope.categories).$promise.then(function callback (err, numAffected) {

                    
                    target.textContent = "Save changes"
                    target.disabled = false;

                    $('#modalManageCategories').modal('hide');
                });
            }
        }])  
})();
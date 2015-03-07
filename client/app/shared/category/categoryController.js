(function() {
    'use strict';

    angular
        .module('controllers')
        .controller('ManageCategoriesController', ['$scope', '$rootScope', 'CategoryResource', ManageCategoriesController])

    function ManageCategoriesController($scope, $rootScope, CategoryResource) {

        var uniqid = function() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1)
            }

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

        function CategorieUnderConstruction(subCategory) {
            this.name = ""
            this.isSubCategory = false
            this.subCategory = subCategory
        }

        function Categorie(name) {
            this.id = uniqid()
            this.name = name
            this.subCategories = []
        }

        $scope.categories = []

        var getCategories = function() {
            var idUser = $rootScope.currentUserSignedInId

            if (idUser !== "" && idUser !== undefined) {
                CategoryResource.getAll(idUser).$promise.then(function(categories) {
                    $scope.categories = []
                    for (var i = 0; i < categories.length; i++) {
                        if (categories[i] !== null) {
                            $scope.categories.push(categories[i])
                        }
                    }
                    $scope.newCategory = new CategorieUnderConstruction($scope.categories[0])

                    // TODO: /!\ voir si ça fonctionne tous le temps
                    $scope.$parent.$parent.getCategoriesOperation()
                })
            }
        }

        getCategories()

        $scope.createCategory = function() {
            if ($scope.newCategory.name) {
                if ($scope.newCategory.isSubCategory) {
                    var index = $scope.categories.indexOf($scope.newCategory.subCategory)
                    $scope.categories[index].subCategories.push($scope.newCategory.name)
                } else {
                    $scope.categories.push(new Categorie($scope.newCategory.name))
                }
                $scope.newCategory = new CategorieUnderConstruction($scope.categories[0])
            }
        }

        $scope.deleteCategory = function(categories, category) {
            var index = categories.indexOf(category)
            categories.splice(index, 1)

            if (categories.length > 0)
                $scope.newCategory = new CategorieUnderConstruction($scope.categories[0])
        }

        $scope.moveCategory = function(categories, category, up) {
            var index = categories.indexOf(category)
            if (up) {
                if (index > 0) {
                    categories[index] = categories[index - 1]
                    categories[index - 1] = category
                }
            } else {
                if (index < categories.length - 1) {
                    categories[index] = categories[index + 1]
                    categories[index + 1] = category
                }
            }
        }

        $scope.saveChanges = function() {
            var target = event.target
            target.textContent = "loading ..."
            target.disabled = true

            var idUser = $rootScope.currentUserSignedInId

            if (idUser !== "" && idUser !== undefined) {
                CategoryResource.update(idUser, $scope.categories).$promise.then(function callback(err, numAffected) {

                    target.textContent = "Save changes"
                    target.disabled = false;

                    getCategories()

                    $('#modalManageCategories').modal('hide');
                });
            }
        }
    }
})();
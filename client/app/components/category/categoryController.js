(function() {
    'use strict';

    angular
        .module('controllers')
        .controller('CategoryController', CategoryController);

    function CategorieUnderConstruction(subCategory){
    	this.name = ""
    	this.isSubCategory = false
		this.subCategory = subCategory
    }

    function Categorie(name){
    	this.name = name
    	this.subCategories = []
    }

    function CategoryController($scope) {
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

	    $scope.newCategory = new CategorieUnderConstruction($scope.categories[0])

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
			event.target.textContent = "loading ..."
			event.target.disabled = true;
			
			//TODO
			/*
				post des categories + remise bouton d'origine
			*/
		}
    }
})();

(function() {
    'use strict';

    angular.module('services')
    .factory('CategoryResource', ['$resource', function($resource){

        var categoryResource =  $resource('/api/category/:id', {}, {
            getAll : {method:'GET', isArray:true},
            get : {method:'GET'},
            add : {method:'POST'},
            delete : {method:'DELETE'}
        })

        return {
            getAll: function(){
                return categoryResource.getAll()
            },
            add: function(category){
                categoryResource.add(category)
            },
            remove: function(periodId){
                return categoryResource.delete({id : periodId})
            }
        }
    }])

})();

(function() {
    'use strict';

    angular.module('services')
    .factory('CategoryResource', ['$resource', function($resource){

        var categoryResource =  $resource('/api/category/:userid', {}, {
            getAll : {method:'GET', isArray:true},
            update : {method:'PUT', isArray:true}
        })

        return {
            getAll: function(userid){
                return categoryResource.getAll({userid: userid})
            },
            update: function(userid, categories){
                return categoryResource.update({userid: userid}, categories)
            }
        }
    }])
})();
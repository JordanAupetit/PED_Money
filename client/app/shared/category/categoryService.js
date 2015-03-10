(function() {
    'use strict';

    angular.module('services')
        .factory('CategoryResource', ['$resource', CategoryResource])



    function CategoryResource($resource) {

        var categoryResource

        return {
            init: function(userToken) {
                categoryResource = $resource('/api/category', {}, {
                    getAll: {
                        method: 'GET',
                        isArray: true, 
                        headers:{'X-User-Token': userToken}
                    },
                    update: {
                        method: 'PUT',
                        isArray: true, 
                        headers:{'X-User-Token': userToken}
                    }
                })
            },
            getAll: function() {
                return categoryResource.getAll()
            },
            update: function(userid, categories) {
                return categoryResource.update({
                    userid: userid
                }, categories)
            }
        }
    }
})();
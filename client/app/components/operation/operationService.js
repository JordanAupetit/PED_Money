
(function() {
    'use strict';

    angular.module('services')
    .factory('OperationResource', ['$resource', function($resource){

        var operationResource =  $resource('/api/operation/:id', {}, {
            getAll : {method:'GET', isArray:true},
            get : {method:'GET'},
            add : {method:'POST'},
            delete : {method:'DELETE'}
        })

        return {
            getAll: function(){
                return operationResource.getAll()
            },
            add: function(operation){
                operationResource.add(operation)
            },
            remove: function(periodId){
                return operationResource.delete({id : periodId})
            }
        }
    }])

})();
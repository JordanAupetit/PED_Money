
(function() {
    'use strict';

    angular.module('services')
    .factory('OperationResource', ['$resource', function($resource){

        var operationResource =  $resource('/api/operation/:id', {}, {
            getAll : {method:'GET', isArray:true},
            get : {method:'GET'},
            add : {method:'POST'},
            update : {method:'PUT'},
            delete : {method:'DELETE'}
        })

        return {
            getAll: function(){
                return operationResource.getAll()
            },
            add: function(operation){
                operationResource.add(operation)
            },
            update: function(operation){
                operationResource.update(operation)
            },
            remove: function(periodId){
                return operationResource.delete({id : periodId})
            }
        }
    }])

})();
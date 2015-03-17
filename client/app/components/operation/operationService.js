
(function() {
    'use strict';

    angular.module('services')
    .factory('OperationResource', ['$resource', function($resource){

        var operationResource =  $resource('/api/operation/:id', {}, {
            //getAll : {method:'GET', isArray:true},
            //get : {method:'GET'},
            add : {method:'POST'},
            update : {method:'PUT'},
            delete : {method:'DELETE'}
        })

        var operationResourceToAccount =  $resource('/api/account/:accountId/operation/', {}, {
            //getAll : {method:'GET', isArray:true}
        })

        return {
            /*
            getAll: function(accountId){
                return operationResourceToAccount.getAll({accountId : accountId})
            },
            */
            add: function(operation){
                return operationResource.add(operation)
            },
            update: function(operation){
                return operationResource.update(operation)
            },
            remove: function(periodId){
                return operationResource.delete({id : periodId})
            }
        }
    }])

})();
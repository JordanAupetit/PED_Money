
(function() {
    'use strict';

    angular.module('services')
    .factory('OperationResource', ['$resource', function($resource){
        var dateFormat = 'YYYY-MM-DD'

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

        /**
         * @Description
         * Correct the dates of an operation
         * @Param {Object} operation An operation to correct
         */
        function correctDateOfOperation(operation) {

            // Clean date
            if( !operation.hasOwnProperty('dateOperation') 
                || operation.dateOperation === ''
                || !moment(operation.dateOperation, dateFormat).isValid) {

                operation.dateOperation = moment().format('YYYY-MM-DD')
            } else {
                operation.dateOperation = moment(operation.dateOperation, dateFormat).format('YYYY-MM-DD')
            }


            if( !operation.hasOwnProperty('datePrelevement') 
                || operation.datePrelevement === ''
                || !moment(operation.datePrelevement, dateFormat).isValid) {

                operation.datePrelevement = operation.dateOperation
            } else {

                // Si la date différée est inférieur à la date de l'opération
                // mettre à la date de l'opération
                if(moment(operation.datePrelevement, dateFormat).isBefore(moment(operation.dateOperation, dateFormat))) {
                    operation.datePrelevement = operation.dateOperation
                } else {
                    operation.datePrelevement = moment(operation.datePrelevement, dateFormat).format('YYYY-MM-DD')
                }
            }

            return operation
        }

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
            },
            correctDateOfOperation: function(operation){
                return correctDateOfOperation(operation)
            }
        }
    }])

})();
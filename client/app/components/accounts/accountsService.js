
(function() {
    'use strict';

    angular.module('services')
    .factory('AccountResource', ['$resource', function($resource){

        var accountResource =  $resource('/api/account/:id', {}, {
            getAll : {method:'GET', isArray:true},
            get : {method:'GET'},
            add : {method:'POST'},
            delete : {method:'DELETE'}
        })

        return {
            getAll: function(){
                return accountResource.getAll()
            },
            add: function(account){
                accountResource.add(account)
            },
            remove: function(accountId){
                return accountResource.delete({id : accountId})
            }
        }
    }])

})();
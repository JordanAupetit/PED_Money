
(function() {
    'use strict';

    angular.module('services')
    .factory('AccountResource', ['$resource', function($resource){

        var accountResource =  $resource('/api/account/:id', {}, {
            getAll : {method:'GET', isArray:true},
            get : {method:'GET'},
            add : {method:'POST'},
            delete : {method:'DELETE'},
            update : {method : 'PUT'}
        })

        return {
            getAll: function(){
                return accountResource.getAll()
            },
            get: function(accountId){
                var account = accountResource.get({id: accountId})
                return account
            },
            /*            
            add: function(account){
                accountResource.add(account)
            },
            */            
            add: function(account, callback){
                accountResource.add(account, callback)
            },
            remove: function(accountId){
                return accountResource.delete({id : accountId})
            },
            update: function(account){
                accountResource.update(account)
            }
        }
    }])

})();
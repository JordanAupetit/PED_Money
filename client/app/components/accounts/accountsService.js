
(function() {
    'use strict';

    angular.module('services')
    .factory('AccountResource', ['$resource', function($resource){
        var accountResource

        return {
            init: function(token){
                var userToken = token
                accountResource =  $resource('/api/account/:id', {}, {
                    getAll : {method:'GET', isArray:true, headers:{'X-User-Token': userToken}},
                    get : {method:'GET', headers:{'X-User-Token': userToken}},
                    add : {method:'POST', headers:{'X-User-Token': userToken}},
                    delete : {method:'DELETE', headers:{'X-User-Token': userToken}},
                    update : {method : 'PUT', headers:{'X-User-Token': userToken}}
                })
            },
            getAll: function(){
                return accountResource.getAll()
            },
            get: function(accountId){
                return accountResource.get({id: accountId})
            },          
            add: function(account, callback){
                return accountResource.add(account, callback)
            },
            remove: function(accountId){
                return accountResource.delete({id : accountId})
            },
            update: function(account){
                return accountResource.update(account)
            }
        }
    }])

})();
angular.module('appModule').
    factory('LoginService', function($resource) {
        return $resource('/api/:id', {}, {
            
            query: { method: 'POST',params :{id  : 'authenticate'}},
            save : { method: 'POST',params :{id  : 'user'}}
        })
    });
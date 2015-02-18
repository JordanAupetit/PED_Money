angular.module('appModule').
    factory('signupService', function($resource) {
        return $resource('/api/user', {}, {
            
            query: { method: 'GET', isArray: true },
            save : { method: 'POST'},
            delete : {method : 'DELETE' },
            vote   : { method: 'PUT' , params :{id  : 'vote'} ,isArray: true}
        })
    });
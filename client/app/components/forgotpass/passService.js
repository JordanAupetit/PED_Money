angular.module('appModule').
    factory('PassService', function($resource) {
        return $resource('/api/:id/:token', {}, {
            forgot : { method: 'POST',params :{id  : 'forgot'}},
            query : { method: 'POST',params :{id  : 'passchange',token : '@token'}},
        })
    });
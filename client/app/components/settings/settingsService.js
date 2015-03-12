angular.module('appModule').
    factory('SettingsService', function($resource) {
        return $resource('/api/:id', {}, {
            save : { method: 'PUT',params :{id  : 'user'}}
        })
    });
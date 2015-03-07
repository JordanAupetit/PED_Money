(function() {
    'use strict';


    angular.module('services')
        .factory('userInfos', function () {
            var infos
            return {
                get: function(){
                    return infos
                },
                set: function(info){
                    infos = info
                }
            }
        })

})();
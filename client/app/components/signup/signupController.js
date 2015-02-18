(function(){

'use strict';

    angular
        .module('appModule')
        .controller('SignupController',['$scope','signupService','$state','localStorageService' , function($scope,signupService,$state,localStorageService){
        	$scope.SignupController=function(){
        		
        		var item=$scope.User;
                var newUser = new signupService(item);
                newUser.$save(function(res) {
                    if(res.type == false) {
                        alert(res.data);
                    } else {
                        localStorageService.cookie.set('token',res.data.token);
                        $state.go('login');
                    }
                });
        		
                
            };
        		
        	

        }]);

 })();
   

	

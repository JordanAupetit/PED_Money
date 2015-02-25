(function() {
    'use strict';

    

    /* App Module */

	angular
		.module('appModule')
		.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
	 

    $urlRouterProvider.otherwise('/login');
	  // Now set up the states
	  
    $stateProvider
	  	.state('login', {
        url: '/login',
	      templateUrl: 'app/components/login/loginView.html',
	 	    controller: 'LoginController',
        data: {
          requireLogin: false
        }
	    })

	  	.state('signup', {
	      url: '/signup',
	      templateUrl: 'app/components/signup/signupView.html',
	      controller: 'SignupController',
        data: {
          requireLogin: false
        }
	    })

      .state('compte', {
	      url: '/compte',
	      templateUrl: 'app/components/compte/compte.html',
        data: {
          requireLogin: true
        }
	    })

      .state('operation', {
        url: '/operation',
        templateUrl: 'app/components/operation/operationView.html',
        controller: 'OperationController',
        data: {
          requireLogin: true
        }
      })

      .state('optPeriod', {
        url: '/operation/period/',
        templateUrl: 'app/components/operation/period/periodView.html',
        controller: 'periodController',
        data: {
          requireLogin: true
        }
      })
	   
		
}])

  .run(function ($rootScope,$state,localStorageService,ipCookie) {

    $rootScope.$on('$stateChangeStart', function (event, toState) {
      var requireLogin = toState.data.requireLogin;
      
      if (requireLogin && ipCookie('token')==undefined) {
        event.preventDefault();
       $state.go('login');
      }
      if ( toState.templateUrl === "app/components/login/loginView.html" && ipCookie('token')!=undefined) {
          alert("Access denied you have to logout ");
           event.preventDefault();
          $state.go('compte');

        }
    });
  });
  
})();
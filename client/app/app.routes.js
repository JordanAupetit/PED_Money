(function() {
  'use strict';

  /* App Module */

  angular
    .module('appModule')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {



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

      .state('accounts', {
        url: '/accounts',
        templateUrl: 'app/components/accounts/accountsView.html',
        controller: 'AccountController',
        data: {
          requireLogin: true
        }
      })

      .state('operation', {
        url: '/:accountId/operation/',
        templateUrl: 'app/components/operation/operationView.html',
        controller: 'OperationController',
        data: {
          requireLogin: true
        }
      })

      .state('optPeriod', {
        url: '/:accountId/operation/period/',
        templateUrl: 'app/components/operation/period/periodView.html',
        controller: 'PeriodCtrl',
        data: {
          requireLogin: true
        }
      })



      .state('budget', {
        url: '/budget/',
        templateUrl: 'app/components/budget/budgetView.html',
        controller: 'BudgetCtrl',
        data: {
          requireLogin: true
        }
      })

      .state('budgetdetails', {
        url: '/budget/details/',
        templateUrl: 'app/components/budget/details/detailsView.html',
        controller: 'BudgetDetailsCtrl',
        data: {
          requireLogin: true
        }
      })

      .state('offline', {
        url: '/offline',
        templateUrl: 'app/components/offline/offlineView.html',
        controller: 'offlineController',
        data: {
          requireLogin: true
        }
      })
	   	
  }])

  .run(function ($rootScope,$state,localStorageService,ipCookie) {

    $rootScope.$on('$stateChangeStart', function (event, toState) {
      var requireLogin = toState.data.requireLogin;
      
      if (requireLogin 
          && ipCookie('token') == undefined) {
        event.preventDefault();
        $state.go('login');
      }

      if (toState.templateUrl === 'app/components/login/loginView.html'
          && ipCookie('token') !== undefined) {
          $state.go('accounts');

      }
    });
  });

})();
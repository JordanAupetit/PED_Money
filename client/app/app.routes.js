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
                    url: '/login?username&token',
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
                
                .state('accountSettings', {
                    url: '/:accountId/settings',
                    templateUrl: 'app/components/accounts/settingsView.html',
                    controller: 'AccountSettingsController',
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

                .state('settings', {
                    url: '/settings',
                    templateUrl: 'app/components/settings/settingsView.html',
                    controller: 'SettingsController',
                    data: {
                        requireLogin: true
                    }
                })

        }])
        .run(['$rootScope', 'StorageServices', 'initService', '$location', startup])


        function startup($rootScope, StorageServices, initService, $location){
            // console.log('Startup or Refresh')

            /**
             * Init ressources on page reload
             */

            if($location.$$path !== "/login"){
                var user = StorageServices.getUser()
                if(user !== undefined){
                    initService.initRessources(user.token)
                } else {
                    //console.log("*Redirect* User doesn't exist")
                    $location.path("/")
                }
            }

            /**
             * Trigger on login
             * Init ressources o n login
             */
            $rootScope.$on('login', function(event) {
                // console.log('login evt'); 
                var user = StorageServices.getUser()
                if(user !== undefined){
                    initService.initRessources(user.token)
                }
            })
        }


})();
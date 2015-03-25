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
                data: {
                    requireLogin: false
                },
                views: {
                    "viewA": { templateUrl: "app/components/login/loginView.html" ,
                               controller: 'LoginController'
                    }
                  }
            })
            .state('forgotpass', {
                url: '/forgotpass',
                data: {
                    requireLogin: false
                },
                views: {
                    "viewB": { templateUrl: 'app/components/forgotpass/passView.html',
                               controller: 'PassController'
                    }
                  }
            })
            .state('passchange', {
                    url: '/passchange/:token',
                    data: {
                        requireLogin: false
                    },
                    views: {
                        "viewB": { templateUrl: 'app/components/forgotpass/newpassView.html',
                                   controller: 'NewPassController'
                        }
                      }
                })
            .state('accounts', {
                    url: '/accounts',
                    data: {
                        requireLogin: true
                    },
                    views: {
                        "viewB": { templateUrl: 'app/components/accounts/accountsView.html',
                                   controller: 'AccountController'
                        }
                      }
                })
            .state('accountSettings', {
                url: '/:accountId/settings',
                data: {
                    requireLogin: true
                },
                views: {
                    "viewB": {  templateUrl: 'app/components/accounts/settingsView.html',
                                controller: 'AccountSettingsController'
                    }
                  }
            })
            .state('operation', {
                url: '/:accountId/operation/',
                data: {
                    requireLogin: true
                },
                views: {
                        "viewB": {  templateUrl: 'app/components/operation/operationView.html',
                                    controller: 'OperationController'
                        }
                      }
            })
            .state('optPeriod', {
                url: '/:accountId/operation/period/',
                
                data: {
                    requireLogin: true
                },
                views: {
                        "viewB": {  templateUrl: 'app/components/operation/period/periodView.html',
                                    controller: 'PeriodCtrl'
                        }
                      }
            })
            .state('budget', {
                url: '/budget/',
                
                data: {
                    requireLogin: true
                },
                views: {
                        "viewB": {  templateUrl: 'app/components/budget/budgetView.html',
                                    controller: 'BudgetCtrl'
                        }
                      }
            })
            .state('budgetdetails', {
                url: '/budget/details/',
                
                data: {
                    requireLogin: true
                },
                views: {
                        "viewB": {  templateUrl: 'app/components/budget/details/detailsView.html',
                                    controller: 'BudgetDetailsCtrl'
                        }
                      }
            })
            .state('offline', {
                url: '/offline',
                
                data: {
                    requireLogin: true
                },
                views: {
                        "viewB": { templateUrl: 'app/components/offline/offlineView.html',
                                   controller: 'offlineController'
                        }
                      }
            })
            .state('settings', {
                url: '/settings',
                
                data: {
                    requireLogin: true
                },
                views: {
                        "viewB": {  templateUrl: 'app/components/settings/settingsView.html',
                                    controller: 'SettingsController'
                        }
                      }
            })
            .state('analysis', {
                url: '/analysis',
                
                data: {
                    requireLogin: true
                },
                views: {
                        "viewB": {  templateUrl: 'app/components/analysis/analysisView.html',
                                    controller: 'AnalysisController'
                        }
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
                if(user !== null){
                    initService.initRessources(user.token)
                    $rootScope.bool=true;
                } else {
                    //console.log("*Redirect* User doesn't exist")
                    $location.path("/")
                }
            }

           /* $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
                var requireLogin = toState.data.requireLogin;
                if(toState.name !== "login"){
                    
                var user = StorageServices.getUser()
                    if(user !== null){
                        initService.initRessources(user.token)
                        $rootScope.bool = true;
                    } else {
                        if(requireLogin == true){
                                event.preventDefault();
                                $rootScope.bool = false;
                                $state.go("login")
                            } 
                    }
                }else{
                     $rootScope.bool = false;
                }

              });*/
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
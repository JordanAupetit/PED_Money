(function() {
    'use strict';

    

    /* App Module */

    angular
        .module('appModule')
        .config(configUiRoute)

    function configUiRoute($stateProvider, $urlRouterProvider) {
        // $urlRouterProvider.otherwise('account');
      
        // Now set up the states
        $stateProvider
            .state('accounts', {
                url: '/accounts',
                templateUrl: 'app/components/accounts/accountsView.html',
                controller: 'AccountController'
            })

            


        // .state('account', {
       //    url: '/account/{accountId}',
       //    templateUrl: 'components/account/accountView.html',
       //    controller: 'accountController'
       //  })
       //  .state('account.expenses', {
       //    url: '/expenses',
       //    templateUrl: 'components/expense/expenseView.html',
       //    controller: 'expensesController',
       //    parent : 'account'
       //  })
       //  .state('account.bilan', {
       //    url: '/bilan',
       //    templateUrl: 'components/bilan/bilanView.html',
       //    controller: 'bilanController',
       //    parent : 'account'
       //  })
       //  .state('settings', {
       //    url: '/settings',
       //    templateUrl: 'components/settings/settingsView.html',
       //    controller: 'settingsController'
       //  })
    }

})();
(function(){
    'use strict';

    angular
        .module('controllers')
        .controller('NavbarController', ['$scope','$rootScope','$state', 'initService', 'StorageServices', '$http', 'LoginService' , 'AccountResource', '$location', NavbarController])

    function NavbarController($scope, $rootScope, $state, initService, StorageServices, $http, LoginService, AccountResource, $location) {

        
        
        function refreshScope(){
            $scope.error = null
            $scope.signInUser = {}
            $scope.signUpUser = {}
            
            $scope.user = StorageServices.getUser()
            // If user is not login, go to login page
            if(!$scope.user) {
                $state.go('login')
            }
            else{
                StorageServices.getAccounts(function(accounts){
                    $scope.accounts = accounts
                })

                //if($rootScope.account !== undefined) {
                    $scope.account = $rootScope.account
                //}
            }

            $scope.initSelector = 'dataset_etienne_budget.json'
        }

        // On récupère toujours l'URL courante même en la changeant à la main
        // cela permet de ne pas afficher la navbar sur le login
        $rootScope.$watch(function() { 
            return $location.path(); 
        },
        function(url){  
            $scope.currentUrl = url

            if(url === "/login" && !$scope.user) {
                $rootScope.account = undefined
                $scope.account = undefined
            }

            //checkIfUserExist()
        });

        // Redirection si l'user n'existe pas sur la page de login
        // function checkIfUserExist() {
        //     var url = $location.path()

        //     if(url === "/login" && $scope.user) {
        //         $state.go('accounts')
        //     }
        // }

        /**
         * Login fct
         */
        $scope.signIn = function() {
            if($scope.signInUser.username && $scope.signInUser.password){
                var loginUser = new LoginService($scope.signInUser)
                loginUser.$query(function(res) {
                    if (res.type == false) {
                        alert(res.data);
                    } else {
                        $scope.user = res.data
                        StorageServices.login($scope.user)
                        $state.go('accounts');
                        initService.initRessources(StorageServices.getUser().token)
                    }
                })
            }
        }

        function isFormValid(){
            $scope.error = null

            var username = $scope.signUpUser.name
            var first = $scope.signUpUser.first
            var last = $scope.signUpUser.last
            var email = $scope.signUpUser.mail
            var psw = $scope.signUpUser.pass
            var repsw = $scope.signUpUser.repass
            
            if(username && first && last && email && psw && repsw) {
                if(validateEmail(email) == false) {
                  $scope.error = "Incorrect email "
                  return false;
                }
                else if((psw.length)<1) {
                    $scope.error = "Password must contain at least 8 letter";
                    return false;
                }                
                else if(!(psw).match(repsw)) {
                    $scope.error = "Passwords don't match"
                    return false;
                }
                return true
            }
            else {
                $scope.error = "Fill in all required entry fields"
                return false;
            }
        }


        function validateEmail(email) { 
            var re = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            return re.test(email);
        } 

        /**
         * Signup fct
         */
        $scope.signUp = function() {
            if(isFormValid()){
                var newUser = {
                        username: $scope.signUpUser.name,
                        lastName: $scope.signUpUser.last,
                        firstName: $scope.signUpUser.first,
                        email: $scope.signUpUser.mail,
                        password: $scope.signUpUser.pass
                    }
                var newNewUser = new LoginService(newUser);
                newNewUser.$save(function(res) {
                    if (res.type == false) {
                        alert(res.data);
                    } else {
                        $('#modal-signup').modal('hide');
                        $scope.signInUser.username = newUser.username
                        $scope.signUpUser = {}
                    }
                })
            }
        }

        $scope.logout = function() {
            StorageServices.logout(function(){
                initService.initRessources(undefined)
                $scope.user = undefined
                $rootScope.bool=false;
                $state.go('login')
            })
        }
        
        $scope.initData = function(){
            var accountId = $state.params.accountId

            if(accountId === undefined){
                console.log('Got to an account to init data')
            }else{
                // console.log(accountId)
                $http.get('datasets/'+$scope.initSelector).success(function(data){
                    initService.loadDataset(data, accountId).then(function(){
                        console.log('Db init OK')
                    })
                }).error(function(data, status, headers, config){
                    console.log(data)
                    console.log(status)
                    console.log(headers)
                    console.log(config)
                })
                // initService.loadDataset1()
                // .then(function(){
                //     console.log('Db init OK')
                // })
            }
        }

        $scope.dismissAlert = function(){
            $rootScope.showAlert = false
        }

        /**
         * Trigger on login
         * Refresh $scope.user value
         */
        $rootScope.$on('login', function(event) { 
            refreshScope()
        })

        /**
         * Trigger on a account is added or updated
         * Refresh accounts on navbar
         */
        $rootScope.$on('accountRefresh', function(event) {
            refreshScope()
        })

        /**
         * Trigger on account selected
         */
        $rootScope.$on('accountSelected', function(event) {
            refreshScope()
        })

        refreshScope()
        //checkIfUserExist()
    }	
})();
// describe('UNIT::User', function() {
//     beforeEach(module('appModule'));
//     beforeEach(module('services'));

//     var UserDefault = {
//         _id: "54feed0a3612a53c11bb33b5",
//         clientID: 123456,
//         username: "test user",
//         lastName: "test user",
//         firstName: "test user",
//         email: "test@test.com",
//         password: "test", // TODO Add salt ??
//         token: "token test"
//     }

//     var $controller;
//     var $httpBackend;
//     var scope;
//     var initService;

//     beforeEach(inject(function(_$controller_,_$location_ ,_initService_) {
//         // The injector unwraps the underscores (_) from around the parameter names when matching
//         $controller = _$controller_;
//         initService = _initService_;
//         $location = _$location_;
//     }));

//     describe('Controller', function() {
//         var $scope, controller;

//         beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, initService) {
//             $httpBackend = _$httpBackend_;

//             initService.initRessources('fakeToken')

//             scope = $rootScope.$new();
//             controller = $controller('LoginController', {
//                 $scope: scope
//             });

//             $httpBackend.expect('GET', '/favicon.ico').respond(200, '');


//             // Initialisation des tests avec une Operation en mémoire
//             //$httpBackend.expectGET('/api/user').respond(200, [UserDefault])

//             $httpBackend.expectGET('app/components/login/loginView.html').respond(200, '');
//             // $httpBackend.expectGET('/api/category').respond(200, '');

//             // $httpBackend.expectGET('/api/category').respond(200, defaultCat);


//             $httpBackend.flush();
//         }));

//        it('should add User', function() {
           
//             $httpBackend.expect('POST', '/api/user').respond(200, '');

//             var UserDefault = {
//                 _id: "54feed0a3612a53c11bb33b5",
//                 //clientID: 123456,
//                 username: "test user",
//                 lastName: "test user",
//                 firstName: "test user",
//                 email: "test@test.com",
//                 password: "test", // TODO Add salt ??
//                 token: "token test"
//             }
            
            
//             scope.SignupController(UserDefault);
//             $httpBackend.flush();
//      });



//        it('should test routeProvider', function() {
                 

//                 $httpBackend.expect('POST', '/api/authenticate').respond(200, '');
                    
//                 //expect($state.current.templateUrl).toBe('app/components/login/loginView.html');


//             var User = {
//                 username: "test user",
//                 password: "test", // TODO Add salt ??   
//             }

                
//                 scope.signin(User);
//                 $httpBackend.expect('GET', 'app/components/accounts/accountsView.html').respond(200, '');
//                 $httpBackend.flush();
//               });


//     });
// });
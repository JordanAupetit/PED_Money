// describe('OperationTest', function() {
//     beforeEach(module('appModule'));
//     beforeEach(module('services'));

//     var defaultCat = [
//         {
//             "name": "Shooping",
//             "id": 100,
//             "subCategories": [{
//                 "name": "Food",
//                 "id": 101
//             }, {
//                 "name": "Clothes",
//                 "id": 102
//             }, {
//                 "name": "Gifts",
//                 "id": 103
//             }]
//         }, {
//             "name": "Loisir",
//             "id": 200,
//             "subCategories": [{
//                 "name": "Football",
//                 "id": 201
//             }, {
//                 "name": "Cinema",
//                 "id": 202
//             }, {
//                 "name": "Others",
//                 "id": 299
//             }]
//         }, {
//             "name": "Others",
//             "id": 300,
//             "subCategories": [{
//                 "name": "Pets",
//                 "id": 301
//             }]
//         }
//     ]

//     var $controller;
//     var $httpBackend;
//     var scope;
//     var initService;

//     beforeEach(inject(function(_$controller_, _initService_) {
//         // The injector unwraps the underscores (_) from around the parameter names when matching
//         $controller = _$controller_;
//         initService = _initService_;
//     }));

//     describe('should success any functions', function() {
//         var $scope, controller;

//         beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, initService) {
//             $httpBackend = _$httpBackend_;
//             scope = $rootScope.$new();
//             controller = $controller('OperationController', {
//                 $scope: scope
//             });

//             initService.initRessources('fakeToken')


//             // Initialisation des tests avec une Operation en mémoire
//             $httpBackend.expectGET('/api/account/operation').respond(200, [{
//                 _id: "2132sdq0sq",
//                 value: -50,
//                 thirdParty: "Auchan",
//                 description: "Règlement des courses",
//                 type: "Chèque",
//                 checked: false,
//                 dateOperation: "2015-01-20",
//                 datePrelevement: "2015-01-25",
//                 categoryId: "54684654dqs",
//                 subOperations: [],
//                 accountId: "sddqs1123sqd"
//             }]);

//             $httpBackend.expectGET('app/components/login/loginView.html').respond(200, '');
//             // $httpBackend.expectGET('/api/category').respond(200, '');

//             $httpBackend.expectGET('/api/category').respond(200, defaultCat);
//             $httpBackend.expect('GET', '/api/account').respond(200, '');

//             $httpBackend.flush();
//         }));

//         it('test initialisation of controller', function() {
//             expect(scope.operations.length).toBe(1);
//         });

//         it('test delete operation', function() {

//             $httpBackend.expect('DELETE', '/api/operation/' + '2132sdq0sq').respond(200, '');

//             scope.deleteOperation("2132sdq0sq", 0);

//             expect(scope.operations.length).toBe(1);
//             $httpBackend.flush();
//             expect(scope.operations.length).toBe(0);
//         });

//         it('test validate & update operation', function() {

//             $httpBackend.expect('PUT', '/api/operation').respond(200, '');
//             $httpBackend.expect('PUT', '/api/operation').respond(200, '');
//             $httpBackend.expectGET('/api/account/operation').respond(200, [{
//                 _id: "2132sdq0sq",
//                 value: -50,
//                 thirdParty: "Auchan",
//                 description: "Règlement des courses",
//                 type: "Chèque",
//                 checked: true,
//                 dateOperation: "2015-01-20",
//                 datePrelevement: "2015-01-25",
//                 categoryId: "54684654dqs",
//                 subOperations: [],
//                 accountId: "sddqs1123sqd"
//             }]);
//             $httpBackend.expectGET('/api/category').respond(200, defaultCat);
//             $httpBackend.expect('GET', '/api/account').respond(200, '');

//             scope.validateOperation(scope.operations[0]);
//             scope.updateOperation(scope.operations[0]);

//             $httpBackend.flush();
//         });

//         it('test add operation', function() {

//             $httpBackend.expect('POST', '/api/operation').respond(200, '');

//             scope.operationCreateModel = {
//                 _id: "d1sqe4za6",
//                 value: 601,
//                 thirdParty: "Leclerc",
//                 description: "Règlement des courses",
//                 type: "Carte bleue",
//                 checked: false,
//                 dateOperation: "2015-01-10",
//                 datePrelevement: "2015-01-10",
//                 categoryId: "54684654dqs",
//                 subOperations: [],
//                 accountId: "sddqs1123sqd"
//             }

//             scope.addOperation()

//             $httpBackend.expectGET('/api/account/operation').respond(200, [{
//                 _id: "2132sdq0sq",
//                 value: -50,
//                 thirdParty: "Auchan",
//                 description: "Règlement des courses",
//                 type: "Chèque",
//                 checked: false,
//                 dateOperation: "2015-01-20",
//                 datePrelevement: "2015-01-25",
//                 categoryId: "54684654dqs",
//                 subOperations: [],
//                 accountId: "sddqs1123sqd"
//             }, {
//                 _id: "d1sqe4za6",
//                 value: 601,
//                 thirdParty: "Leclerc",
//                 description: "Règlement des courses",
//                 type: "Carte bleue",
//                 checked: false,
//                 dateOperation: "2015-01-10",
//                 datePrelevement: "2015-01-10",
//                 categoryId: "54684654dqs",
//                 subOperations: [],
//                 accountId: "sddqs1123sqd"
//             }]);

//             $httpBackend.expectGET('/api/category').respond(200, defaultCat);
//             $httpBackend.expect('GET', '/api/account').respond(200, '');

//             expect(scope.operations.length).toBe(1);
//             $httpBackend.flush();
//             expect(scope.operations.length).toBe(2);
//         });
//     });
// });
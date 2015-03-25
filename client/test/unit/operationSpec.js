describe('OperationTest', function() {
    beforeEach(module('appModule'));
    beforeEach(module('services'));

    var defaultCat = [
        {
            "name": "Shooping",
            "id": 100,
            "subCategories": [{
                "name": "Food",
                "id": 101
            }, {
                "name": "Clothes",
                "id": 102
            }, {
                "name": "Gifts",
                "id": 103
            }]
        }, {
            "name": "Loisir",
            "id": 200,
            "subCategories": [{
                "name": "Football",
                "id": 201
            }, {
                "name": "Cinema",
                "id": 202
            }, {
                "name": "Others",
                "id": 299
            }]
        }, {
            "name": "Others",
            "id": 300,
            "subCategories": [{
                "name": "Pets",
                "id": 301
            }]
        }
    ]

    var operation1 = {
        _id: "2132sdq0sq",
        value: -50,
        thirdParty: "Auchan",
        description: "Règlement des courses",
        type: "Chèque",
        checked: false,
        dateOperation: "2015-01-20",
        datePrelevement: "2015-01-25",
        categoryId: "54684654dqs",
        subOperations: [],
        accountId: "5511967b22b1db1c028cdbf8"
    }

    var account = {
    	_id: "5511967b22b1db1c028cdbf8",
    	currency: "EUR",
		name: "Mon compte à moi !",
		type: 1,
		userId: "5511966622b1db1c028cdbf7",
    	operations: 
    	[
    		operation1
    	]
    }
    
    //var account = {"operations":[{"_id":"5511969322b1db1c028cdbf9","accountId":"5511967b22b1db1c028cdbf8","value":123,"categoryId":508,"dateOperation":"2015-03-24T00:00:00.000Z","datePrelevement":"2015-03-25T00:00:00.000Z","__v":0,"checked":true,"type":"credit card","thirdParty":"Auchan","description":"C'est ma description","subOperations":[]},{"_id":"5511a4bd22b1db1c028cdbfb","value":123,"accountId":"5511967b22b1db1c028cdbf8","categoryId":508,"dateOperation":"2015-03-24T00:00:00.000Z","datePrelevement":"2015-03-25T00:00:00.000Z","checked":true,"type":"credit card","thirdParty":"Auchan","description":"C'est ma description","__v":0,"subOperations":[]},{"_id":"5511a90045d7d6981b3d34c8","dateOperation":"2015-01-31T23:00:00.000Z","datePrelevement":"2015-01-31T23:00:00.000Z","description":"Paye","value":1200,"accountId":"5511967b22b1db1c028cdbf8","__v":0,"subOperations":[]},{"_id":"5511a90045d7d6981b3d34c9","categoryId":106,"dateOperation":"2015-01-31T23:00:00.000Z","datePrelevement":"2015-01-31T23:00:00.000Z","description":"loyer","value":-300,"accountId":"5511967b22b1db1c028cdbf8","__v":0,"subOperations":[]},{"_id":"5511a90045d7d6981b3d34ca","categoryId":102,"dateOperation":"2015-02-09T23:00:00.000Z","datePrelevement":"2015-02-09T23:00:00.000Z","description":"Electricité","value":-80,"accountId":"5511967b22b1db1c028cdbf8","__v":0,"subOperations":[]},{"_id":"5511a90045d7d6981b3d34cb","categoryId":201,"dateOperation":"2015-02-26T23:00:00.000Z","datePrelevement":"2015-02-26T23:00:00.000Z","description":"Souris","type":"credit card","thirdParty":"Materiel.net","value":-70,"accountId":"5511967b22b1db1c028cdbf8","__v":0,"subOperations":[]},{"_id":"5511a90045d7d6981b3d34cc","categoryId":301,"dateOperation":"2015-02-14T23:00:00.000Z","datePrelevement":"2015-02-14T23:00:00.000Z","description":"","type":"credit card","thirdParty":"Sosh","value":-20,"accountId":"5511967b22b1db1c028cdbf8","__v":0,"subOperations":[]},{"_id":"5511a90045d7d6981b3d34cd","categoryId":302,"dateOperation":"2015-02-04T23:00:00.000Z","datePrelevement":"2015-02-04T23:00:00.000Z","description":"","type":"credit card","thirdParty":"Numericable","value":-18,"accountId":"5511967b22b1db1c028cdbf8","__v":0,"subOperations":[]},{"_id":"5511a90045d7d6981b3d34ce","categoryId":402,"dateOperation":"2015-02-18T23:00:00.000Z","datePrelevement":"2015-02-18T23:00:00.000Z","description":"RU","type":"credit card","thirdParty":"CROUS","value":-30,"accountId":"5511967b22b1db1c028cdbf8","__v":0,"subOperations":[]},{"_id":"5511a90045d7d6981b3d34cf","categoryId":704,"dateOperation":"2015-01-28T23:00:00.000Z","datePrelevement":"2015-01-28T23:00:00.000Z","description":"Essence","type":"credit card","thirdParty":"Total","value":-47.58,"accountId":"5511967b22b1db1c028cdbf8","__v":0,"subOperations":[]},{"_id":"5511a90045d7d6981b3d34d0","dateOperation":"2015-02-28T23:00:00.000Z","datePrelevement":"2015-02-28T23:00:00.000Z","description":"Paye","value":1200,"accountId":"5511967b22b1db1c028cdbf8","__v":0,"subOperations":[]},{"_id":"5511a90045d7d6981b3d34d1","categoryId":106,"dateOperation":"2015-02-28T23:00:00.000Z","datePrelevement":"2015-02-28T23:00:00.000Z","value":-300,"accountId":"5511967b22b1db1c028cdbf8","__v":0,"subOperations":[]},{"_id":"5511a90045d7d6981b3d34d2","categoryId":102,"dateOperation":"2015-03-09T23:00:00.000Z","datePrelevement":"2015-03-09T23:00:00.000Z","value":-80,"accountId":"5511967b22b1db1c028cdbf8","__v":0,"subOperations":[]},{"_id":"5511a90045d7d6981b3d34d4","categoryId":301,"dateOperation":"2015-03-14T23:00:00.000Z","datePrelevement":"2015-03-14T23:00:00.000Z","description":"","type":"credit card","thirdParty":"Sosh","value":-20,"accountId":"5511967b22b1db1c028cdbf8","__v":0,"subOperations":[]},{"_id":"5511a90045d7d6981b3d34d6","categoryId":402,"dateOperation":"2015-03-09T23:00:00.000Z","datePrelevement":"2015-03-09T23:00:00.000Z","description":"RU","type":"credit card","thirdParty":"CROUS","value":-30,"accountId":"5511967b22b1db1c028cdbf8","__v":0,"subOperations":[]},{"_id":"5511a90045d7d6981b3d34d5","categoryId":302,"dateOperation":"2015-03-04T23:00:00.000Z","datePrelevement":"2015-03-04T23:00:00.000Z","description":"","type":"credit card","thirdParty":"Numericable","value":-18,"accountId":"5511967b22b1db1c028cdbf8","__v":0,"subOperations":[]},{"_id":"5511a90045d7d6981b3d34d3","categoryId":207,"dateOperation":"2015-03-17T23:00:00.000Z","datePrelevement":"2015-03-17T23:00:00.000Z","description":"concert","type":"credit card","thirdParty":"Barbey","value":-48,"accountId":"5511967b22b1db1c028cdbf8","__v":0,"subOperations":[]},{"_id":"5511a90045d7d6981b3d34d7","categoryId":704,"dateOperation":"2015-03-07T23:00:00.000Z","datePrelevement":"2015-03-07T23:00:00.000Z","description":"Essence","type":"credit card","thirdParty":"Total","value":-80,"accountId":"5511967b22b1db1c028cdbf8","__v":0,"subOperations":[]}],"balance":1258.42,"_id":"5511967b22b1db1c028cdbf8","name":"Mon compte à moi !","currency":"EUR","type":1,"userId":"5511966622b1db1c028cdbf7","__v":0,"alerts":[{"level":0,"message":"Your balance is under 0 !","_id":"5511937022b1db1c028cdbf6"}]};

    var $controller;
    var $httpBackend;
    var scope;
    var initService;

    var StorageServices
    var OperationResource
    var AccountResource 
    var periodRes
    var $state

    beforeEach(inject(function(_$controller_, _initService_, _StorageServices_, _OperationResource_, _AccountResource_, _$state_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        initService = _initService_;

        StorageServices = _StorageServices_;
        OperationResource = _OperationResource_;
        AccountResource = _AccountResource_;
        //periodRes = _periodRes_;
        $state = _$state_;
    }));

    describe('should success any functions', function() {
        var $scope, controller;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, initService, OperationResource, AccountResource, StorageServices, $state) {
            $httpBackend = _$httpBackend_;

            //var $injector = angular.injector([ 'appModule' ]);
            //var myService = $injector.get( 'StorageServices' );
            //myService.getAccount();

            //$httpBackend.expect('GET', '/favicon.ico').respond(200, '');
            //$httpBackend.expectGET('app/components/login/loginView.html').respond(200, '');

            //StorageServices.getAccount("5511967b22b1db1c028cdbf8", function(){})

            /*var AccountResource = {
			    get: function(accountId) {}
			};*/

			//var fn = jasmine.createSpy();
            scope = $rootScope.$new();

			//spyOn(account, account2);
			//spyOn(StorageServices, 'getAccount').and.callThrough();
			//spyOn(AccountResource, 'get').andReturn({});
			// spyOn(AccountResource, 'get');

            // $httpBackend.whenGET('app/components/accounts/accountsView.html').respond(200, '');
			// $httpBackend.expect('GET', '/favicon.ico').respond(200, '');
            // $httpBackend.expectGET('app/components/login/loginView.html').respond(200, '');
            //$httpBackend.expectGET('/api/account/5511967b22b1db1c028cdbf8').respond(200, account2);
            // $httpBackend.expectGET('/api/account').respond(200, account2);


            //console.log(spyOn(StorageServices, 'getAccount').and)

            StorageServices.getAccount = function(id, callback){
                callback(account)
            }
            
            spyOn(StorageServices, 'getAccount').and.callThrough()

            spyOn(StorageServices, 'getUser').and.returnValue({categories: []})

            //console.log(account)


            controller = $controller('OperationController', {
                $scope: scope//,
                //StorageServices: StorageServices
                //accountId: "5511967b22b1db1c028cdbf8"
            });
            
            $httpBackend.expect('GET', '/favicon.ico').respond(200, '');
            $httpBackend.expectGET('app/components/login/loginView.html').respond(200, '');
            $httpBackend.flush();

        }));

        it('test initialisation of controller', function() {
            expect(scope.account.operations.length).toBe(1);
        });

        it('test delete operation', function() {

            $httpBackend.expect('DELETE', '/api/operation/' + '2132sdq0sq').respond(200, '');

            scope.deleteOperation(operation1, 0);

            expect(scope.account.operations.length).toBe(1);
            $httpBackend.flush();
            expect(scope.account.operations.length).toBe(0);
        });

        it('test validate & update operation', function() {

            $httpBackend.expect('PUT', '/api/operation').respond(200, '');
            $httpBackend.expect('PUT', '/api/operation').respond(200, '');

            scope.validateOperation(operation1);

            StorageServices.getAccount = function(id, callback){
                callback(account)
            }
            spyOn(StorageServices, 'getAccount').and.callThrough()

            scope.updateOperation(operation1);

            $httpBackend.flush();
        });

        it('test add operation', function() {

            $httpBackend.expect('POST', '/api/operation').respond(200, '');

            var operation2 = {
                _id: "d1sqe4za6",
                value: 601,
                thirdParty: "Leclerc",
                description: "Règlement des courses",
                type: "Carte bleue",
                checked: false,
                dateOperation: "2015-01-10",
                datePrelevement: "2015-01-10",
                categoryId: "54684654dqs",
                subOperations: [],
                accountId: "sddqs1123sqd"
            }

            scope.addOperation()

            scope.account.operations.push(operation2)

            expect(scope.account.operations.length).toBe(1);

            $httpBackend.flush();
            scope.account.operations.push(operation2)

            expect(scope.account.operations.length).toBe(2);
        });
    });
});
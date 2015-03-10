describe('UNIT::Account', function() {
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

    var accountDefault = {
        _id: "54feed0a3612a53c11bb33b5",
        name: "test",
        type: 1,
        currency: "EUR"
    }

    var $controller;
    var $httpBackend;
    var scope;
    var initService;

    beforeEach(inject(function(_$controller_, _initService_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        initService = _initService_;
    }));

    describe('Controller', function() {
        var $scope, controller;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, initService) {
            $httpBackend = _$httpBackend_;
            initService.initRessources('fakeToken')

            scope = $rootScope.$new();
            controller = $controller('AccountController', {
                $scope: scope
            });


            // Initialisation des tests avec une Operation en mémoire
            $httpBackend.expectGET('/api/account').respond(200, [accountDefault])

            // $httpBackend.expectGET('app/components/login/loginView.html').respond(200, '');
            // $httpBackend.expectGET('/api/category').respond(200, '');

            // $httpBackend.expectGET('/api/category').respond(200, defaultCat);


            $httpBackend.flush();
        }));

        it('should initialise of controller', function() {

            expect(scope.accounts.length).toBe(1);
        });

        it('should delete account', function() {

            $httpBackend.expect('DELETE', '/api/account/' + '54feed0a3612a53c11bb33b5').respond(200, '');
            $httpBackend.expectGET('/api/account').respond(200, [])

            scope.deleteAccount('54feed0a3612a53c11bb33b5');

            expect(scope.accounts.length).toBe(1);
            $httpBackend.flush();
            expect(scope.accounts.length).toBe(0);
        });

        it('should update account', function() {

            $httpBackend.expect('PUT', '/api/account').respond(200, '');

            scope.updateAccount(scope.accounts[0]);

            $httpBackend.flush();
        });

        it('should add account', function() {

            $httpBackend.expect('POST', '/api/account').respond(200, '');

            var accountModel = {
                _id: "bb335a53c11b54feed0a3612",
                name: "test 2",
                type: 2,
                currency: "USD"
            }

            scope.accountForm = {
                $valid: true
            }

            spyOn(scope, 'resetForm');

            scope.addAccount(accountModel)

            $httpBackend.expectGET('/api/account').respond(200, 
                [
                    accountDefault, 
                    accountModel
                ]);

            expect(scope.accounts.length).toBe(1);
            $httpBackend.flush();
            expect(scope.accounts.length).toBe(2);
        });

        it('should not add invalid account', function() {

            var accountModel = {
                _id: "bb335a53c11b54feed0a3612",
                name: "test 2",
                type: 2,
                currency: undefined
            }

            scope.accountForm = {
                $valid: false
            }

            scope.addAccount(accountModel)
           
            expect(scope.accounts.length).toBe(1);

        });


        it('should reset account form', function() {
            scope.accountCreateModel = {
                foo:'bar'
            }
            scope.closeRightMenu = function(){}
            scope.accountForm = {
                $setPristine: function(){},
                $setUntouched: function(){}
            }

            scope.resetForm();

            expect(scope.accountCreateModel).toEqual({})
        });


        it('should switch to edit account', function() {
            scope.showUpdateAccount(scope.accounts[0]);

            expect(scope.editable).toBe.true
            expect(scope.accounts[0].currency).toEqual({ name: 'EUR(€)', code: 'EUR', value: 'EUR' })
            expect(scope.accounts[0].type).toEqual({ name: 'Banking', value: 1 })
        });
    });
});
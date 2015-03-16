describe('UNIT::AccountSettings', function() {
    beforeEach(module('appModule'));
    beforeEach(module('services'));

    var accountDefault = {
        _id: "5501a2d78fa2f1fc1582c1ed",
        alerts: [
            {
                message: "Alert 1 !", level: 1, _id: "5501a3cfbd878d280b2f8c03"
            }
        ],
        balance: 0,
        currency: "EUR",
        name: "Compte courrant",
        type: 3,
        userId: "5501a2778fa2f1fc1582c1ea",
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

    describe('accountSettingsController', function() {
        var $scope, controller;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, initService) {
            $httpBackend = _$httpBackend_;
            initService.initRessources('fakeToken')

            scope = $rootScope.$new();
            controller = $controller('AccountSettingsController', {
                $scope: scope
            });


            // Initialisation des tests avec une Operation en mémoire
            $httpBackend.whenGET('/api/account').respond(200, accountDefault)
            $httpBackend.whenGET('app/components/login/loginView.html').respond(200, '');

            //$httpBackend.flush()

            $httpBackend.expectGET('/api/account')
        }));

/*
        it('should initialise of controller', function() {
            expect(scope.account).not.to.be.null
            expect(scope.account).not.to.be.undefined
        });
*/

        it('should rebalance the account', function(){
     /*       $httpBackend.expect('POST', '/api/operation').respond(200, '')
            

            scope.rebalance = scope.account.balance + 150
            scope.rebalanceAccount()
            
            $httpBackend.flush()
       */     
        })

        it('should update the account informations', function(){

        })

        it('should delete the account', function(){

        })
        /*

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
*/
    });
});
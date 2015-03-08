// initService.js
(function() {
	'use strict';

	angular.module('services')
		.factory('initService', ['$log', 'periodService', 'AccountResource', 'OperationResource',  'LoginService', initService])

	function initService($log, periodService, accountRes, operationRes, signupRes, loginRes) {

		return {
			initRessources: function(token){
				accountRes.init(token)
			},
			populatePeriod: function() {
				periodService.init()
			},
			populateAccount: function() {
				var acc1 = {
					name: 'loisir',
					type: 'type 1',
					balance: 23456,
					currency: 'EUR(€)',
					userId: 'paul'
				}

				var acc2 = {
					name: 'course',
					type: 'type 2',
					balance: 3543,
					currency: 'USD($)',
					userId: 'paul'
				}

				accountRes.add(acc1)
				accountRes.add(acc2)
			},
			populateOperation: function(accountId) {
				var op1 = {
					value: -50,
					thirdParty: 'Auchan',
					description: 'Règlement des courses',
					type: 'Chèque',
					checked: false,
					dateOperation: '2015-01-20',
					datePrelevement: '2015-01-25',
					// dateOperation: new Date(2015, 0, 20),
					// datePrelevement: new Date(2015, 0, 25),
					categoryId: '54684654dqs',
					subOperations: [],
					accountId: accountId
				}

				var op2 = {
					value: 100,
					thirdParty: 'Maman',
					description: 'Argent de poche',
					type: 'Virement',
					checked: true,
					dateOperation: '2015-01-01',
					datePrelevement: '2015-01-12',
					// dateOperation: new Date(2015, 0, 1),
					// datePrelevement: new Date(2015, 0, 12),
					categoryId: 'eza5484654dqs',
					subOperations: [],
					accountId: accountId
				}


				operationRes.add(op1)
				operationRes.add(op2)
			},
			loadDataset1 : function(){
				var user = {
					name: 'asagaya',
					first: 'Marc',
					last: 'Robin',
					mail: 'marc.robin@yopmail.com',
					pass: 'azeaze'
				}

				var acc1 = {
					name: 'Compte courant',
					type: 'type 1',
					balance: 1024,
					currency: 'EUR(€)',
					userId: undefined // to set
				}

				var op1 = {
					value: -50,
					thirdParty: 'Auchan',
					description: 'Règlement des courses',
					type: 'CB',
					checked: false,
					dateOperation: '2015-01-20',
					datePrelevement: '2015-01-25',
					categoryId: '54684654dqs',
					subOperations: [],
					accountId: undefined // to set
				}


				return new Promise(function(resolve, reject) {


					// signupRes.save(user).$promise.then(function(res){
					// 	$log.info(res.data)

						//login
						var formData = {
	                        username: user.name,
	                        password: user.pass
	                    }

	                    loginRes.query(formData).$promise.then(function(res){
							$log.info(res.data)
							var userId = res.data._id

							// Add account
							acc1.userId = userId
							accountRes.add(acc1, function(res){
								$log.info(res)
								var accountId = res._id

								// Add operations
								op1.accountId = accountId
								operationRes.add(op1)

								resolve()

							})
	                    })

					// })

				})
				


			}


		}
	}
})()
// initService.js
(function() {
	'use strict';

	angular.module('services')
		.factory('initService', ['$log', 'periodRessource', 'AccountResource', 'OperationResource', 'LoginService', 'budgetService', 'analysisService', initService])


	function initService($log, periodRes, accountRes, operationRes, loginRes, budgetRes, analysisRes) {

		return {
			initRessources: function(token){
				// console.log('initRessources')
				periodRes.init(token)
				accountRes.init(token)
				// categoryRes.init(token)
				budgetRes.init(token)
				analysisRes.init(token)
			},
			populatePeriod: function() {
				var p1 = {
					_id: 2,
					name: 'Loyer',
					dateBegin: '2015-01-15',
					nbRepeat: -1,
					step: 3,
					intervalType: 'M',
					amount: 300
				}

				var p2 = {
					_id: 1,
					name: 'Zebulon',
					dateBegin: new Date(2015, 1, 13),
					nbRepeat: 4,
					step: 1,
					intervalType: 'M',
					amount: 52
				}

				var p3 = {
					_id: 3,
					name: 'Essence',
					dateBegin: new Date(2015, 1, 2),
					nbRepeat: -1,
					step: 1,
					intervalType: 'w',
					amount: 20
				}
				
				return new Promise(function(resolve, reject) {
					periodsRes.add(p1).$promise.then(function(){
						periodsRes.add(p2).$promise.then(function(){
							periodsRes.add(p3).$promise.then(function(){
								resolve()
							})
						})
					})
				})
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
			},
			loadDataset : function(dataset, accountId){
				return new Promise(function(resolve, reject) {

					// Add operations
					angular.forEach(dataset.operations, function(operation){
						operation.accountId = accountId
						operation.dateOperation = moment(operation.dateOperation, 'YYYY/MM/DD').toDate()
						operation.datePrelevement = moment(operation.datePrelevement, 'YYYY/MM/DD').toDate()
						operationRes.add(operation)
					})
					resolve()
				})
			}
		}
	}
})()
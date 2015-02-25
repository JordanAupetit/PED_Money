// initService.js
(function() {
	'use strict';

	angular.module('services')
		.factory('initService', ['periodService', 'AccountResource', 'OperationResource', initService])

	function initService(periodService, accountRes, operationRes) {

		return {
			populatePeriod: function() {
				periodService.init()
			},
			populateAccount: function() {
				var acc1 = {
					name: "loisir",
					type: "type 1",
					balance: 23456,
					currency: "EUR(€)",
					userId: "paul"
				}

				var acc2 = {
					name: "course",
					type: "type 2",
					balance: 3543,
					currency: "USD($)",
					userId: "paul"
				}

				accountRes.add(acc1)
				accountRes.add(acc2)
			},
			populateOperation: function(accountId) {
				var op1 = {
					value: -50,
					thirdParty: "Auchan",
					description: "Règlement des courses",
					type: "Chèque",
					checked: false,
					dateOperation: "2015-01-20",
					datePrelevement: "2015-01-25",
					// dateOperation: new Date(2015, 0, 20),
					// datePrelevement: new Date(2015, 0, 25),
					categoryId: "54684654dqs",
					subOperations: [],
					accountId: accountId
				}

				var op2 = {
					value: 100,
					thirdParty: "Maman",
					description: "Argent de poche",
					type: "Virement",
					checked: true,
					dateOperation: "2015-01-01",
					datePrelevement: "2015-01-12",
					// dateOperation: new Date(2015, 0, 1),
					// datePrelevement: new Date(2015, 0, 12),
					categoryId: "eza5484654dqs",
					subOperations: [],
					accountId: accountId
				}


				operationRes.add(op1)
				operationRes.add(op2)
			}
		}
	}
})()
// periodService.js
(function() {
	'use strict';

	angular.module('services')
		.factory('periodRessource', ['$resource', function($resource) {
			var periodsRes
			var periodsAccountRes

			return {
				init: function(userToken) {
					periodsRes = $resource('/api/period/:id', {}, {
						get: {
							method: 'GET', 
							headers:{'X-User-Token': userToken}
						},
						add: {
							method: 'POST', 
							headers:{'X-User-Token': userToken}
						},
						delete: {
							method: 'DELETE', 
							headers:{'X-User-Token': userToken}
						}
					})
					periodsAccountRes = $resource('/api/account/:accountId/period/', {}, {
						getAll: {
							method: 'GET',
							isArray: true, 
							headers:{'X-User-Token': userToken}
						}
					})
				},
				getAll: function(accountId) {
					return periodsAccountRes.getAll({accountId: accountId})
				},
				add: function(operation) {
					return periodsRes.add(operation)
				},
				remove: function(periodId) {
					return periodsRes.delete({
						id: periodId
					})
				},
				computeNewOpt: function() {

				}

			}
		}])

})();
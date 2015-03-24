// budgetService.js
(function() {
	'use strict';

	angular.module('services')
		.factory('analysisService', ['$resource', 'CategoryResource', function($resource, CategoryRes) {

			var analRes = $resource('/api/analysis', {}, {
				getSolde: {
					method: 'GET',
					isArray: true
				}
			})

			var budgetMonthRes = $resource('/api/budget/month', {}, {
				getAll: {
					method: 'GET',
					isArray: true
				}
			})

			return {
				init: function(userToken){
					// budgetRes = $resource('/api/budget', {}, {
					// 	getAll: {
					// 		method: 'GET',
					// 		isArray: true, 
					// 		headers:{'X-User-Token': userToken}
					// 	}
					// })
				},
				getSolde : function(){
					return new Promise(function(resolve, reject) {
						budgetMonthRes.getAll().$promise.then(function(result){
							var data = []
							angular.forEach(result, function(res){
								data.push([
									moment({ years: res._id.year, months: res._id.month }).unix(),
									res.total *-1
								])
							})
							var solde = {
								id: 1,
								data: data
							}
							// console.log(solde)
							resolve(solde)
						})
						// resolve({
						// 	id: 1,
						// 	data: [
						// 		[1147651200000, 23.15],
						// 		[1147737600000, 23.01],
						// 		[1147824000000, 22.73],
						// 		[1147910400000, 22.83],
						// 		[1147996800000, 22.56],
						// 		[1148256000000, 22.88],
						// 		[1148342400000, 22.79],
						// 		[1148428800000, 23.50],
						// 		[1148515200000, 23.74],
						// 		[1148601600000, 23.72],
						// 		[1148947200000, 23.15],
						// 		[1149033600000, 22.65]
						// 	]
						// })
					})
					// return budgetMonthRes.getAll().$promise
				}
			}
		}])
})();
// budgetService.js
(function() {
	'use strict';

	angular.module('services')
		.factory('analysisService', ['$resource', 'StorageServices', function($resource, StorageServices) {

			var analRes
			var budgetMonthRes

			return {
				init: function(userToken){


					budgetMonthRes = $resource('/api/budget/month', {}, {
						getAll: {
							method: 'GET',
							isArray: true,
							headers:{'X-User-Token': userToken}
						}
					})
					analRes = $resource('/api/analysis', {}, {
						getBalance: {
							method: 'GET',
							isArray: true,
							headers:{'X-User-Token': userToken}	
						}
					})
				},
				getBalance : function(){
					return new Promise(function(resolve, reject) {
						budgetMonthRes.getAll().$promise.then(function(result){
							var data = []
							angular.forEach(result, function(res){
								data.push([
									moment.utc({ years: res._id.year, months: res._id.month }).valueOf(),
									res.total *-1
								])
							})
							var solde = {
								id: 1,
								data: data.sort()
							}
							console.log(solde)
							resolve(solde)
						})
					})
				},
				getByMonth: function(){
					return new Promise(function(resolve, reject) {
						budgetMonthRes.getAll().$promise
							.then(function(budget){
								var years = {}
								angular.forEach(budget, function(month){
									if(years[month._id.year+' '] === undefined){
										years[month._id.year+' '] = [0,0,0,0,0,0,0,0,0,0,0,0]
									}
									years[month._id.year+' '][month._id.month-1] = month.total *-1

								})

								var res = []
								angular.forEach(years, function(year, key){
									res.push({
										name: key,
										data: year
									})
								})

								resolve(res)
						})
					})
				}
			}
		}])
})();
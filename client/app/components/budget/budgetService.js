// budgetService.js
(function() {
	'use strict';

	angular.module('services')
		.factory('budgetService', ['$resource', function($resource) {


			var budgetRes = $resource('/api/budget/:id', {}, {
				getAll: {
					method: 'GET',
					isArray: true
				},
				get: {
					method: 'GET'
				},
				add: {
					method: 'POST'
				},
				delete: {
					method: 'DELETE'
				}
			})

			var accountValues


			return {
				// init: function() {
				// 	return new Promise(function(resolve, reject) {
				// 		periodsRes.add(p1).$promise.then(function(){
				// 			periodsRes.add(p2).$promise.then(function(){
				// 				periodsRes.add(p3).$promise.then(function(){
				// 					resolve()
				// 				})
				// 			})
				// 		})
				// 	})
					
				// },

				getAll: function() {
					return budgetRes.getAll()
				},
				add: function(operation) {
					return budgetRes.add(operation)
				},
				remove: function(budgetId) {
					return budgetRes.delete({
						id: budgetId
					})
				},
				getExpense: function(year, month){
					if(month === undefined){
						var tmp = 0

						for(var i = 0; i <12; i++){
							if(accountValues[i+year*12-1] !== undefined){
								tmp += accountValues[i+year*12-1]
							}
						}
						return tmp
					}else{
						return accountValues[month+year*12-1]
					}
				},
				genData : function(startDate){
					var current = moment(startDate)
					var end = moment() //.format('YYYY-MM-DD')


					function random(min,max){
						return Math.floor(Math.random()*(max-min+1)+min);
					}

					// generate fake value 
					if(accountValues === undefined){
						accountValues = []
						var diffMonth = Math.ceil(end.diff(current, 'months', true))
						for(var i = 0;i<diffMonth;i++){
							accountValues.push(random(500,1500))
						}
					}
					


					var years = []

					// while(current.year() !== end.year()){
					while(current.year() !== end.year()+1){
						var months = []
						var year = current.year()
						for(var i = 0;i<12;i++){
							months.push(
								{
									id: current.month()+1, 
									name: current.format('MMMM'),
									isActive: false
								}
							)
							current.add(1,'months')
						}
						months.push(
							{
								id: 13,
								name : 'All year',
								isActive: false
							}
						)
						years.push(
						{
							year: year,
							months: months,
							isActive: false
						})
					}

					// var diffMonth = Math.ceil(end.diff(current, 'months', true))

					// var months = []
					// for(var i = 0;i<diffMonth;i++){
					// 	months.push(
					// 		{
					// 			id: current.month()+1, 
					// 			name: current.format('MMMM'),
					// 			isActive: false
					// 		}
					// 	)
					// 	current.add(1,'months')
					// }
					// years.push(
					// 	{
					// 		year: current.year(),
					// 		months: months,
					// 		isActive: false
					// 	}
					// )
					
					// $scope.months = months
					return years
				}
			}
		}])
})();
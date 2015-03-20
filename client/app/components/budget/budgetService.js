// budgetService.js
(function() {
	'use strict';

	angular.module('services')
		.factory('budgetService', ['$resource', 'CategoryResource', function($resource, CategoryRes) {


			var budgetRes
			var budgetCatRes

			var budgetMonthRes = $resource('/api/budget/month', {}, {
				getAll: {
					method: 'GET',
					isArray: true
				}
			})

			var expenseRes = $resource('/api/expense/:year/:month', {}, {
				getAll: {
					method: 'GET',
					isArray: true
				}
			})

			

			var accountValues
			var categoryDico
			var categoryTree


			return {
				init: function(userToken){
					budgetRes = $resource('/api/budget', {}, {
						getAll: {
							method: 'GET',
							isArray: true, 
							headers:{'X-User-Token': userToken}
						}
					})
					budgetCatRes = $resource('/api/budget/:catId/:value', {}, {
						set: {
							method: 'PUT',
							headers:{'X-User-Token': userToken}
						}
					})
				},
				getBudget: function() {
					return budgetRes.getAll()
				},
				setBudget: function(catId, value){
					return budgetCatRes.set({catId: catId, value, value}).$promise
				},
				// add: function(operation) {
				// 	return budgetRes.add(operation)
				// },
				// remove: function(budgetId) {
				// 	return budgetRes.delete({
				// 		id: budgetId
				// 	})
				// },
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
				getByMonth: function(){

					return new Promise(function(resolve, reject) {
						budgetMonthRes.getAll().$promise
							.then(function(result){
								var evolution = {}
								angular.forEach(result, function(res){ // For each month
									if(evolution[res._id.year] === undefined){
										evolution[res._id.year] = {id: res._id.year}
										for(var monthId=1;monthId < 13;monthId++){ // Create the whole year
											var monthNumb = monthId < 10? '0'+monthId: ''+monthId
											evolution[res._id.year][monthNumb] = {
												total: undefined,
												id: monthNumb,
												name: moment().month(monthId-1).format('MMMM')
											}
										}
										evolution[res._id.year]['13'] = { // 13rd month is the total of the year
												total: 0,
												id: '13',
												name: 'All'
											}
									}
									evolution[res._id.year][res._id.month < 10? '0'+res._id.month: ''+res._id.month].total = res.total
									evolution[res._id.year]['13'].total += res.total

								})
								angular.forEach(evolution, function(year){ // TODO find a iteligent manner
									year.yearGoal = 6000
									year.monthGoal = 500
								})

								// console.log(evolution)
								resolve(evolution)
							})
					})
				},
				getByCategory: function(selector){

					// console.log(selector)

					// function random(min,max){
					// 	return Math.floor(Math.random()*(max-min+1)+min);
					// }

					return new Promise(function(resolve, reject) {
						function parseCategory(){
							return new Promise(function(resolve, reject) {
								categoryDico = {}
								categoryTree = {}

								CategoryRes.getAll().$promise
									.then(function(categories){
									/**
									 * Create dictionary of category
									 * Init operations array
									 * TODO in cache
									 */
									angular.forEach(categories, function(category){
										categoryTree[category.name] = {}
										categoryTree[category.name].id = category.id
										// categoryTree[category.name].total = 0
										categoryDico[category.id] = category
										angular.forEach(category.subCategories, function(subcat){
											categoryDico[subcat.id] = subcat
											categoryTree[category.name][subcat.name] = []
											categoryTree[category.name][subcat.name].id = subcat.id
											// categoryTree[category.name][subcat.name].total = 0
										})
									})	

									resolve()	
								})	
							})				
						}

						if(categoryDico === undefined || categoryTree === undefined ){
							parseCategory().then(function(){
								doIt().then(function(budget){
									resolve(budget)
								})
							})
						}else{
							doIt().then(function(budget){
								resolve(budget)
							})
						}
					})

					

					function doIt(){

						return new Promise(function(resolve, reject) {


							
							// angular.copy(categoryTree, operations)
							// operations = jQuery.extend( {}, categoryTree);

							expenseRes.getAll({year: selector.currentYear, month: parseInt(selector.currentMonth)}).$promise
							.then(function(result){

								var pie = [];
								var pieDrillDown = [];
								var operations = {}

								operations = jQuery.extend(true, {}, categoryTree);

								/**
								 * Tidy the operation by category
								 */
								angular.forEach(result, function(res){
									
									if(res.categoryId !== undefined){
										var groupId = Math.round(res.categoryId/100)*100
										operations[categoryDico[groupId].name][categoryDico[res.categoryId].name].push(res)
									}
								})

								/**
								 * Compute category sum
								 */
								angular.forEach(operations, function(opts, key){
									var groupTotal = 0
									var subData = []
									angular.forEach(opts, function(subOpts, subKey){
										var total = 0
										angular.forEach(subOpts, function(opt){
											total += opt.value
										})
										// subOpts.total = total
										groupTotal += total
										subData.push([subKey, total])
									})
									// opts.total = groupTotal

									pie.push({
										name: key,
										y: groupTotal,
										drilldown: key
									})
									pieDrillDown.push({
										name: key,
										id: key,
										data: subData
									})
								})
								var budget ={
									pie: pie,
									pieDrillDown: pieDrillDown,
									operations: operations
								}
								// console.log(budget)
								resolve(budget)
							})

							

							//  resolve([
							// 	['alimenation', 150.45], 
							// 	['loisir', 28.75], 
							// 	['habitation', 300.25], 
							// 	['habillement', 12.59], 
							// 	['autre', 87.15]
							// ])
						})

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
					console.log(years)
					return years
				}
			}
		}])
})();
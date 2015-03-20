// budgetController.js
(function() {
	'use strict';


	angular.module('controllers')
		.factory('budgetDetailsHelper', function() {
			return {}
		})
		.controller('BudgetDetailsCtrl', ['$scope', 'budgetService', '$modal', '$log', 'budgetHelper2', BudgetDetailsCtrl])

	function BudgetDetailsCtrl($scope, budgetService, $modal, $log, budgetHelper) {

		$scope.categorySelector = {
			currentGroupCat: undefined,
			currentCat: undefined,
			reset: function(){
				this.currentGroupCat = undefined
				this.currentCat = undefined
			}
		}

		$scope.dateSelector = budgetHelper.getDefaultSelector()

		$scope.currentBudget = {
			id: undefined,
			value: undefined,
			reset: function(){
				this.id = undefined
				this.value = undefined
			}
		} 

		function pieCatSelect(name) {
			// console.log(name)
			var subCats = $scope.budgetList[name]
			if (subCats !== undefined) {
				var list = []
				angular.forEach(subCats, function(sub) {
					angular.forEach(sub, function(subsub) {
						list.push(subsub)
					})
				})
				$scope.csOpt = list
				$scope.currentBudget.id = $scope.budgetList[name].id
			} else {
				var truc
				angular.forEach($scope.budgetList, function(cat) {
					angular.forEach(cat, function(subcat, key) {
						if (name === key) {
							truc = subcat
						}
					})	
				})
				// console.log(truc)
				$scope.currentBudget.id = truc.id

				$scope.csOpt = truc
			}

			var bud
			angular.forEach($scope.budgets, function(e,k){
				if(name === e.name){
					bud = e.spread[12].value
				}else{
					angular.forEach(e.subCategories, function(ee,kk){
						if(name === ee.name){
							bud = ee.spread[12].value
						}
					})
				}
			})
			
			$scope.currentBudget.value = bud



			$scope.$apply()
			// console.log($scope.csOpt)
		}


		function getDefaultConfig(){

			return {

				//This is not a highcharts object. It just looks a little like one!
				options: {
					//This is the Main Highcharts chart config. Any Highchart options are valid here.
					//will be ovverriden by values specified below.
					chart: {
						type: 'pie',
						events: {
							drilldown: function(e) {
								$scope.categorySelector.currentGroupCat = e.point.name
									// console.log(e.point.name)
									// pieCatSelect(e.point.name)
							},
							drillup: function(e) {
								$scope.categorySelector.currentCat = $scope.categorySelector.currentGroupCat
								pieCatSelect($scope.categorySelector.currentCat)
							}
						}
					},
					tooltip: {
						// style: {
						// 	padding: 10,
						// 	fontWeight: 'bold'
						// }
						// pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
					},
					// plotOptions: {
					//                 series: {
					//                     borderWidth: 0,
					//                     dataLabels: {
					//                         enabled: true,
					//                         format: '{point.y:.1f}€'
					//                     }
					//                 }
					//             },
					plotOptions: {
						pie: {
							allowPointSelect: true,
							cursor: 'pointer',
							dataLabels: {
								enabled: true,
								// format: '<b>{point.name}</b>: {point.percentage:.1f} %',
								format: '<b>{point.name}</b>: {point.y} €',
								style: {
									color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
								}
							},
							events: {
								click: function(event) {
									// console.log('Click on the pie')
									// console.log(event)
									// console.log(this)
									// console.log(this.data)
									// console.log(this.data[event.point.index].name)
									// event.point.select(true, false)
									// console.log($scope.chartConfig.getHighcharts().getSelectedPoints())

									var catName = this.data[event.point.index].name


									if ($scope.categorySelector.currentGroupCat === undefined) {
										$scope.categorySelector.currentGroupCat = catName
									}


									if ($scope.chartConfig.getHighcharts().getSelectedPoints().length > 0) {

										if ($scope.categorySelector.currentCat === catName) {
											// console.log('case 1: Click on already selected cat in group cat')
											pieCatSelect($scope.categorySelector.currentGroupCat)
											$scope.categorySelector.currentCat = $scope.categorySelector.currentGroupCat
										} else {
											// console.log('case 2: Click on cat in group cat with other selected cat')
											pieCatSelect(catName)
											$scope.categorySelector.currentCat = catName
										}


									} else {
										if ($scope.categorySelector.currentGroupCat === catName) {
											// console.log('case 3: Click on group cat')
											pieCatSelect($scope.categorySelector.currentGroupCat)
											$scope.categorySelector.currentCat = catName
										} else {
											pieCatSelect(catName)
											$scope.categorySelector.currentCat = catName
												// console.log('case 4: Click on cat in group cat')
										}
									}
									// console.log($scope.categorySelector.currentCat)
									// console.log($scope.categorySelector.currentGroupCat)
									$scope.$apply()
								}
							}
						},
						series: {
							borderWidth: 0,
							dataLabels: {
								enabled: true
							}
						}

					},
					legend: {
						enabled: false
					},
					drilldown: {
						animation: true,
						drillUpButton: {
							// relativeTo: 'spacingBox',
							position: {
								y: 0,
								x: 500
							},
							theme: {
								fill: 'white',
								'stroke-width': 1,
								stroke: 'silver',
								r: 0,
								states: {
									hover: {
										// fill: '#bada55'
										fill: '#eeeeee'
									},
									select: {
										stroke: '#039',
										fill: '#bada55'
									}
								}
							}
						},
						series: []
					}
				},
				//The below properties are watched separately for changes.


				//Series object (optional) - a list of series using normal highcharts series options.
				series: [{
					// data: [10, 15, 12, 8, 7]
					data: [
						// ['alimenation', 150.45], 
						// ['loisir', 28.75], 
						// ['habitation', 300.25], 
						// ['habillement', 12.59], 
						// ['autre', 87.15]
					]
				}],
				//Title configuration (optional)
				title: {
					text: ''
				},
				//Boolean to control showng loading status on chart (optional)
				//Could be a string if you want to show specific loading text.
				loading: false,
				//Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
				//properties currentMin and currentMax provied 2-way binding to the chart's maximimum and minimum
				//Whether to use HighStocks instead of HighCharts (optional). Defaults to false.
				useHighStocks: false,
				//size (optional) if left out the chart will default to size of the div or something sensible.
				// size: {
				// 	width: 600,
				// 	height: 400
				// }
				//function (optional)
				// func: function(chart) {
				// 	//setup some logic for the chart

				// }
			};
		}

		$scope.chartConfig = getDefaultConfig()


		function updateGraph() {
			budgetService.getByCategory($scope.dateSelector)
				.then(function(budget) {
					// $scope.chartConfig = getDefaultConfig()
					// $scope.chartConfig.getHighcharts().setChart() // TODO Reset graph state
					// console.log($scope.chartConfig.getHighcharts())
					// $scope.chartConfig.getHighcharts().drillUp()
				    // if ($scope.chartConfig.getHighcharts().drilldownLevels.length > 0) { // CAN'T GET
				    //     $scope.chartConfig.getHighcharts().drillUp();
				    // }

					$scope.chartConfig.series = [{
						name: 'Category',
						colorByPoint: true,
						data: budget.pie
					}]
					
					$scope.chartConfig.options.drilldown.series = budget.pieDrillDown
					$scope.budgetList = budget.operations
					$scope.chartConfig.loading = false



					// angular.forEach($scope.chartConfig.getHighcharts().getSelectedPoints(), function(point){
					// 	point.select(false,false)
					// })

					$scope.categorySelector.reset()
					$scope.currentBudget.reset()
					$scope.csOpt = undefined
					$scope.$apply()


				})
		}

		$scope.validBudget = function(currentBudget){
			budgetService.setBudget(currentBudget.id, currentBudget.value).then(function(){
				budgetService.getBudget()
				.then(function(result) {
					$scope.budgets = result
				})
			})
			
		}



		$scope.changeMonth = function(month) {
			$scope.chartConfig.loading = true
			budgetHelper.changeMonth($scope.dataNav, month, $scope.dateSelector, updateGraph)
		}

		$scope.changeYear = function(year) {
			budgetHelper.changeYear($scope.dataNav, year, $scope.dateSelector)
			$scope.changeMonth($scope.dateSelector.currentMonth)
		}


		$scope.refresh = function() {

			budgetService.getByMonth()
				.then(function(result) {
					var currentDate = moment()
					$scope.dataNav = result
					$scope.dateSelector.setMonth(currentDate.month())
					$scope.changeYear(currentDate.year())
				})
		}

		budgetService.getBudget()
				.then(function(result) {
					$scope.budgets = result
				})

		$scope.refresh()



	}


})();
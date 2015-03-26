// budgetController.js
(function() {
	'use strict';


	angular.module('controllers')
		.factory('budgetDetailsHelper', function() {
			return {}
		})
		.controller('BudgetDetailsCtrl', ['$scope', 'budgetService', '$modal', '$log', 'budgetHelper', BudgetDetailsCtrl])

	function BudgetDetailsCtrl($scope, budgetService, $modal, $log, budgetHelper) {

		$scope.categorySelector = {
			currentGroupCat: undefined,
			currentCat: undefined,
			total: undefined,
			isDrilldown: false,
			reset: function(){
				this.currentGroupCat = undefined
				this.currentCat = undefined
				this.total = undefined
				this.isDrilldown = false
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

			// Compute total of current operation category
			var total = 0
			angular.forEach($scope.csOpt, function(opt){
				total += opt.value
			})
			$scope.categorySelector.total = total *-1



			$scope.$apply()
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
								$scope.categorySelector.currentCat = e.point.name
								pieCatSelect(e.point.name)
								$scope.categorySelector.isDrilldown = true
							},
							drillup: function(e) {
								$scope.categorySelector.currentCat = $scope.categorySelector.currentGroupCat
								pieCatSelect($scope.categorySelector.currentCat)
								$scope.categorySelector.isDrilldown = false
							}
						}
					},
					tooltip: {
					},
					credits: {
						enabled: false
					},
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

									var catName = this.data[event.point.index].name


									if ($scope.categorySelector.currentGroupCat === undefined) {
										$scope.categorySelector.currentGroupCat = catName
									}


									if ($scope.chartConfig.getHighcharts().getSelectedPoints().length > 0) {

										if ($scope.categorySelector.currentCat === catName) {
											pieCatSelect($scope.categorySelector.currentGroupCat)
											$scope.categorySelector.currentCat = $scope.categorySelector.currentGroupCat
										} else {
											pieCatSelect(catName)
											$scope.categorySelector.currentCat = catName
										}


									} else {
										if ($scope.categorySelector.currentGroupCat === catName) {
											pieCatSelect($scope.categorySelector.currentGroupCat)
											$scope.categorySelector.currentCat = catName
										} else {
											pieCatSelect(catName)
											$scope.categorySelector.currentCat = catName
										}
									}
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
								x: 0 // linux 
								// x: 500 //windows
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
					data: []
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
			if($scope.categorySelector.isDrilldown){
				$scope.chartConfig.getHighcharts().drillUp()
			}
			budgetService.getByCategory($scope.dateSelector)
				.then(function(budget) {

					$scope.chartConfig.series = [{
						name: 'Category',
						colorByPoint: true,
						data: budget.pie
					}]
					
					$scope.chartConfig.options.drilldown.series = budget.pieDrillDown
					$scope.budgetList = budget.operations
					$scope.chartConfig.loading = false

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
			$scope.isEdit = false
			
		}

		$scope.showEdit = function(){
			$scope.isEdit = true
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
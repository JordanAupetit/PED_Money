// budgetController.js
(function() {
	'use strict';


	angular.module('controllers')
		.factory('budgetHelper', function() {
			return {
				changeMonth: function(dataYear, month, dateSelector, callback){
					var data = dataYear[dateSelector.currentYear]
					// Active the month
					angular.forEach(data, function(v, k){
						if(angular.isObject(v)){
							v.isActive = false
						}
					})
					data[month].isActive = true


					dateSelector.currentMonth = data[month].id

					if(callback != undefined){
						callback()
					}
				},
				resetMonth : function(data, year){
					// console.log(data[year])
					angular.forEach(data[year], function(v, k){
						if(angular.isObject(v)){
							v.isActive = false
						}
					})
				},
				changeYear: function(data, year, dateSelector){
					this.resetMonth(data, year)

					// Active the year
					angular.forEach(data, function(v){
						v.isActive = false
					})
					data[year].isActive = true

					dateSelector.currentYear = year

					// callback()
				},
				getDefaultSelector: function(){
					return {
						currentYear: undefined,
						currentMonth: undefined,
						setMonth: function(month){
							this.currentMonth = month+1 < 10 ? '0'+(month+1) : ''+(month.month()+1)
						}
					}
				}
			}
		})
		.controller('BudgetCtrl', ['$scope', 'budgetService', '$modal', '$log', 'budgetHelper', BudgetCtrl])


	/**
	 * @Description
	 * The controller of the budget
	 */
	function BudgetCtrl($scope, budgetService, $modal, $log, budgetHelper) {

		function genChartConfig(){
			var chartConfig = {

				//This is not a highcharts object. It just looks a little like one!
				options: {
					//This is the Main Highcharts chart config. Any Highchart options are valid here.
					//will be ovverriden by values specified below.
					chart: {
						type: 'column'
					},
					tooltip: {
						style: {
							padding: 10,
							fontWeight: 'bold'
						}
					},
					credits: {
						enabled: false
					},
					// plotOptions: {
				 //                    series: {
				 //                        borderWidth: 0,
				 //                        dataLabels: {
				 //                            enabled: true,
				 //                            format: '{point.y:,.1f}€'
				 //                        }
				 //                    }
				 //                },
	                legend: {
	                    enabled: false
	                }
				},
				//The below properties are watched separately for changes.


				//Series object (optional) - a list of series using normal highcharts series options.
				// series: [{
				// 	data: [10, 15, 12, 8, 7]
				// }],
				// series: [{
				// 	data: [100]
				// }],
				//Title configuration (optional)
				title: {
					text: ''
				},
				//Boolean to control showng loading status on chart (optional)
				//Could be a string if you want to show specific loading text.
				loading: false,
				//Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
				//properties currentMin and currentMax provied 2-way binding to the chart's maximimum and minimum
				xAxis: {
					// currentMin: 0,
					// currentMax: 20,
					title: {
						text: ''
					},
					categories: [
						'Month expenses'
					]
				},
				yAxis: {
					// currentMin: 400,
					// currentMax: 1500,
					title: {
						text: ''
					},
					// plotLines: [{
					// 	color: '#FF0000',
					// 	dashStyle: 'ShortDash',
					// 	width: 2,
					// 	value: 100,
					// 	zIndex: 0,
					// 	label : {
					// 		text : 'Goal'
					// 	}
					// }]
				},
				//Whether to use HighStocks instead of HighCharts (optional). Defaults to false.
				useHighStocks: false,
				//size (optional) if left out the chart will default to size of the div or something sensible.
				// size: {
				// 	width: 400,
				// 	height: 300
				// }
				//function (optional)
				// func: function(chart) {
				// 	//setup some logic for the chart
				// }
			}

			$scope.chartConfig = chartConfig
		}

		$scope.dateSelector = budgetHelper.getDefaultSelector()


		var defaultData = [
				// {
				// 	name : 'max',
				// 	// data : [1000],
				// 	color: 'rgba(165,170,217,1)',
				// 	pointPadding: 0,
				// 	pointPlacement: 0.15,
				// 	dataLabels: {
			    //                     enabled: true,
			    //                     x: 80,
			    //                     y: 20,
			    //                     color: 'rgba(126,0,0,.9)',	
			    //                     format: '{point.y:,.1f}€'
			    //                 }
				// },
				{
					name : 'expenses',
					// data : [accountValues[month+$scope.currentYear*12-1]],
					data: [[0]],
					color: 'rgba(126,86,134,.9)',
					pointPadding: 0.2,
					pointPlacement: -0.15,
					dataLabels: {
                        enabled: true,
                        format: '{point.y:,.1f}€',
                        inside: true
                    }
				}
			]

		var defaultMaxLine = {
						color: '#FF0000',
						dashStyle: 'ShortDash',
						width: 2,
						value: 100,
						zIndex: 0,
						label : {
							text : 'Goal'
						}
					}

		function getBorn(value){
			var max = value + value/2
			var min = value - value/2
			return {
				min: min,
				max: max
			}
		}

		function updateGraph(){
			if($scope.chartConfig.series === undefined || $scope.chartConfig.series.length !== 1){
				$scope.chartConfig.series = defaultData
				// $scope.chartConfig.yAxis.plotLines = [defaultMaxLine]
				console.log('set defaultData')
			}
			if(($scope.evolution[$scope.dateSelector.currentYear] === undefined 
				|| $scope.evolution[$scope.dateSelector.currentYear][$scope.dateSelector.currentMonth] === undefined) && 
				$scope.dateSelector.currentMonth !== '13'){
				$scope.chartConfig.series = undefined
				// $scope.chartConfig.yAxis.plotLines = undefined
			}else{

				if($scope.dateSelector.currentMonth === '13'){
					var valueYearly = $scope.evolution[$scope.dateSelector.currentYear]['13'].total
					var by = getBorn(valueYearly)

					$scope.chartConfig.yAxis.currentMin = by.min
					$scope.chartConfig.yAxis.currentMax = by.max

					// $scope.chartConfig.series[1].data = [
					// 	[budgetService.getExpense(dateSelector.currentYear)]
					// ]

					// $scope.chartConfig.series[0].data = [
					// 	[12000]
					// ]

					// $scope.chartConfig.series[0].data = [
					// 	[budgetService.getExpense(dateSelector.currentYear)]
					// ]

					$scope.chartConfig.series[0].data[0] = valueYearly

					// $scope.chartConfig.yAxis.plotLines[0].value = $scope.evolution[$scope.dateSelector.currentYear].yearGoal

					

				}else{
					$scope.chartConfig.yAxis.currentMin = 0
					$scope.chartConfig.yAxis.currentMax = 1000
					
					
					// $scope.chartConfig.series[1].data = [
					// 	[budgetService.getExpense(dateSelector.currentYear, dateSelector.currentMonth)]
					// ]
					// $scope.chartConfig.series[0].data = [
					// 	[1000]
					// ]

					// $scope.chartConfig.series[0].data = [
					// 	[budgetService.getExpense(dateSelector.currentYear, dateSelector.currentMonth)]
					// ]

					// $scope.chartConfig.series[0].data = [
					// 	[$scope.evolution[dateSelector.currentYear][dateSelector.currentMonth].total]
					// ]
					$scope.chartConfig.series[0].data[0] = 
						$scope.evolution[$scope.dateSelector.currentYear][$scope.dateSelector.currentMonth].total
					

					// $scope.chartConfig.series[0].data[0] = budgetService.getExpense(dateSelector.currentYear, dateSelector.currentMonth)

					// $scope.chartConfig.yAxis.plotLines[0].value = $scope.evolution[$scope.dateSelector.currentYear].monthGoal

					
				}
			}
		}

		$scope.changeMonth = function(month){
			budgetHelper.changeMonth($scope.evolution, month, $scope.dateSelector, updateGraph)
		}

		$scope.changeYear = function(year){
			budgetHelper.changeYear($scope.evolution, year, $scope.dateSelector)
			$scope.changeMonth($scope.dateSelector.currentMonth)
			// updateGraph()
		}

	
		genChartConfig()

		$scope.evolution = undefined
		$scope.isLoading = true

		budgetService.getByMonth()
		.then(function(result){
			var currentDate = moment()
			$scope.evolution = result
			$scope.dateSelector.setMonth(currentDate.month())
			$scope.changeYear(currentDate.year())
			$scope.isLoading = false

			$scope.$apply()
		})

		var currentDate = moment()

		
		
	}


})();
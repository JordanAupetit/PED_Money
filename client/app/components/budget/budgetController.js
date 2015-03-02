// budgetController.js
(function() {
	'use strict';


	angular.module('controllers')
		.factory('budgetHelper', function() {


			return {
				changeMonth: function(months, month, dateSelector, callback){
					// console.log(months)
					// console.log(month)
					// console.log(currentMonth)
					// console.log(callback)
					// month security
					if(month === undefined || month < 1 ){
						month = 1
					}else if(month > months.length){
						month = months.length
					}


					// Active the month
					angular.forEach(months, function(v){
						v.isActive = false
					})
					months[month-1].isActive = true


					// $scope.monthSelector = $scope.months[month-1].name
					dateSelector.currentMonth = months[month-1].id

					callback()
				},
				resetMonth : function(years, yearPos){
					angular.forEach(years[yearPos].months, function(v){
						v.isActive = false
					})
				},
				changeYear: function(years, year, dateSelector, months/*, callback*/){
					// Find year position
					var yearPos
					angular.forEach(years, function(y, key){
						if(y.year === year){
							yearPos = key
						}
					})

					this.resetMonth(years, yearPos)

					// Active the year
					angular.forEach(years, function(v){
						v.isActive = false
					})
					years[yearPos].isActive = true

					// $scope.yearSelector = years[yearPos].year
					dateSelector.currentYear = yearPos

					months = years[yearPos].months

					// callback()

					return months
				}
			}
		})
		.controller('BudgetCtrl', ['$scope', 'budgetService', '$modal', '$log', 'budgetHelper', BudgetCtrl])


	/**
	 * @Description
	 * The controller of the budget
	 */
	function BudgetCtrl($scope, budgetService, $modal, $log, budgetHelper) {

		$scope.yearSelector = 2014



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
				series: [{
					data: [10, 15, 12, 8, 7]
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
					}
				},
				//Whether to use HighStocks instead of HighCharts (optional). Defaults to false.
				useHighStocks: false,
				//size (optional) if left out the chart will default to size of the div or something sensible.
				size: {
					width: 400,
					height: 300
				}
				//function (optional)
				// func: function(chart) {
				// 	//setup some logic for the chart
				// }
			}

			$scope.chartConfig = chartConfig
		}

		// function genChartConfig2(){
		// 	// $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
		// 	$scope.labels = ['My expense of the month'];
		// 	// $scope.series = ['Series A', 'Series B'];
		// 	$scope.series = ['sss'];

		// 	$scope.data = [
		// 		// [65, 59, 80, 81, 56, 55, 40],
		// 		// [28, 48, 40, 19, 86, 27, 90]
		// 		[28]
		// 	];

		// 	$scope.options = {
		// 		// scaleShowLabels: false,
		// 		responsive: true
		// 	}
		// }

		


		var dateSelector = {
			currentYear: undefined,
			currentMonth: undefined
		}

		var defaultData = [
				{
					name : 'max',
					// data : [1000],
					color: 'rgba(165,170,217,1)',
					pointPadding: 0,
					pointPlacement: 0.15,
					dataLabels: {
                        enabled: true,
                        x: 80,
                        y: 20,
                        color: 'rgba(126,0,0,.9)',	
                        format: '{point.y:,.1f}€'
                    }
				},
				{
					name : 'expenses',
					// data : [accountValues[month+$scope.currentYear*12-1]],
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

		function updateGraph(){
			if($scope.chartConfig.series === undefined || $scope.chartConfig.series.length !== 2){
				$scope.chartConfig.series = defaultData
			}
			if(budgetService.getExpense(dateSelector.currentYear, dateSelector.currentMonth) === undefined && 
				dateSelector.currentMonth !== 13){
				$scope.chartConfig.series = undefined
			}else{

				if(dateSelector.currentMonth === 13){
					$scope.chartConfig.series[1].data = [
						[budgetService.getExpense(dateSelector.currentYear)]
					]

					$scope.chartConfig.series[0].data = [
						[12000]
					]

				}else{
					$scope.chartConfig.series[1].data = [
						[budgetService.getExpense(dateSelector.currentYear, dateSelector.currentMonth)]
					]
					$scope.chartConfig.series[0].data = [
						[1000]
					]
				}
			}
		}

		$scope.changeMonth = function(month){
			budgetHelper.changeMonth($scope.months, month, dateSelector, updateGraph)
		}

		// $scope.changeMonth = function(month){
		// 	// month security
		// 	if(month === undefined || month > $scope.months.length){
		// 		month = $scope.months.length
		// 	}else if(month < 1){
		// 		month = 1
		// 	}


		// 	// Active the month
		// 	angular.forEach($scope.months, function(v, k){
		// 		v.isActive = false
		// 	})
		// 	$scope.months[month-1].isActive = true


		// 	// $scope.monthSelector = $scope.months[month-1].name
		// 	// $scope.currentMonth = $scope.months[month-1].id
		// 	dateSelector.currentMonth = $scope.months[month-1].id

		// 	setMonthGraph(month)
			
		// }

		// function resetMonth(yearPos){
		// 	angular.forEach($scope.years[yearPos].months, function(v, k){
		// 		v.isActive = false
		// 	})
		// }

		$scope.changeYear = function(year){
			$scope.months = budgetHelper.changeYear($scope.years, year, dateSelector, $scope.months)
			$scope.changeMonth(dateSelector.currentMonth)
			// updateGraph()
		}

		// $scope.changeYear = function(year){

		// 	// Find year position
		// 	var yearPos = undefined
		// 	angular.forEach($scope.years, function(y, key){
		// 		if(y.year === year){
		// 			yearPos = key
		// 		}
		// 	})

		// 	resetMonth(yearPos)

		// 	// Active the year
		// 	angular.forEach($scope.years, function(v, k){
		// 		v.isActive = false
		// 	})
		// 	$scope.years[yearPos].isActive = true

		// 	$scope.yearSelector = $scope.years[yearPos].year
		// 	$scope.currentYear = yearPos

		// 	// console.log(yearPos)
		// 	$scope.months = $scope.years[yearPos].months
		// 	// $scope.changeMonth($scope.currentMonth)
		// 	$scope.changeMonth(dateSelector.currentMonth)
		// }

		// $scope.changeYearOld = function(yearPos){
		// 	resetMonth(yearPos)

		// 	// Active the year
		// 	angular.forEach($scope.years, function(v){
		// 		v.isActive = false
		// 	})
		// 	$scope.years[yearPos].isActive = true

		// 	$scope.yearSelector = $scope.years[yearPos].year
		// 	$scope.currentYear = yearPos

		// 	// console.log(yearPos)
		// 	$scope.months = $scope.years[yearPos].months
		// 	$scope.changeMonth($scope.currentMonth)
		// }

		genChartConfig()

		// $scope.years = genYears('2014-01-01')
		$scope.years = budgetService.genData('2014-01-01')
		$scope.months = []

		var currentDate = moment()

		dateSelector.currentMonth = currentDate.month()+1

		
		// $scope.changeYearOld($scope.years.length-1)
		$scope.changeYear(currentDate.year())
		// $scope.changeMonth(currentDate.month()+1)
		// $scope.years[$scope.years.length-1].isActive = true;
		// $scope.years[$scope.years.length-1].months[$scope.years[$scope.years.length-1].months.length-1].isActive = true;
		// console.log($scope.years)

		// $scope.months = [
		// 	{id:1,name:"January"},
		// 	{id:2,name:"Febrary"},
		// 	{id:3,name:"March"},
		// 	{id:4,name:"April"},
		// 	{id:5,name:"May"},
		// 	{id:6,name:"June"},
		// 	{id:7,name:"Jully"},
		// 	{id:8,name:"August"},
		// 	{id:9,name:"September"},
		// 	{id:10,name:"October"},
		// 	{id:11,name:"November"},
		// 	{id:12,name:"December"}
		// ]
		

		
	}


})();
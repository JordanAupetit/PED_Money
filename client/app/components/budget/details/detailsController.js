// budgetController.js
(function() {
	'use strict';


	angular.module('controllers')
		.factory('budgetDetailsHelper', function() {
			return {}
		})
		.controller('BudgetDetailsCtrl', ['$scope', 'budgetService', '$modal', '$log', 'budgetHelper', BudgetDetailsCtrl])

	function BudgetDetailsCtrl($scope, budgetService, $modal, $log, budgetHelper){


		var months = [
			{id:1,name:"January"},
			{id:2,name:"Febrary"},
			{id:3,name:"March"},
			{id:4,name:"April"},
			{id:5,name:"May"},
			{id:6,name:"June"},
			{id:7,name:"Jully"},
			{id:8,name:"August"},
			{id:9,name:"September"},
			{id:10,name:"October"},
			{id:11,name:"November"},
			{id:12,name:"December"}
		]

		var years = [
			{
				year: 2015,
				months: months
			}
		]

		$scope.years = years
		$scope.months = months

		$scope.currentSelection = 'nothing'

		function pieCatSelect(name){
			$scope.currentSelection = name
			$scope.$apply() 
			// console.log(name)


		}

		var chartConfig = {

			//This is not a highcharts object. It just looks a little like one!
			options: {
				//This is the Main Highcharts chart config. Any Highchart options are valid here.
				//will be ovverriden by values specified below.
				chart: {
					type: 'pie'
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
							click: function(event){
								console.log('Click on the pie')
								// console.log(event)
								// console.log(this)
								// console.log(this.data)
								// console.log(this.data[event.point.index].name)
								pieCatSelect(this.data[event.point.index].name)
							}
						}
					}
				},
                legend: {
                    enabled: false
                }
			},
			//The below properties are watched separately for changes.


			//Series object (optional) - a list of series using normal highcharts series options.
			series: [{
				// data: [10, 15, 12, 8, 7]
				data: [
					['alimenation', 150.45], 
					['loisir', 28.75], 
					['habitation', 300.25], 
					['habillement', 12.59], 
					['autre', 87.15]
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
			size: {
				width: 600,
				height: 400
			},
			//function (optional)
			func: function(chart) {
				//setup some logic for the chart
				
			}
		};

		$scope.chartConfig = chartConfig





		$scope.years = budgetService.genData('2014-01-01')
		$scope.months = []



		function updateGraph(){

		}

		var dateSelector = {
			currentYear: undefined,
			currentMonth: undefined
		}

		$scope.changeMonth = function(month){
			budgetHelper.changeMonth($scope.months, month, dateSelector, updateGraph)
		}

		$scope.changeYear = function(year){
			$scope.months = budgetHelper.changeYear($scope.years, year, dateSelector, $scope.months)
			$scope.changeMonth(dateSelector.currentMonth)
			// updateGraph()
		}

		var currentDate = moment()
		dateSelector.currentMonth = currentDate.month()+1
		$scope.changeYear(currentDate.year())

		

	}


})();
// budgetController.js
(function() {
	'use strict';


	angular.module('controllers')
		.factory('budgetDetailsHelper', function() {
			return {}
		})
		.controller('BudgetDetailsCtrl', ['$scope', 'budgetService', '$modal', '$log', 'budgetHelper2', BudgetDetailsCtrl])

	function BudgetDetailsCtrl($scope, budgetService, $modal, $log, budgetHelper){

		$scope.categorySelector = {
			currentGroupCat: undefined,
			currentCat: undefined
		}

		$scope.dateSelector = budgetHelper.getDefaultSelector()

		function pieCatSelect(name){
			// $scope.currentSelection = name
			var subCats = $scope.budgetList[name]
			if(subCats !== undefined){
				var list = []
				angular.forEach(subCats, function(sub){
					angular.forEach(sub, function(subsub){
						list.push(subsub)
					})
				})
				$scope.csOpt = list
			}else{
				var truc
				angular.forEach($scope.budgetList, function(cat){
					angular.forEach(cat, function(subcat, key){
						if(name === key){
							truc = subcat
						}
					})
				})
				$scope.csOpt = truc
			}
			$scope.$apply() 
			// console.log($scope.csOpt)
		}



		var chartConfig = {

			//This is not a highcharts object. It just looks a little like one!
			options: {
				//This is the Main Highcharts chart config. Any Highchart options are valid here.
				//will be ovverriden by values specified below.
				chart: {
					type: 'pie',
					events: {
		                drilldown: function (e) {
		                	$scope.categorySelector.currentGroupCat = e.point.name
		                	// console.log(e.point.name)
		                	// pieCatSelect(e.point.name)
		                // },
		                // drillup: function (e) {
		                // 	// pieCatSelect(e.point.name)
		                // 	// console.log(e.point.name)
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
							click: function(event){
								// console.log('Click on the pie')
								// console.log(event)
								// console.log(this)
								// console.log(this.data)
								// console.log(this.data[event.point.index].name)
								
								

								// event.point.select(true, false)
								// console.log($scope.chartConfig.getHighcharts().getSelectedPoints())

								var catName = this.data[event.point.index].name
								

								if($scope.chartConfig.getHighcharts().getSelectedPoints().length > 0){

									if($scope.categorySelector.currentCat === catName){
										// console.log('case 1')
										pieCatSelect(currentGroupCat)
									}else{
										// console.log('case 2')
										pieCatSelect(catName)
										$scope.categorySelector.currentCat = catName
									}
									
									
								}else{
									pieCatSelect(catName)
									$scope.categorySelector.currentCat = catName
									// console.log('case 3')
								}
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

		$scope.chartConfig = chartConfig


		function updateGraph(){
			budgetService.getByCategory($scope.dateSelector)
			.then(function(budget){
				$scope.chartConfig.series = [{
						name: 'Category',
						colorByPoint: true,
						data:budget.pie
					}]
				$scope.chartConfig.options.drilldown.series = budget.pieDrillDown
				$scope.budgetList = budget.operations
				$scope.chartConfig.loading = false
				$scope.$apply()
			})
		}

		

		$scope.changeMonth = function(month){
			$scope.chartConfig.loading = true
			budgetHelper.changeMonth($scope.dataNav, month, $scope.dateSelector, updateGraph)
		}

		$scope.changeYear = function(year){
			budgetHelper.changeYear($scope.dataNav, year, $scope.dateSelector)
			$scope.changeMonth($scope.dateSelector.currentMonth)
		}


		$scope.refresh = function(){

			budgetService.getByMonth()
			.then(function(result){
				var currentDate = moment()
				$scope.dataNav = result
				$scope.dateSelector.setMonth(currentDate.month())
				$scope.changeYear(currentDate.year())

				$scope.$apply()
			})
		}

		$scope.refresh()

		

	}


})();
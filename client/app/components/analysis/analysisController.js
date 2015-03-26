(function() {
	'use strict';

	angular.module('controllers')
		.controller('AnalysisController', ['$scope', 'analysisService', '$log', AnalysisController])


	/**
	 * @Description
	 * The controller of the analysis
	 */
	function AnalysisController($scope, analysisService, $log) {


		function getDefaultConfigMonthly() {

			return {

				//This is not a highcharts object. It just looks a little like one!
				options: {
					//This is the Main Highcharts chart config. Any Highchart options are valid here.
					//will be ovverriden by values specified below.
					chart: {
						type: 'column'
					},
					tooltip: {
						// style: {
						// 	padding: 10,
						// 	fontWeight: 'bold'
						// }
						// pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
					},
					credits: {
						enabled: false
					},
					xAxis: {
						categories: [
							'Jan',
							'Feb',
							'Mar',
							'Apr',
							'May',
							'Jun',
							'Jul',
							'Aug',
							'Sep',
							'Oct',
							'Nov',
							'Dec'
						]
					},
					yAxis: {
						// min: 0,
						title: {
							text: ''
						}
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
					// plotOptions: {
					// 	series: {
					// 		borderWidth: 0,
					// 		dataLabels: {
					// 			enabled: true
					// 		}
					// 	}

					// },
					legend: {
						enabled: false
					}

				},
				//The below properties are watched separately for changes.


				series: [],
				title: {
					text: 'Monthly Expenses'
				},
				subtitle: {
					text: 'By year'
				},
				loading: false,
				useHighStocks: false,

			};
		}

		function getDefaultConfigStock() {

			return {
				options: {
					// chart: {
					//     zoomType: 'x'
					// },
					// rangeSelector: {
					//     enabled: true
					// },
					navigator: {
						enabled: true
					}
				},
				series: [],
				title: {
					text: 'Account portfolio balance'
				},
				useHighStocks: true
			}
		}

		// $scope.chartConfig = getDefaultConfigMonthly()
		// $scope.chartConfig = getDefaultConfigStock()


		// analysisService.getBalance().then(function(result){
		// 	console.log(result)
		// 	$scope.chartConfig.series.push(result)
		// 	$scope.$apply()
		// })


		$scope.selectGraph = function(graphType) {
			$scope.isSelection = true
			if (graphType === 'month') {
				$scope.chartConfig = getDefaultConfigMonthly()
				analysisService.getByMonth().then(function(result) {
					$scope.chartConfig.series = result
					$scope.$apply()
				})

			} else if (graphType === 'balance') {
				$scope.chartConfig = getDefaultConfigStock()
				analysisService.getBalance().then(function(result) {
					// console.log(result)
					$scope.chartConfig.series.push(result)
					$scope.$apply()
				})

			} else {
				$scope.isSelection = false
			}

		}

		$scope.refresh = function() {

			// budgetService.getByMonth()
			// 	.then(function(result) {
			// 		var currentDate = moment()
			// 		$scope.dataNav = result
			// 		$scope.dateSelector.setMonth(currentDate.month())
			// 		$scope.changeYear(currentDate.year())
			// 	})
		}



		$scope.refresh()


	}

})();
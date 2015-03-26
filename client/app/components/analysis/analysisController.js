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
					tooltip: {},
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
					$scope.chartConfig.series.push(result)
					$scope.$apply()
				})

			} else {
				$scope.isSelection = false
			}

		}

		$scope.refresh = function() {
		}



		$scope.refresh()


	}

})();
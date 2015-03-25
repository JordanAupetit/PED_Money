(function() {
	'use strict';

	angular.module('controllers')
	.controller('AnalysisController', ['$scope', 'analysisService', '$log', AnalysisController])


	/**
	 * @Description
	 * The controller of the analysis
	 */
	function AnalysisController($scope, analysisService, $log) {


		function getDefaultConfigMonthly(){

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


				series: [{
		            name: 'Test',
		            data: [490.9, 710.5, 1062.4, 1291.2, 1443.0, 1746.0, 1335.6, 1458.5, 2166.4, 1947.1, 951.6, 540.4]

		        }],
				title: {
		            text: 'Monthly Expenses'
		        },
		        subtitle: {
		            text: '2015'
		        },
				loading: false,
				useHighStocks: false,

			};
		}

		function getDefaultConfigStock(){

			return {

				//This is not a highcharts object. It just looks a little like one!
				options: {
					
					
				},
				//The below properties are watched separately for changes.

				rangeSelector : {
	                selected : 1
	            },

				series: [{
					name : 'LOL',
					data: [
			            /* Mar 2013 */
						[1362096000000,430.47],
						[1362355200000,420.05],
						[1362441600000,431.14],
						[1362528000000,425.66],
						[1362614400000,430.58],
						[1362700800000,431.72],
						[1362960000000,437.87],
						[1363046400000,428.43],
						[1363132800000,428.35],
						[1363219200000,432.50],
						[1363305600000,443.66],
						[1363564800000,455.72],
						[1363651200000,454.49],
						[1363737600000,452.08],
						[1363824000000,452.73],
						[1363910400000,461.91],
						[1364169600000,463.58],
						[1364256000000,461.14],
						[1364342400000,452.08],
						[1364428800000,442.66],
						/* Apr 2013 */
						[1364774400000,428.91],
						[1364860800000,429.79],
						[1364947200000,431.99],
						[1365033600000,427.72],
						[1365120000000,423.20],
						[1365379200000,426.21],
						[1365465600000,426.98],
						[1365552000000,435.69],
						[1365638400000,434.33],
						[1365724800000,429.80],
						[1365984000000,419.85],
						[1366070400000,426.24],
						[1366156800000,402.80],
						[1366243200000,392.05],
						[1366329600000,390.53],
						[1366588800000,398.67],
						[1366675200000,406.13],
						[1366761600000,405.46],
						[1366848000000,408.38],
						[1366934400000,417.20],
						[1367193600000,430.12],
						[1367280000000,442.78],
						/* May 2013 */
						[1367366400000,439.29],
						[1367452800000,445.52],
						[1367539200000,449.98],
						[1367798400000,460.71],
						[1367884800000,458.66],
						[1367971200000,463.84],
						[1368057600000,456.77],
						[1368144000000,452.97]
					]
				}],
				title: {
		            text: 'Monthly Expenses'
		        },
		        subtitle: {
		            text: '2015'
		        },
				loading: false,
				useHighStocks: true,

			};
		}

		// $scope.chartConfig = getDefaultConfigMonthly()
		// $scope.chartConfig = getDefaultConfigStock()

		$scope.chartConfig = {
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

	    analysisService.getBalance().then(function(result){
	    	console.log(result)
	    	$scope.chartConfig.series.push(result)
	    	$scope.$apply()
	    })

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
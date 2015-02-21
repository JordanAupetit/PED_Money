// periodController.js
(function() {
	'use strict';


	angular.module('controllers')
	.controller('periodController', ['$scope', 'periodService', periodController])


	function periodController($scope, periodService){

		// TODO Put in shared place
		var intervalType = [
				{type:'day', value:1, code:'d'},
				{type:'week', value:7, code:'w'},
				{type:'month', value:30, code:'M'},
				{type:'year', value:365, code:'Y'}
			]
		$scope.intervalType = intervalType


		/**
		 * @Description
		 * Simulate the periodic operation who will be generate
		 * @Param {Object} The period to project
		 */
		$scope.makeProjection = function(period){
			$scope.isProjection = !$scope.isProjection

			if($scope.isProjection){
				var projection = []
				// console.log(period)

				var date = moment(period.dateBegin)

				// Set the first operation
				projection.push({
					date: date.clone().toDate(),
					amount: period.amount
				})
				if(period.nbRepeat === -1){
					// If the operation is infinite show the first 12 operation
					for(var i = 0; i<12; i++){
						projection.push({
							date: date.add(1*period.step, period.intervalType).clone().toDate(),
							amount: period.amount
						})
					}
				}else{

					for(var i = 0; i<period.nbRepeat; i++){
						var proj = {
							date: date.add(1*period.step, period.intervalType).clone().toDate(),
							amount: period.amount
						}
						projection.push(proj)
					}
				}

				$scope.projection = projection
			}
		}

		/**
		 * @Description
		 * Search the real operation made from the period operation
		 * @Param {Object} The period operation from to find
		 */
		$scope.getLinkedOperation = function(period){
			// TODO
		}

		/**
		 * @Description
		 * Compute the repeat value from the end date
		 */
		$scope.computeRepeatDate = function(){
			var begin = moment($scope.periodTmp.dateBegin)	
			var end = moment($scope.periodTmp.dateEnd)
			if(end.isBefore(begin)){
				// error
			}else{
				var diff = end.diff(begin, 'days')
				var repeat = Math.round(diff / $scope.periodTmp.intervalType.value)
				$scope.periodTmp.nbRepeat = repeat
			}
		}

		/**
		 * @Description
		 * Manage click on the infinite checkbox 
		 */
		$scope.setInfinite = function(){
			if($scope.periodTmp.isInifinite){
				$scope.periodTmp.nbRepeat = -1

				$scope.periodTmp.dateEnd = undefined
			}else{
				$scope.periodTmp.nbRepeat = 1
				$scope.computeDateRepeat()
			}
		}

		/**
		 * @Description
		 * Compute the end date from the repeat value
		 */
		$scope.computeDateRepeat = function(){
			

			var begin = moment($scope.periodTmp.dateBegin)
			var repeat = $scope.periodTmp.nbRepeat
			var interval = $scope.periodTmp.intervalType.value



			// var end = begin.clone().add(interval*repeat, 'days')
			var end = begin.clone().add(repeat, $scope.periodTmp.intervalType.code)

			$scope.periodTmp.dateEnd = end.toDate()
		}

		/**
		 * @Description
		 * Compute the end date from the repeat value
		 * @Param {Date} The begin date
		 * @Param {Number} The number of repeat
		 * @Param {String} The type of interval
		 * @Return {Date} The date of the end of the periodic operation
		 */
		function computeEndDate(dateBegin, nbRepeat, intervalType){
			return moment(dateBegin).add(nbRepeat, intervalType).toDate()
		}

		/**
		 * @Description
		 * Reset the form of adding
		 */
		function resetAddForm(){
			$scope.periodTmp = {
				name: 'Test',
				dateBegin: new Date(2015, 1, 13),
				dateEnd: new Date(2015, 5, 13),
				nbRepeat: 4,
				step: 1,
				intervalType: intervalType[2],
				amount: 52
			}
			// 	$scope.periodTmp = {
			// 		name: "",
			// 		dateBegin: "",
			// 		dateEnd: undefined,
			// 		nbRepeat: undefined,
			// 		step: 0,
			// 		intervalType: "",
			// 		amount: 0
			// 	}
		}

		$scope.add = function(){
			$scope.isAdding = true
		}	


		$scope.addValid = function(){
			var tmp = jQuery.extend(true, {}, $scope.periodTmp);
			tmp.intervalType = tmp.intervalType.code
			$scope.isAdding = false
			resetAddForm()
			periodService.add(tmp).$promise.then(function(){
				refresh()
			})
		}		

		$scope.addCancel = function(){
			$scope.isAdding = false
			resetAddForm()
		}

		$scope.remove = function(period){
			periodService.remove(period._id)
			refresh()
		}

		function refresh(){
			// console.log(periodService.getAll())
			periodService.getAll().$promise.then(function(periods){
				// console.log(periods)
				$.each(periods, function(k, period){
					periods[k].dateEnd = computeEndDate(period.dateBegin, period.nbRepeat, period.intervalType)
					// console.log(period)
				})
				$scope.periods = periods
			})
			
		}

		resetAddForm()
		refresh()
	}

})();
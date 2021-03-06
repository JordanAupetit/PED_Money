// periodController.js
(function() {
	'use strict';


	angular.module('controllers')
		.factory('periodHelper', function() {
			return {

				clone: function(obj) {
					var target = {};
					for (var i in obj) {
						if (obj.hasOwnProperty(i)) {
							target[i] = obj[i];
						}
					}
					return target;
				},
				/**
				 * @Description
				 * Simulate the periodic operation who will be generate
				 * @Param {Object} The periodic operation to project
				 * @Return {Object} The projected periodic operation
				 */
				genProjection: function(period) {
					function clone(obj) {
						var target = {};
						for (var i in obj) {
							if (obj.hasOwnProperty(i)) {
								target[i] = obj[i];
							}
						}
						return target;
					}
					var projection = []

					var date = moment(period.dateBegin)

					// Set the first operation
					var proj = clone(period.operation)
					proj.dateOperation = date.clone().toDate()
					proj.datePrelevement = proj.dateOperation
					projection.push(proj)
					
					if (period.nbRepeat === -1) {
						// If the operation is infinite show the first 12 operation
						for (var i = 0; i < 12; i++) {
							proj = clone(period.operation)
							proj.dateOperation = date.add(1 * period.step, period.intervalType).clone().toDate()
							proj.datePrelevement = proj.dateOperation
							projection.push(proj)
						}
					} else {
						for (var i = 1; i < period.nbRepeat; i++) {

							proj = clone(period.operation)
							proj.dateOperation = date.add(1 * period.step, period.intervalType).clone().toDate()
							proj.datePrelevement = proj.dateOperation
							projection.push(proj)
						}
					}

					return projection
				},


				/**
				 * @Description
				 * Compute the end date of a period
				 * @Param {Period} The period to compute
				 * @Return {Date} The date of the end of the periodic operation
				 */
				computeEndDate: function(period) {
					return moment(period.dateBegin).add((period.nbRepeat - 1) * period.step, period.intervalType).toDate()
				}
			}
		})
		.controller('PeriodCtrl', ['$scope', 'periodRessource', '$modal', '$log', 'periodHelper', '$state', PeriodCtrl])
		.controller('ModalPeriodCtrl', ['$scope', '$modalInstance', '$log', 'intervalType', 'periodRessource', 'periodHelper', ModalPeriodCtrl])

	/**
	 * @Description
	 * The controller of the modal for adding periodic operation
	 */
	function ModalPeriodCtrl($scope, $modalInstance, $log, intervalType, periodRes, periodHelper) {
		$scope.intervalType = intervalType

		/**
		 * @Description
		 * Compute the repeat value from the end date
		 */
		$scope.computeRepeatDate = function() {
			var begin = moment($scope.periodTmp.dateBegin)
			var end = moment($scope.periodTmp.dateEnd)
			if (end.isBefore(begin)) {
				// error
			} else {
				var diff = end.diff(begin, 'days')
				var repeat = Math.round(diff / $scope.periodTmp.intervalType.value)
				$scope.periodTmp.nbRepeat = repeat
			}
		}

		/**
		 * @Description
		 * Manage click on the infinite checkbox
		 */
		$scope.setInfinite = function() {

			// Need by the form validation
			if ($scope.periodTmp.isInfinite) {
				$scope.periodTmp.nbRepeat = 1
				$scope.computeDateRepeat()
			}
		}

		/**
		 * @Description
		 * Compute the end date from the repeat value
		 */
		$scope.computeDateRepeat = function() {
			var begin = moment($scope.periodTmp.dateBegin)
			var repeat = $scope.periodTmp.nbRepeat
			var interval = $scope.periodTmp.intervalType.value

			var end = begin.clone().add(repeat, $scope.periodTmp.intervalType.code)

			$scope.periodTmp.dateEnd = end.toDate()
		}

		/**
		 * @Description
		 * Reset the form of adding
		 */
		function resetAddForm() {
			$scope.periodTmp = {
				name: '',
				dateBegin: undefined,
				dateEnd: undefined,
				nbRepeat: 1,
				step: 1,
				intervalType: intervalType[2],
				amount: undefined,
				isInfinite: false
			}
		}

		/**
		 * @Description
		 * Cancel the adding and close the modal
		 */
		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		}

		/**
		 * @Description
		 * Submit the form and close the modal
		 * @Param {Boolean} True if the form is valdid
		 */
		$scope.submitForm = function(isValid) {
			// check to make sure the form is completely valid
			if (isValid) {

				var tmp = getCleanForm()

				periodRes.add(tmp).$promise.then(function() {
					resetAddForm()
					$modalInstance.close();
				})
			}

		}

		/**
		 * @Description
		 * Clean the form data to make it coherent
		 * @Return {Object} The clean data of the form
		 */
		function getCleanForm() {
			var res = jQuery.extend(true, {}, $scope.periodTmp);
			res.intervalType = res.intervalType.code
			if (res.isInfinite) {
				res.nbRepeat = -1
				res.dateEnd = undefined
			}
			return res
		}

		/**
		 * @Description
		 * Prepare the form data to do the projection
		 */
		function prepareProjection() {

			if ($scope.periodForm.$valid && $scope.periodForm.$dirty) {
				$scope.projection = periodHelper.genProjection(getCleanForm())
			} else {
				$scope.projection = undefined
			}
		}


		resetAddForm()



		// Watchers for the projection
		$scope.$watch('periodTmp.intervalType', prepareProjection)
		$scope.$watch('periodTmp.step', prepareProjection)
		$scope.$watch('periodTmp.dateBegin', prepareProjection)
		$scope.$watch('periodTmp.isInfinite', prepareProjection)
		// $scope.$watch('periodTmp.dateEnd', prepareProjection)
		$scope.$watch('periodTmp.nbRepeat', prepareProjection)
		$scope.$watch('periodTmp.amount', prepareProjection)
	}

	/**
	 * @Description
	 * The controller of the periodic operation
	 */
	function PeriodCtrl($scope, periodRes, $modal, $log, periodHelper, $state) {
        $scope.accountId = $state.params.accountId

		$scope.headers = [{
			name: 'Name',
			field: 'Name',
		}, {
			name: 'Date Begin',
			field: 'Date Begin'
		}, {
			name: 'Date End',
			field: 'Date End'
		}, {
			name: 'Occurrency',
			field: 'Occurrency'
		}, {
			name: 'Step',
			field: 'Step'
		}, {
			name: 'Interval type',
			field: 'Interval type'
		}, {
			name: 'Amount',
			field: 'Amount'
		}, {
			name: '',
			field: 'action'
		}];

		$scope.custom = {
			name: 'bold',
			description: 'grey',
			last_modified: 'grey'
		};

		var intervalType = [{
			type: 'day',
			value: 1,
			code: 'd'
		}, {
			type: 'week',
			value: 7,
			code: 'w'
		}, {
			type: 'month',
			value: 30,
			code: 'M'
		}, {
			type: 'year',
			value: 365,
			code: 'y'
		}]
		$scope.intervalType = intervalType

		/**
		 * @Description
		 * Open the modal for adding periodic operation
		 */
		$scope.openAdd = function() {

			var modalInstance = $modal.open({
				templateUrl: 'periodModalContent.html',
				controller: 'ModalPeriodCtrl',
				// size: 'sm',
				resolve: {
					intervalType: function() {
						return $scope.intervalType;
					}
				}
			});

			modalInstance.result.then(function(selectedItem) {
				refresh()
			}, function() {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};



		/**
		 * @Description
		 * Search the real operation made from the period operation
		 * @Param {Object} The period operation from to find
		 */
		$scope.getLinkedOperation = function(period) {
			// TODO
		}

		$scope.makeProjection = function(period) {
			$scope.isProjection = !$scope.isProjection
			// period.isProjection = !period.isProjection
			$scope.projection = periodHelper.genProjection(period)
		}



		/**
		 * @Description
		 * Remove periodic operation from the data model and refresh the page
		 * @Param {Object} The period operation to remove
		 */
		$scope.remove = function(period) {
			periodRes.remove(period._id)
			$scope.isProjection = false
			$scope.projection = []
			refresh()
		}


		$scope.addData = function() {
			periodRes.init().then(function() {
				refresh()
			})

		}

		// NE PAS SUPPRIMER
		// Permet de détecter le controller en parent d'un autre controller
		$scope.thisController = "periodController";

		/**
		 * @Description
		 * Refresh the page
		 */
		function refresh() {
			periodRes.getAll($scope.accountId).$promise.then(function(periods) {
				$.each(periods, function(k, period) {
					if (period.nbRepeat !== -1) {
						periods[k].dateEnd = periodHelper.computeEndDate(period)
					}
				})
				$scope.periods = periods
			})

		}

		$scope.refresh = refresh

		// Controller initialisation
		refresh()
	}

})();
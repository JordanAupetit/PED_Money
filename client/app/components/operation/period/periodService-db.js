// periodService.js
(function() {
	'use strict';

	angular.module('services')
		.factory('periodService', ['$resource', function($resource) {


			var periodsRes = $resource('/api/period/:id', {}, {
				getAll: {
					method: 'GET',
					isArray: true
				},
				get: {
					method: 'GET'
				},
				add: {
					method: 'POST'
				},
				delete: {
					method: 'DELETE'
				}
			})

			var p1 = {
				_id: 2,
				name: 'Loyer',
				dateBegin: '2015-01-15',
				nbRepeat: -1,
				step: 3,
				intervalType: 'M',
				amount: 300
			}

			var p2 = {
				_id: 1,
				name: 'Zebulon',
				dateBegin: new Date(2015, 1, 13),
				nbRepeat: 4,
				step: 1,
				intervalType: 'M',
				amount: 52
			}

			var p3 = {
				_id: 3,
				name: 'Essence',
				dateBegin: new Date(2015, 1, 2),
				nbRepeat: -1,
				step: 1,
				intervalType: 'w',
				amount: 20
			}

			return {
				init: function() {
					return new Promise(function(resolve, reject) {
						periodsRes.add(p1).$promise.then(function(){
							periodsRes.add(p2).$promise.then(function(){
								periodsRes.add(p3).$promise.then(function(){
									resolve()
								})
							})
						})
					})
					
				},

				getAll: function() {
					return periodsRes.getAll()
				},
				add: function(operation) {
					return periodsRes.add(operation)
				},
				remove: function(periodId) {
					return periodsRes.delete({
						id: periodId
					})
				},
				computeNewOpt: function() {

				}

			}
		}])

})();
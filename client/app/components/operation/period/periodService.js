// // periodService.js
// (function() {
// 	'use strict';

// 	angular.module('controllers')
// 	.factory('periodService', [function(){

// 		var periodiOpt = []

// 		var cpt = 3

// 		var p1 = {
// 			_id: 2,
// 			name: 'Loyer',
// 			dateBegin: '2015-01-15',
// 			nbRepeat: -1,
// 			step: 3,
// 			intervalType: 'M',
// 			amount: 300
// 		}

// 		var p2 = {
// 				_id: 1,
// 				name: 'Zebulon',
// 				dateBegin: new Date(2015, 1, 13),
// 				nbRepeat: 4,
// 				step: 1,
// 				intervalType: 'M',
// 				amount: 52
// 			}

// 		var p3 = {
// 			_id: 3,
// 			name: 'Essence',
// 			dateBegin:  new Date(2015, 1, 2),
// 			nbRepeat: -1,
// 			step: 1,
// 			intervalType: 'w',
// 			amount: 20
// 		}

// 		periodiOpt.push(p1)
// 		periodiOpt.push(p2)
// 		periodiOpt.push(p3)

// 		return {

// 			getAll: function(){
// 				return periodiOpt
// 			},
// 			add: function(operation){
// 				cpt++
// 				operation._id = cpt
// 				periodiOpt.push(operation)
// 			},
// 			remove: function(periodId){
// 				$.each(periodiOpt, function(k,period){
// 					if(period._id === periodId){
// 						periodiOpt.splice( k, 1 );
// 					}
// 				})
// 			},
// 			computeNewOpt: function(){
				
// 			}

// 		}
// 	}])

// })();
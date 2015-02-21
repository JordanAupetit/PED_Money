// initService.js
(function() {
	'use strict';

	angular.module('services')
	.factory('initService', ['periodService', initService])

	function initService(periodService){

		return {
			populate: function(){
				periodService.init()
			}
		}
	}
})()
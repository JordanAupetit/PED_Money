// initService.js
(function() {
	'use strict';

	angular.module('services')
	.factory('initService', ['periodService', function(periodService){

		return {
			populate: function(){
				periodService.init()
			}
		}
})()
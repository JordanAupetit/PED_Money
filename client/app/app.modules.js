/*jshint -W079 */
var Promise = Promise || ES6Promise.Promise;

(function() {
	'use strict';

	
	angular.module('filters', [])
	angular.module('directives', [])
	angular.module('services', ['ngResource'])
	angular.module('controllers', ['currencyFilter', 'services', 'filters', 'directives'])


	angular
		.module('appModule', [
			'ui.router',
			'ipCookie',
			// 'ngResource',
			'LocalStorageModule',
			'ui.bootstrap',
			'controllers',
			'ngMaterial',
			'highcharts-ng',
			'chart.js'
		])

})();

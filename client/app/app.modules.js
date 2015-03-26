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
			'LocalStorageModule',
			'ui.bootstrap',
			'controllers',
			'ngMaterial',
			'highcharts-ng',
			'chart.js'
		])

		// Whitelist des blob pour pouvoir télécharger un csv / file (blob) -- Et http pour le pdf
		.config( [
			'$compileProvider',
			function( $compileProvider )
			{
				$compileProvider.aHrefSanitizationWhitelist(/^\s*(|blob|http):/);
				// Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
			}
		])

})();

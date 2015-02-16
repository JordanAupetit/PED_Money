var Promise = Promise || ES6Promise.Promise;

(function() {
	'use strict';
	// angular.module('ccServices')

	// angular.module('ccControllers')

	angular.module('services', ['ngResource'])
	angular.module('controllers', ['services'])

	angular
		.module('appModule', [
			'ui.router',
			'controllers'

			
			// 'ngDialog',
			// 'ccDirectives',
			// 'ccControllers',
			// 'ccServices'
		])

})();

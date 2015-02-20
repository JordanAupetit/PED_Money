var Promise = Promise || ES6Promise.Promise;

(function() {
	'use strict';
	angular.module('services', ['ngResource'])
	angular.module('controllers', ['services'])

	// angular.module('ccControllers')

	angular
		.module('appModule', [
			'ui.router',
			// 'ngDialog',
			// 'ccDirectives',
			'controllers'
			//'ccServices'
		])

})();

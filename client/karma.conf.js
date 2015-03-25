// Karma configuration
// Generated on Thu Feb 19 2015 17:08:09 GMT+0100 (Paris, Madrid)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'assets/libs/angular/angular.js',
      'assets/libs/angular-mocks/angular-mocks.js',
      'assets/libs/jquery/dist/jquery.js',
      'assets/libs/jquery-ui/jquery-ui.min.js',
      'assets/libs/bootstrap/dist/js/bootstrap.min.js',
      'assets/libs/highcharts-ng/dist/highcharts-ng.min.js',
      'assets/libs/Chart.js/Chart.min.js',
      'assets/libs/angular-chart.js/dist/angular-chart.js',
      // 'assets/js/es6-promise-2.0.1.min.js',
      'assets/libs/angular-ui-router/release/angular-ui-router.min.js',
      'assets/libs/angular-resource/angular-resource.js',
      'assets/libs/angular-bootstrap/ui-bootstrap.min.js',
      'assets/libs/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'assets/libs/moment/min/moment.min.js',
      'assets/libs/angular-currency-filter/src/currency-filter.js',
      'assets/libs/angular-aria/angular-aria.js',
      'assets/libs/angular-animate/angular-animate.js',
      'assets/libs/angular-material/angular-material.js',
      'assets/libs/angular-cookie/angular-cookie.js',
      'assets/libs/papaparse/papaparse.js',
      // 'assets/libs/',
      // 'assets/libs/',
      // 'assets/libs/angular-mocks/angular-mocks.js',
      // 'assets/libs/**/*.js',
      'assets/js/**/*.js',
      'app/app.modules.js',
      'app/app.routes.js',
      'app/components/operation/period/*.js',
      'app/components/**/*.js',
      'app/shared/**/*.js',
      // 'test/unit/accountSpec.js',
      // 'test/unit/accountSettingsSpec.js',
      //'test/unit/operationSpec.js', 
      // 'test/unit/periodSpec.js',
      // 'test/unit/loginSpec.js'
      'test/**/*.js',
      //'test/unit/**/*.js',
      // 'test/e2e/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'app/components/**/*.js': ['coverage'],
      'app/shared/**/*.js': ['coverage']
    },

    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // browsers: ['Chrome', 'Firefox'],
    // browsers: ['Firefox'],
    browsers: ['Chrome'],
    
    // This is the new content for your travis-ci configuration test
    //  Custom launcher for Travis-CI
    customLaunchers: {
        Chrome_travis_ci: {
            base: 'Chrome',
            flags: ['--no-sandbox']
        }
    },


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
  
  if(process.env.TRAVIS){
      config.browsers = ['Chrome_travis_ci'];
  }
};

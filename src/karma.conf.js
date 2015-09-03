// Karma configuration
// Generated on Wed Aug 26 2015 09:40:00 GMT-0500 (CDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'requirejs'],


    // list of files / patterns to load in the browser
    files: [
        { pattern: 'client/app/libs/angular.min.js', included: false},
        { pattern: 'client/app/libs/angular-route.min.js', included: false},
        { pattern: 'client/app/libs/angular-resource.min.js', included: false},
        { pattern: 'client/app/libs/angular-cookies.min.js', included: false},
        { pattern: 'client/app/libs/angular-translate.min.js', included: false},
        { pattern: 'client/app/libs/angular-translate-storage-cookie.min.js', included: false},
        { pattern: 'client/app/libs/angular-translate-storage-local.min.js', included: false},
        { pattern: 'client/app/libs/angular-translate-loader-static-files.min.js', included: false},
        { pattern: 'client/app/libs/angular-translate-loader-url.min.js', included: false},
        { pattern: 'client/tests/angular-mocks.js', included: false},
        { pattern: 'client/tests/mock-gatekeeper.js', included: false},
        { pattern: 'client/app/app.js', included: false},
        { pattern: 'client/app/nav/*.js', included: false},
        { pattern: 'client/app/form/form.js', included: false},
        { pattern: 'client/app/form/*.js', included: false},
        { pattern: 'client/app/service_requests/serviceRequest.js', included: false},
        { pattern: 'client/app/service_requests/*.js', included: false},
        { pattern: 'client/app/address_service_requests/addressServiceRequest.js', included: false},
        { pattern: 'client/app/address_service_requests/*.js', included: false},
        { pattern: 'client/app/contact_service_requests/contactServiceRequest.js', included: false},
        { pattern: 'client/app/contact_service_requests/*.js', included: false},
        { pattern: 'client/app/users/user.js', included: false},
        { pattern: 'client/app/users/*.js', included: false},
        { pattern: 'client/app/reporting/report.js', included: false},
        { pattern: 'client/app/reporting/*.js', included: false},
        { pattern: 'client/app/page_count/pageCount.js', included: false},
        { pattern: 'client/app/page_count/*.js', included: false},
        { pattern: 'client/app/invoices/invoice.js', included: false},
        { pattern: 'client/app/invoices/*.js', included: false},
        { pattern: 'client/app/utilities/utility.js', included: false},
        { pattern: 'client/app/utilities/*.js', included: false},
        { pattern: 'client/app/device_management/deviceManagement.js', included: false},
        { pattern: 'client/app/device_management/*.js', included: false},
        { pattern: 'client/etc/lxk-framework/js/lxk-framework.min.js', included: false},
        { pattern: 'client/etc/lxk-framework/js/libs/*.js', included: false},
        { pattern: 'client/tests/report_module_spec.js', included: false},
        { pattern: 'client/tests/address_service_request_module_spec.js', included: false},
        { pattern: 'client/tests/contact_service_request_module_spec.js', included: false},
        { pattern: 'client/tests/form_module_spec.js', included: false},
        'client/tests/test-main.js'
    ],


    // list of files to exclude
    exclude: [
        'client/etc/js/main.js'
    ],


    plugins: ['karma-jasmine', 'karma-phantomjs-launcher','karma-junit-reporter','karma-coverage','karma-requirejs'],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: { 'client/app/**/*.js': ['coverage'] },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'dots', 'junit', 'coverage'],

    // web server port
    port: 9090,
    runnerPort: 9191,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    coverageReporter: {
        reporters: [
            { type: 'cobertura', dir: '.' }
        ]
    },


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    junitReporter: {
        outputFile: 'test-results.xml',
        outputDir: '../'
    }

  });
};

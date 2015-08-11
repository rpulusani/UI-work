module.exports = function(config){
  config.set({
    basePath : './',
    files : [
        'client/js/libs/angular.min.js',
        'client/js/libs/angular-route.min.js',
        'client/js/libs/angular-resource.min.js',
        'client/tests/angular-mocks.js',
        'client/js/app.js',
        'client/js/routes.js',
        'client/js/common/common.js',
        'client/js/common/*.js',
        'client/js/service_requests/serviceRequest.js',
        'client/js/service_requests/*.js',
        'client/js/address_service_requests/addressServiceRequest.js',
        'client/js/address_service_requests/*.js',
        'client/js/contact_service_requests/contactServiceRequest.js',
        'client/js/contact_service_requests/*.js',
        'client/js/users/user.js',
        'client/js/users/*.js',
        'client/tests/address_service_request_module_spec.js',
        'client/tests/navigation_module_spec.js'
    ],
    autoWatch : true,
    plugins: ['karma-jasmine', 'karma-phantomjs-launcher','karma-junit-reporter'],
    port: 9090,
    runnerPort: 9191,
    frameworks: ['jasmine'],
    browsers : ['PhantomJS'],
    singleRun: true,
    reporters: ['dots', 'junit'],
    junitReporter: {
        outputFile: '../test-results.xml'
    }

  });
};

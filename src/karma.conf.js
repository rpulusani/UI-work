module.exports = function(config){
  config.set({
    basePath : './',
    files : [
        'client/app/libs/angular.min.js',
        'client/app/libs/angular-route.min.js',
        'client/app/libs/angular-resource.min.js',
        'client/tests/angular-mocks.js',
        'client/app/app.js',
        'client/app/routes.js',
        'client/app/common/common.js',
        'client/app/common/*.js',
        'client/app/service_requests/serviceRequest.js',
        'client/app/service_requests/*.js',
        'client/app/address_service_requests/addressServiceRequest.js',
        'client/app/address_service_requests/*.js',
        'client/app/contact_service_requests/contactServiceRequest.js',
        'client/app/contact_service_requests/*.js',
        'client/app/users/user.js',
        'client/app/users/*.js',
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

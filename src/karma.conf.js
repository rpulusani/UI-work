module.exports = function(config){
  config.set({
    basePath : './',
    files : [
        'client/js/libs/angular.min.js',
        'client/js/libs/angular-route.min.js',
        'client/js/libs/angular-resource.min.js',
        'client/tests/angular-mocks.js',
        'client/js/customer-portal.js',
        'client/js/routes.js',
        'client/js/common/*.js',
        'client/js/service_requests/**/*.js',
        'client/tests/address_service_request_module_spec.js',
        'client/tests/navigation_module_spec.js'
    ],
    autoWatch : true,
    port: 9090,
    runnerPort: 9191,
    frameworks: ['jasmine'],
    browsers : ['Chrome'],
    singleRun: false,
  });
};

var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
    // then do not normalize the paths
    var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '').replace('client','');
    allTestFiles.push('/base/client' + normalizedTestModule + ".js");
  }
});

require(['/base/client/etc/js/main.js'], function(){

    var mainConfig = requirejs.s.contexts._.config;

    require.config({
        // Karma serves files under /base, which is the basePath from your config file
        baseUrl: '/base/client',
        paths: {
            'fixtures': 'tests/fixtures',
            'angular-mocks': 'tests/angular-mocks',
            'gatekeeper-mocks': 'tests/mock-gatekeeper'
        },
        shim: {
            'gatekeeper-mocks': ['angular'],
            'angular-mocks': {
                deps: ['angular-resource'],
                exports: 'angular-mocks'
            },
            'app': {deps: mainConfig.shim.app.deps.concat(['angular-mocks'])}
        },
        // dynamically load all test files
        deps: mainConfig.deps.concat(allTestFiles),
        map: {
            '*': {'gatekeeper': 'gatekeeper-mocks'}
        },
        // we have to kickoff jasmine, as it is asynchronous
        callback: window.__karma__.start
    });
});
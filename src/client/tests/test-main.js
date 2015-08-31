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

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base/client',

  paths: {
        'lxk.fef': 'etc/lxk-framework/js/lxk-framework.min',

        'angular': 'app/libs/angular.min',
        'angular-mocks': 'tests/angular-mocks',
        'angular-resource': 'app/libs/angular-resource.min',
        'angular-route': 'app/libs/angular-route.min',
        'angular-cookies': 'app/libs/angular-cookies.min',
        'angular-translate': 'app/libs/angular-translate.min',
        'angular-translate-storage-cookie': 'app/libs/angular-translate-storage-cookie.min',
        'angular-translate-storage-local': 'app/libs/angular-translate-storage-local.min',
        'angular-translate-loader-static-files': 'app/libs/angular-translate-loader-static-files.min',
        'angular-translate-loader-url': 'app/libs/angular-translate-loader-url.min',

        'gatekeeper-mocks': 'tests/mock-gatekeeper',

        'app': 'app/app',

        'navigation': 'app/navigation/navigation',
        'navigation.navFactory': 'app/navigation/navFactory',
        'navigation.topNav': 'app/navigation/topNavController',
        'navigation.leftNav': 'app/navigation/leftNavController',
        'navigation.directives': 'app/navigation/directives',

        'form': 'app/form/form',
        'form.directives': 'app/form/directives',

        'utility': 'app/utilities/utility',
        'utility.historyUtility': 'app/utilities/historyUtility',
        'utility.directives': 'app/utilities/directives',

        'user': 'app/users/user',
        'user.factory': 'app/users/usersFactory',
        'user.directives': 'app/users/directives',

        'serviceRequest': 'app/service_requests/serviceRequest',
        'serviceRequest.factory': 'app/service_requests/serviceRequestsFactory',
        'serviceRequest.directives': 'app/service_requests/directives',

        'address': 'app/address_service_requests/addressServiceRequest',
        'address.controller': 'app/address_service_requests/controller',
        'address.directives': 'app/address_service_requests/directives',
        'address.factory': 'app/address_service_requests/addressesFactory',

        'contact': 'app/contact_service_requests/contactServiceRequest',
        'contact.controller': 'app/contact_service_requests/controller',
        'contact.directives': 'app/contact_service_requests/directives',
        'contact.factory': 'app/contact_service_requests/contactsFactory',

        'invoice': 'app/invoices/invoice',

        'pageCount': 'app/page_count/pageCount',

        'deviceManagement': 'app/device_management/deviceManagement',

        'report': 'app/reporting/report'
    },
    shim: {
        'angular-resource': ['angular'],
        'angular-route': ['angular'],
        'angular-cookies': ['angular'],
        'angular-translate': ['angular'],
        'angular-translate-storage-cookie': ['angular-translate'],
        'angular-translate-storage-local': ['angular-translate'],
        'angular-translate-loader-static-files': ['angular-translate'],
        'angular-translate-loader-url': ['angular-translate'],

        'gatekeeper-mocks': ['angular'],

        'app': ['angular',
                'angular-resource',
                'angular-route',
                'angular-cookies',
                'angular-translate',
                'angular-translate-storage-cookie',
                'angular-translate-storage-local',
                'angular-translate-loader-static-files',
                'angular-translate-loader-url',
                'angular-mocks'],

        'angular-mocks': {
            deps: [ 'angular-resource' ],
            exports: 'angular-mocks'
        },

        'navigation': ['app'],
        'navigation.topNav': ['app', 'navigation', 'navigation.navFactory'],
        'navigation.leftNav': ['app', 'navigation', 'navigation.navFactory'],
        'navigation.navFactory': ['app', 'navigation'],
        'navigation.directives': ['app', 'navigation'],

        'form':['app'],
        'form.directives': ['app','form'],

        'utility': ['app'],
        'utility.historyUtility': ['app', 'utility'],
        'utility.directives': ['app', 'utility'],

        'user': ['app'],
        'user.factory': ['app', 'user'],
        'user.directives': ['app', 'user'],

        'serviceRequest': ['app', 'utility'],
        'serviceRequest.factory': ['app', 'serviceRequest'],
        'serviceRequest.directives': ['app', 'serviceRequest'],

        'address': ['app'],
        'address.controller': ['app', 'address', 'address.factory', 'contact.factory'],
        'address.directives': ['app', 'address'],
        'address.factory': ['app', 'address', 'serviceRequest.factory', 'utility.historyUtility'],

        'contact': ['app'],
        'contact.controller': ['app', 'contact', 'contact.factory'],
        'contact.directives': ['app', 'contact'],
        'contact.factory': ['app', 'contact'],

        'invoice':  ['app'],

        'pageCount':  ['app'],

        'deviceManagement':  ['app'],

        'report':  ['app']
    },

  // dynamically load all test files
  deps: [
        'lxk.fef',

        'angular',
        'angular-mocks',
        'angular-resource',
        'angular-route',
        'angular-cookies',
        'angular-translate',
        'angular-translate-storage-cookie',
        'angular-translate-storage-local',
        'angular-translate-loader-static-files',
        'angular-translate-loader-url',

        'gatekeeper-mocks',

        'app',

        'navigation',
        'navigation.navFactory',
        'navigation.topNav',
        'navigation.leftNav',
        'navigation.directives',

        'form',
        'form.directives',

        'utility',
        'utility.historyUtility',
        'utility.directives',

        'user',
        'user.factory',
        'user.directives',

        'serviceRequest',
        'serviceRequest.factory',
        'serviceRequest.directives',

        'address',
        'address.controller',
        'address.directives',
        'address.factory',

        'contact',
        'contact.controller',
        'contact.directives',
        'contact.factory',

        'invoice',

        'pageCount',

        'deviceManagement',

        'report',

        
  ].concat(allTestFiles),

  map: {
        '*': {
            'jquery': 'jquery-private',
            'stable': 'modules'
        },
        'jquery-private': {'jquery': 'jquery'}
    },
    bundles: {
        'lxk.fef': [
            'jquery',
            'fef.jquery',
            'jquery-private',
            'throttle-debounce',
            'modernizr',
            'variables',
            'modules/alerts',
            'modules/banner',
            'modules/breadcrumb',
            'modules/card',
            'modules/carousel',
            'modules/custom-input',
            'modules/dropdown',
            'modules/form-selectbox',
            'modules/form',
            'modules/griddy',
            'modules/media-queries',
            'modules/modal',
            'modules/modalmanager',
            'modules/quote',
            'modules/rail-nav',
            'modules/responsive-images',
            'modules/responsive-tables',
            'modules/set',
            'modules/sifter',
            'modules/slide-in-panel'
        ]
    },
  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});

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

        'nav': 'app/nav/nav',
        'nav.controllers': 'app/nav/controllers',
        'nav.services': 'app/nav/services',
        'nav.directives': 'app/nav/directives',

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

        'report': 'app/reporting/report',
        'report.controller': 'app/reporting/controller',
        'report.directives': 'app/reporting/directives',
        'report.factory': 'app/reporting/reportFactory'
    },
    shim: {
        'angular': {exports: 'angular'},
        'angular-resource': ['angular'],
        'angular-route': ['angular'],
        'angular-cookies': ['angular'],
        'angular-translate': ['angular'],
        'angular-translate-storage-cookie': ['angular-translate'],
        'angular-translate-storage-local': ['angular-translate'],
        'angular-translate-loader-static-files': ['angular-translate'],
        'angular-translate-loader-url': ['angular-translate'],

        'gatekeeper-mocks': ['angular'],


        'angular-mocks': {
            deps: [ 'angular-resource' ],
            exports: 'angular-mocks'
        },

        'app': [
            'angular',
            'angular-resource',
            'angular-route',
            'angular-cookies',
            'angular-translate',
            'angular-translate-storage-cookie',
            'angular-translate-storage-local',
            'angular-translate-loader-static-files',
            'angular-translate-loader-url',
            'gatekeeper-mocks',
            'angular-mocks',

            'nav',
            'nav.controllers',
            'nav.services',
            'nav.directives',

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
            'address.factory',
            'address.directives',

            'contact',
            'contact.controller',
            'contact.factory',
            'contact.directives',

            'invoice',

            'pageCount',

            'deviceManagement',

            'report',
            'report.controller',
            'report.directives',
            'report.factory'
        ],

        'nav': ['angular'],
        'nav.controllers': ['nav', 'nav.services'],
        'nav.services': ['nav'],
        'nav.directives': ['nav'],

        'form':['angular', 'lxk.fef'],
        'form.directives': ['form'],

        'utility': ['angular', 'angular-resource'],
        'utility.historyUtility': ['utility'],
        'utility.directives': ['utility'],

        'user': ['angular'],
        'user.factory': ['user'],
        'user.directives': ['user'],

        'serviceRequest': ['angular', 'angular-resource', 'angular-route', 'utility'],
        'serviceRequest.factory': ['serviceRequest'],
        'serviceRequest.directives': ['serviceRequest'],

        'address': ['angular', 'angular-route'],
        'address.controller': ['address', 'address.factory', 'contact.factory'],
        'address.directives': ['address'],
        'address.factory': ['address', 'serviceRequest.factory', 'utility.historyUtility'],

        'contact': ['angular', 'angular-resource', 'angular-route'],
        'contact.controller': ['contact', 'contact.factory'],
        'contact.directives': ['contact'],
        'contact.factory': ['contact'],

        'invoice': ['angular', 'angular-route'],

        'pageCount': ['angular', 'angular-route'],

        'deviceManagement': ['angular', 'angular-route'],

        'report': ['angular', 'angular-route'],
        'report.controller': ['report', 'report.factory', 'utility.historyUtility'],
        'report.directives': ['report'],
        'report.factory': ['report']
    },

    // dynamically load all test files
    deps: [
        'lxk.fef',
        'app'
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

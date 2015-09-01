requirejs.config({
    baseUrl: '/',
    deps: [
        'lxk.fef',

        'angular',
        'angular-resource',
        'angular-route',
        'angular-cookies',
        'angular-translate',
        'angular-translate-storage-cookie',
        'angular-translate-storage-local',
        'angular-translate-loader-static-files',
        'angular-translate-loader-url',

        'app',

        'nav',
        'nav.controllers',
        'nav.services',
        'nav.directives',

        'form',
        'form.directives',

        'form',
        'form.directives',

        'utility',
        'utility.historyUtility',
        'utility.directives',
        'utility.controllers',

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
        'report.controller',
        'report.directives',
        'report.factory',
        
        'gatekeeper'
    ],
    shim: {
        'angular-resource': ['angular'],
        'angular-route': ['angular'],
        'angular-cookies': ['angular'],
        'angular-translate': ['angular'],
        'angular-translate-storage-cookie': ['angular-translate'],
        'angular-translate-storage-local': ['angular-translate'],
        'angular-translate-loader-static-files': ['angular-translate'],
        'angular-translate-loader-url': ['angular-translate'],

        'app': ['angular',
                'angular-resource',
                'angular-route',
                'angular-cookies',
                'angular-translate',
                'angular-translate-storage-cookie',
                'angular-translate-storage-local',
                'angular-translate-loader-static-files',
                'angular-translate-loader-url',
                'gatekeeper'],

        'nav': ['app'],
        'nav.controllers': ['app', 'nav', 'nav.services'],
        'nav.services': ['app', 'nav'],
        'nav.directives': ['app', 'nav', 'nav.services'],

        'form':['app'],
        'form.directives': ['app','form'],

        'form':['app'],
        'form.directives': ['app','form'],

        'utility': ['app'],
        'utility.historyUtility': ['app', 'utility'],
        'utility.directives': ['app', 'utility'],
        'utility.controllers': ['app','utility'],

        'user': ['app'],
        'user.factory': ['app', 'user'],
        'user.directives': ['app', 'user'],

        'serviceRequest': ['app', 'utility'],
        'serviceRequest.factory': ['app', 'serviceRequest'],
        'serviceRequest.directives': ['app', 'serviceRequest'],

        'address': ['app'],
        'address.controller': ['app', 'address', 'address.factory', 'contact.factory'],
        'address.directives': ['app', 'address','lxk.fef',''],
        'address.factory': ['app', 'address', 'serviceRequest.factory', 'utility.historyUtility'],

        'contact': ['app'],
        'contact.controller': ['app', 'contact', 'contact.factory','jquery-private'],
        'contact.directives': ['app', 'contact'],
        'contact.factory': ['app', 'contact'],

        'invoice':  ['app'],

        'pageCount':  ['app'],

        'deviceManagement':  ['app'],

        'report':  ['app'],
        'report.controller': ['app', 'report', 'report.factory'],
        'report.directives': ['app', 'report'],
	    'report.factory': ['app', 'report'],
	
        'gatekeeper': ['angular-cookies', 'angular-route']
        
    },
    paths: {
        'lxk.fef': 'etc/lxk-framework/js/lxk-framework.min',

        'angular': 'app/libs/angular.min',
        'angular-resource': 'app/libs/angular-resource.min',
        'angular-route': 'app/libs/angular-route.min',
        'angular-cookies': 'app/libs/angular-cookies.min',
        'angular-translate': 'app/libs/angular-translate.min',
        'angular-translate-storage-cookie': 'app/libs/angular-translate-storage-cookie.min',
        'angular-translate-storage-local': 'app/libs/angular-translate-storage-local.min',
        'angular-translate-loader-static-files': 'app/libs/angular-translate-loader-static-files.min',
        'angular-translate-loader-url': 'app/libs/angular-translate-loader-url.min',

        'app': 'app/app',

        'nav': 'app/nav/nav',
        'nav.controllers': 'app/nav/controllers',
        'nav.services': 'app/nav/services',
        'nav.directives': 'app/nav/directives',

        'form': 'app/form/form',
        'form.directives': 'app/form/directives',

        'form': 'app/form/form',
        'form.directives': 'app/form/directives',

        'utility': 'app/utilities/utility',
        'utility.historyUtility': 'app/utilities/historyUtility',
        'utility.directives': 'app/utilities/directives',
        'utility.controllers': 'app/utilities/controller',

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
        'report.factory': 'app/reporting/reportFactory',
        
        'gatekeeper': 'app/libs/gatekeeper-angular'
    },
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
    callback: function() {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['mps']);
        });
    }
});

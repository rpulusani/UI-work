requirejs.config({
    baseUrl: '/',
    deps: [
        'lxk.fef',
        'app'
    ],
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

        'app': [
            'gatekeeper',

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
            'utility.blankCheckUtility',
            'utility.directives',
            'utility.controllers',

            'user',
            'user.factory',
            'user.directives',

            'serviceRequest',
            'serviceRequest.factory',
            'serviceRequest.directives',

            'contact',
            'contact.controller',
            'contact.factory',
            'contact.directives',

            'invoice',

            'pageCount',

            'deviceManagement',
            'deviceManagement.controller',
            'deviceManagement.factory',
            'deviceManagement.directives',

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
        'utility.blankCheckUtility': ['utility'],
        'utility.directives': ['utility'],
        'utility.controllers' : ['utility'],

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
        'deviceManagement.controller': ['deviceManagement', 'deviceManagement.factory','utility.blankCheckUtility'],
        'deviceManagement.directives': ['deviceManagement'],
        'deviceManagement.factory': ['deviceManagement'],

        'report': ['angular', 'angular-route'],
        'report.controller': ['report', 'report.factory', 'utility.historyUtility'],
        'report.directives': ['report'],
        'report.factory': ['report'],

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
        'init': 'app/init',

        'nav': 'app/nav/nav',
        'nav.controllers': 'app/nav/controllers',
        'nav.services': 'app/nav/services',
        'nav.directives': 'app/nav/directives',

        'form': 'app/form/form',
        'form.directives': 'app/form/directives',

        'utility': 'app/utilities/utility',
        'utility.historyUtility': 'app/utilities/historyUtility',
        'utility.blankCheckUtility': 'app/utilities/blankCheckUtility',
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
        'deviceManagement.controller': 'app/device_management/controller',
        'deviceManagement.directives': 'app/device_management/directives',
        'deviceManagement.factory': 'app/device_management/deviceManagementFactory',

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
    }
});

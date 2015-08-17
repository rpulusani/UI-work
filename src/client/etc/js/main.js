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
        'routes',

        'common',
        'common.navController',
        'common.baseService',
        'common.directives',

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
        'contact.factory'
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
                'angular-translate-loader-url'],
        'routes': ['app'],

        'common': ['app'],
        'common.topNavController': ['app', 'common', 'common.baseService'],
        'common.baseService': ['app', 'common'],
        'common.navController': ['app', 'common', 'common.baseService'],
        'common.directives': ['app', 'common'],

        'user': ['app'],
        'user.factory': ['app', 'user'],
        'user.directives': ['app', 'user'],

        'serviceRequest': ['app', 'common'],
        'serviceRequest.factory': ['app', 'serviceRequest'],
        'serviceRequest.directives': ['app', 'serviceRequest'],

        'address': ['app'],
        'address.controller': ['app', 'address', 'address.factory', 'contact.factory'],
        'address.directives': ['app', 'address'],
        'address.factory': ['app', 'address', 'serviceRequest.factory', 'common.baseService'],

        'contact': ['app'],
        'contact.controller': ['app', 'contact', 'contact.factory'],
        'contact.directives': ['app', 'contact'],
        'contact.factory': ['app', 'contact']
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
        'routes': 'app/routes',

        'common': 'app/common/common',
        'common.baseService': 'app/common/baseService',
        'common.navController': 'app/common/navigation-controller',
        'common.directives': 'app/common/directives',

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
        'contact.factory': 'app/contact_service_requests/contactsFactory'
    },
    map: {
        "*": {
            "jquery": "jquery-private",
            "stable": "modules"
        },
        "jquery-private": {"jquery": "jquery"}
    },
    bundles: {
        "lxk.fef": [
            "jquery",
            "fef.jquery",
            "jquery-private",
            "throttle-debounce",
            "modernizr",
            "variables",
            "modules/alerts",
            "modules/banner",
            "modules/breadcrumb",
            "modules/card",
            "modules/carousel",
            "modules/custom-input",
            "modules/dropdown",
            "modules/form-selectbox",
            "modules/form",
            "modules/griddy",
            "modules/media-queries",
            "modules/modal",
            "modules/modalmanager",
            "modules/quote",
            "modules/rail-nav",
            "modules/responsive-images",
            "modules/responsive-tables",
            "modules/set",
            "modules/sifter",
            "modules/slide-in-panel"
        ]
    },
    callback: function() {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['mps']);
        });
    }
});

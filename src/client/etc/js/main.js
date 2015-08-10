requirejs.config({
    baseUrl: '/',
    deps: [
        'lxk.fef',
        
        'angular',
        'angular-resource',
        'angular-route',
        
        'app',
        'routes',
        
        'common',
        'common.topNavController',
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
        
        'app': ['angular', 'angular-resource', 'angular-route'],
        'routes': ['app'],
        
        'common': ['app'],
        'common.topNavController': ['app', 'common', 'common.baseService'],
        'common.baseService': ['app', 'common'],
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

        'angular': 'js/libs/angular.min',
        'angular-resource': 'js/libs/angular-resource.min',
        'angular-route': 'js/libs/angular-route.min',
        
        'app': 'js/app',
        'routes': 'js/routes',
        
        'common': 'js/common/common',
        'common.topNavController': 'js/common/top-navigation-controller',
        'common.baseService': 'js/common/baseService',
        'common.directives': 'js/common/directives',
        
        'user': 'js/users/user',
        'user.factory': 'js/users/usersFactory',
        'user.directives': 'js/users/directives',
        
        'serviceRequest': 'js/service_requests/serviceRequest',
        'serviceRequest.factory': 'js/service_requests/serviceRequestsFactory',
        'serviceRequest.directives': 'js/service_requests/directives',
        
        'address': 'js/address_service_requests/addressServiceRequest',
        'address.controller': 'js/address_service_requests/controller',
        'address.directives': 'js/address_service_requests/directives',
        'address.factory': 'js/address_service_requests/addressesFactory',
        
        'contact': 'js/contact_service_requests/contactServiceRequest',
        'contact.controller': 'js/contact_service_requests/controller',
        'contact.directives': 'js/contact_service_requests/directives',
        'contact.factory': 'js/contact_service_requests/contactsFactory'
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
    }
});

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
        'angular-spring-data-rest': ['angular-resource'],

        'pdfMakeLib': {
            exports: 'pdfMake'
        },
        'pdfmake': {
            deps: ['pdfMakeLib'],
            exports: 'pdfMake'
        },
        'angular-sanitize': ['angular'],
        'app': [
            'angular-gatekeeper',

            'dashboard',
            'dashboard.dashboardController',

            'nav',
            'nav.navController',
            'nav.navFactory',
            'nav.navItemFactory',
            'nav.directives',

            'chart',
            'chart.chartingController',
            'chart.directives',

            'form',
            'form.directives',

            'account',
            'account.accountFactory',
            'account.roleFactory',

            'user',
            'user.factory',
            'user.directives',
            'user.userController',
            'user.usersController',
            'user.accountListController',
            'user.roleListController',

            'invoice',

            'pageCount',

            'report',
            'report.reportController',
            'report.reportListController',
            'report.directives',
            'report.factory',

            'tree',
            'tree.treeItemsService',
            'tree.treeController',
            'tree.treeItemController',
            'tree.directives'
        ],

        'chart': ['angular', 'chartjs'],
        'chart.chartingController': ['chartjs'],
        'chart.directives': ['chartjs'],

        'form':['angular', 'lxk.fef'],
        'form.directives': ['form'],

        'account': ['angular'],
        'account.accountFactory': ['account'],
        'account.roleFactory': ['account'],

        'user': ['angular', 'utility.urlHelper'],
        'user.factory': ['user'],
        'user.directives': ['user'],
        'user.userController': ['user'],
        'user.usersController': ['user'],
        'user.accountListController': ['user','account.accountFactory'],
        'user.roleListController': ['user','account.roleFactory'],

        'invoice': ['angular', 'angular-route'],

        'pageCount': ['angular', 'angular-route'],

        'report': ['angular', 'angular-route'],
        'report.reportController': ['report', 'report.factory'],
        'report.reportListController': ['report', 'report.factory'],
        'report.directives': ['report'],
        'report.factory': ['report'],

        'angular-gatekeeper': ['angular-cookies', 'angular-route'],

        'ui.grid' : ['angular', 'pdfmake']
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
        'angular-spring-data-rest': 'app/libs/angular-spring-data-rest.min',

        'chartjs': 'app/libs/Chart.min',

        'pdfmake': 'app/libs/vfs_fonts',
        'pdfMakeLib': 'app/libs/pdfmake.min',

        'angular-sanitize': 'app/libs/angular-sanitize.min',

        'ui.grid' : 'app/libs/ui-grid',

        'app': 'app/app',

        'nav': 'app/nav/nav',
        'nav.navController': 'app/nav/navController',
        'nav.navFactory': 'app/nav/navFactory',
        'nav.navItemFactory': 'app/nav/navItemFactory',
        'nav.directives': 'app/nav/directives',

        'form': 'app/form/form',
        'form.directives': 'app/form/directives',

        'chart': 'app/chart/charts',
        'chart.chartingController': 'app/chart/chartController',
        'chart.directives': 'app/chart/directives',

        'utility': 'app/utilities/utility',
        'utility.historyUtility': 'app/utilities/historyUtility',
        'utility.blankCheckUtility': 'app/utilities/blankCheckUtility',
        'utility.formatUtility': 'app/utilities/formatUtility',
        'utility.directives': 'app/utilities/directives',
        'utility.controller': 'app/utilities/controller',
        'utility.contactPickerController': 'app/utilities/contactPickerController',
        'utility.pageCountSelectController': 'app/utilities/pageCountSelectController',
        'utility.pageCountSelectService': 'app/utilities/pageCountSelectService',
        'utility.personalizationService': 'app/utilities/personalizationService',
        'utility.urlHelper': 'app/utilities/urlHelper',
        'utility.recursionHelper': 'app/utilities/recursionHelper',
        'utility.formatters': 'app/utilities/formatters',
        'utility.hateaosConfig': 'app/utilities/hateaosConfig',
        'utility.hateaosFactory': 'app/utilities/hateaosFactory',
        'utility.grid': 'app/utilities/grid',

        'account': 'app/accounts/account',
        'account.accountFactory': 'app/accounts/accountFactory',
        'account.roleFactory': 'app/accounts/roleFactory',

        'user': 'app/users/user',
        'user.factory': 'app/users/usersFactory',
        'user.directives': 'app/users/directives',
        'user.userController': 'app/users/userController',
        'user.usersController': 'app/users/usersController',
        'user.accountListController': 'app/users/accountListController',
        'user.roleListController': 'app/users/roleListController',

        'serviceRequest': 'app/service_requests/serviceRequest',
        'serviceRequest.factory': 'app/service_requests/serviceRequestsFactory',
        'serviceRequest.serviceRequestController': 'app/service_requests/serviceRequestController',
        'serviceRequest.directives': 'app/service_requests/directives',
        'serviceRequest.listController': 'app/service_requests/serviceRequestListController',

        'address': 'app/address_service_requests/addressServiceRequest',
        'address.addressController': 'app/address_service_requests/addressController',
        'address.addressListController': 'app/address_service_requests/addressListController',
        'address.directives': 'app/address_service_requests/directives',
        'address.factory': 'app/address_service_requests/addressesFactory',

        'contact': 'app/contact_service_requests/contactServiceRequest',
        'contact.contactController': 'app/contact_service_requests/contactController',
        'contact.contactListController': 'app/contact_service_requests/contactListController',
        'contact.directives': 'app/contact_service_requests/directives',
        'contact.factory': 'app/contact_service_requests/contactsFactory',

        'invoice': 'app/invoices/invoice',

        'pageCount': 'app/page_count/pageCount',

        'deviceManagement': 'app/device_management/deviceManagement',
        'deviceManagement.deviceController': 'app/device_management/deviceController',
        'deviceManagement.deviceListController': 'app/device_management/deviceListController',
        'deviceManagement.deviceInformationController': 'app/device_management/deviceInformationController',
        'deviceManagement.devicePageCountsController': 'app/device_management/devicePageCountsController',
        'deviceManagement.deviceOrderController': 'app/device_management/deviceOrderController',
        'deviceManagement.deviceRequestBreakFixController': 'app/device_management/deviceRequestBreakFixListController',
        'deviceManagement.devicePickerController': 'app/device_management/devicePickerController',
        'deviceManagement.directives': 'app/device_management/directives',
        'deviceManagement.deviceFactory': 'app/device_management/deviceFactory',
        'deviceManagement.pageCountFactory': 'app/device_management/pageCountFactory',
        'deviceManagement.meterReadFactory': 'app/device_management/meterReadFactory',
        'deviceManagement.deviceOrderFactory': 'app/device_management/deviceOrderFactory',
        'deviceManagement.deviceRequestFactory': 'app/device_management/deviceRequestFactory',
        'deviceManagement.devicePickerFactory': 'app/device_management/devicePickerFactory',

        'deviceServiceRequest': 'app/device_service_requests/deviceServiceRequest',
        'deviceServiceRequest.deviceAddController': 'app/device_service_requests/deviceAddController',
        'deviceServiceRequest.deviceSearchController': 'app/device_service_requests/deviceSearchController',
        'deviceServiceRequest.deviceServiceRequestDeviceController': 'app/device_service_requests/deviceServiceRequestDeviceController',
        'deviceServiceRequest.deviceDecommissionController': 'app/device_service_requests/deviceDecommissionController',
        'deviceServiceRequest.directives': 'app/device_service_requests/directives',
        'deviceServiceRequest.deviceSearchFactory': 'app/device_service_requests/deviceSearchFactory',
        'deviceServiceRequest.deviceServiceRequestFactory': 'app/device_service_requests/deviceServiceRequestFactory',

        'report': 'app/reporting/report',
        'report.reportController': 'app/reporting/reportController',
        'report.reportListController': 'app/reporting/reportListController',
        'report.directives': 'app/reporting/directives',
        'report.factory': 'app/reporting/reportFactory',

        'dashboard': 'app/dashboard/dashboard',
        'dashboard.dashboardController': 'app/dashboard/dashboardController',

        'angular-gatekeeper': 'app/libs/angular-gatekeeper',

        'tree': 'app/tree/module',
        'tree.treeItemsService': 'app/tree/treeItemsService',
        'tree.treeController': 'app/tree/treeController',
        'tree.treeItemController': 'app/tree/treeItemController',
        'tree.directives': 'app/tree/directives'
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

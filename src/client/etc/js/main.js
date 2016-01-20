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

            'hateoasFactory',
            'hateoasFactory.serviceFactory',

            'dashboard',
            'dashboard.dashboardController',

            'library',
            'library.libraryFactory',
            'library.libraryListController',
            'library.libraryNewController',
            'library.libraryUpdateController',
            'library.libraryViewController',

            'nav',
            'nav.navController',
            'nav.navFactory',
            'nav.navItemFactory',
            'nav.directives',

            'rome',

            'address',
            'address.addressController',
            'address.addressListController',
            'address.directives',
            'address.factory',

            'form',
            'form.datePicker',
            'form.directives',

            'account',
            'account.accountFactory',
            'account.roleFactory',

            'user',
            'user.factory',
            'user.userInfoFactory',
            'user.directives',
            'user.userController',
            'user.usersController',
            'user.accountListController',
            'user.roleListController',

            'pageCount',

            'report',
            'report.reportController',
            'report.reportListController',
            'report.reportFinderController',
            'report.directives',
            'report.factory',

            'tree',
            'tree.treeItemsService',
            'tree.treeController',
            'tree.treeItemController',
            'tree.directives'
        ],

        'googlecharting': ['angular'],

        'rome': ['angular'],

        'form':['angular', 'lxk.fef'],
        'form.datePicker' : ['form'],
        'form.directives': ['form'],

        'account': ['angular'],
        'account.accountFactory': ['account'],
        'account.roleFactory': ['account'],

        'library': ['angular'],
        'library.libraryListController': ['library'],
        'library.libraryNewController': ['library'],
        'library.libraryUpdateController': ['library'],
        'library.libraryViewController': ['library'],
        'library.libraryFactory': ['library'],
        'library.directives': ['library'],

        'user': ['angular', 'utility.urlHelper'],
        'user.factory': ['user'],
        'user.userInfoFactory': ['user'],
        'user.directives': ['user'],
        'user.userController': ['user'],
        'user.usersController': ['user'],
        'user.accountListController': ['user','account.accountFactory'],
        'user.roleListController': ['user','account.roleFactory'],

        'address': ['angular'],
        'address.addressController': ['address'],
        'address.addressListController': ['address'],
        'address.directives': ['address'],
        'address.factory': ['address'],

        'pageCount': ['angular', 'angular-route'],

        'report': ['angular', 'angular-route'],
        'report.reportController': ['report', 'report.factory'],
        'report.reportListController': ['report', 'report.factory'],
        'report.reportFinderController': ['report', 'report.factory'],
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

        'googlecharting': 'app/libs/ng-google-chart',

        'rome': 'app/libs/rome.min',

        'pdfmake': 'app/libs/vfs_fonts',
        'pdfMakeLib': 'app/libs/pdfmake.min',

        'angular-sanitize': 'app/libs/angular-sanitize.min',

        'ui.grid' : 'app/libs/ui-grid/3.1.0/ui-grid',

        'app': 'app/app',

        'hateoasFactory': 'app/hateoas_factory/hateoasFactory',
        'hateoasFactory.serviceFactory': 'app/hateoas_factory/hateoasServiceFactory',

        'filterSearch': 'app/filter_search/filterSearch',
        'filterSearch.gridFilterController': 'app/filter_search/gridFilterController',
        'filterSearch.gridSearchController': 'app/filter_search/gridSearchController',
        'filterSearch.chlFilterController': 'app/filter_search/chlFilterController',
        'filterSearch.filterSearchService': 'app/filter_search/filterSearchService',
        'filterSearch.directives': 'app/filter_search/directives',

        'security': 'app/security/security',
        'security.securityService': 'app/security/securityService',
        'security.securityHelper': 'app/security/securityHelper',

        'nav': 'app/nav/nav',
        'nav.navController': 'app/nav/navController',
        'nav.navFactory': 'app/nav/navFactory',
        'nav.navItemFactory': 'app/nav/navItemFactory',
        'nav.directives': 'app/nav/directives',

        'form': 'app/form/form',
        'form.datePicker': 'app/form/datePickerController',
        'form.directives': 'app/form/directives',

        'utility': 'app/utilities/utility',
        'utility.historyUtility': 'app/utilities/historyUtility',
        'utility.blankCheckUtility': 'app/utilities/blankCheckUtility',
        'utility.directives': 'app/utilities/directives',
        'utility.controller': 'app/utilities/controller',
        'utility.contactPickerController': 'app/utilities/contactPickerController',
        'utility.addressPickerController': 'app/utilities/addressPickerController',
        'utility.devicePickerController': 'app/utilities/devicePickerController',
        'utility.pageCountSelectController': 'app/utilities/pageCountSelectController',
        'utility.pageCountSelectService': 'app/utilities/pageCountSelectService',
        'utility.personalizationService': 'app/utilities/personalizationService',
        'utility.urlHelper': 'app/utilities/urlHelper',
        'utility.recursionHelper': 'app/utilities/recursionHelper',
        'utility.formatters': 'app/utilities/formatters',
        'utility.hateaosConfig': 'app/utilities/hateaosConfig',
        'utility.hateaosFactory': 'app/utilities/hateaosFactory',
        'utility.grid': 'app/utilities/grid',
        'utility.imageService': 'app/utilities/imageService',
        'utility.columnPickerController': 'app/utilities/columnPickerController',

        'account': 'app/accounts/account',
        'account.accountFactory': 'app/accounts/accountFactory',
        'account.roleFactory': 'app/accounts/roleFactory',

        'user': 'app/users/user',
        'user.factory': 'app/users/usersFactory',
        'user.userInfoFactory': 'app/users/userInfoFactory',
        'user.directives': 'app/users/directives',
        'user.userController': 'app/users/userController',
        'user.usersController': 'app/users/usersController',
        'user.accountListController': 'app/users/accountListController',
        'user.roleListController': 'app/users/roleListController',

        'serviceRequest': 'app/service_requests/serviceRequest',
        'serviceRequest.factory': 'app/service_requests/serviceRequestsFactory',
        'serviceRequest.directives': 'app/service_requests/directives',
        'serviceRequest.detailController': 'app/service_requests/serviceRequestDetailController',
        'serviceRequest.listController': 'app/service_requests/serviceRequestListController',
        'serviceRequest.listDeviceController': 'app/service_requests/serviceRequestDeviceListController',
        'serviceRequest.listBreakFixController': 'app/service_requests/serviceRequestBreakFixListController',
        'serviceRequest.listAddressController': 'app/service_requests/serviceRequestAddressListController',
        'serviceRequest.listContactController': 'app/service_requests/serviceRequestContactListController',
        'serviceRequest.TabController': 'app/service_requests/serviceRequestTabController',
        'serviceRequest.ActionButtonController': 'app/service_requests/serviceRequestActionButtonsController',
        'serviceRequest.controllerHelperService': 'app/service_requests/srControllerHelperService',

        'order': 'app/orders/order',
        'order.factory': 'app/orders/ordersFactory',
        'order.orderItemsfactory': 'app/orders/orderItemsFactory',
        'order.directives': 'app/orders/directives',
        'order.orderListController': 'app/orders/orderListController',
        'order.deviceOrderListController': 'app/orders/deviceOrderListController',
        'order.supplyOrderListController': 'app/orders/supplyOrderListController',
        'order.orderSupplyController': 'app/orders/orderSupplyController',
        'order.tabController': 'app/orders/orderTabController',
        'order.actionButtonController': 'app/orders/orderActionButtonsController',

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
        'invoice.invoiceController': 'app/invoices/invoiceController',
        'invoice.directives': 'app/invoices/directives',
        'invoice.invoiceListController': 'app/invoices/invoiceListController',
        'invoice.invoiceListFactory': 'app/invoices/invoiceListFactory',

        'pageCount': 'app/page_count/pageCount',

        'deviceManagement': 'app/device_management/deviceManagement',
        'deviceManagement.deviceController': 'app/device_management/deviceController',
        'deviceManagement.deviceListController': 'app/device_management/deviceListController',
        'deviceManagement.deviceInformationController': 'app/device_management/deviceInformationController',
        'deviceManagement.deviceOrderController': 'app/device_management/deviceOrderController',
        'deviceManagement.deviceRequestBreakFixController': 'app/device_management/deviceRequestBreakFixListController',
        'deviceManagement.directives': 'app/device_management/directives',
        'deviceManagement.deviceFactory': 'app/device_management/deviceFactory',
        'deviceManagement.productModelFactory': 'app/device_management/productModelFactory',
        'deviceManagement.meterReadFactory': 'app/device_management/meterReadFactory',
        'deviceManagement.deviceRequestFactory': 'app/device_management/deviceRequestFactory',

        'deviceServiceRequest': 'app/device_service_requests/deviceServiceRequest',
        'deviceServiceRequest.deviceAddController': 'app/device_service_requests/deviceAddController',
        'deviceServiceRequest.deviceUpdateController': 'app/device_service_requests/deviceUpdateController',
        'deviceServiceRequest.deviceSearchController': 'app/device_service_requests/deviceSearchController',
        'deviceServiceRequest.deviceServiceRequestDeviceController': 'app/device_service_requests/deviceServiceRequestDeviceController',
        'deviceServiceRequest.deviceDecommissionController': 'app/device_service_requests/deviceDecommissionController',
        'deviceServiceRequest.directives': 'app/device_service_requests/directives',
        'deviceServiceRequest.deviceSearchFactory': 'app/device_service_requests/deviceSearchFactory',
        'deviceServiceRequest.deviceServiceRequestFactory': 'app/device_service_requests/deviceServiceRequestFactory',

        'library': 'app/library/library',
        'library.libraryListController': 'app/library/libraryListController',
        'library.libraryNewController': 'app/library/libraryNewController',
        'library.libraryUpdateController': 'app/library/libraryUpdateController',
        'library.libraryViewController': 'app/library/libraryViewController',
        'library.libraryFactory': 'app/library/libraryFactory',
        'library.directives': 'app/library/directives',

        'report': 'app/reporting/report',
        'report.reportController': 'app/reporting/reportController',
        'report.reportListController': 'app/reporting/reportListController',
        'report.reportFinderController': 'app/reporting/reportFinderController',
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

define([
    'angular',
    'angular-resource',
    'angular-route',
    'angular-cookies',
    'angular-translate',
    'angular-translate-storage-cookie',
    'angular-translate-storage-local',
    'angular-translate-loader-static-files',
    'angular-translate-loader-url',
    'angular-sanitize',
    'ui.grid',
    'angular-spring-data-rest',
    'serviceRequest',
    'serviceRequest.factory',
    'serviceRequest.serviceRequestStatusFactory',
    'serviceRequest.serviceRequestTypeFactory',
    'serviceRequest.directives',
    'serviceRequest.listController',
    'serviceRequest.listDeviceController',
    'serviceRequest.listBreakFixController',
    'serviceRequest.listAddressController',
    'serviceRequest.listContactController',
    'serviceRequest.controllerHelperService',
    'serviceRequest.TabController',
    'serviceRequest.ActionButtonController',
    'serviceRequest.detailController',
    'serviceRequest.cancelController',
    'serviceRequest.openServiceRequestController',
    'order',
    'order.factory',
    'order.orderTypeFactory',
    'order.orderStatusFactory',
    'order.directives',
    'order.orderListController',
    'order.deviceOrderListController',
    'order.supplyOrderListController',
    'order.tabController',
    'order.actionButtonController',
    'order.orderSupplyController',
    'order.orderItemsfactory',
    'order.assetsPartsFactory',
    'order.orderContentsController',
    'order.orderPurchaseController',
    'contact',
    'contact.contactController',
    'contact.contactDeleteController',
    'contact.contactListController',
    'contact.contactAddController',
    'contact.contactUpdateTabController',
    'contact.contactUpdateController',
    'contact.contactUpdateAddressController',
    'contact.factory',
    'contact.directives',
    'deviceManagement',
    'deviceManagement.deviceController',
    'deviceManagement.deviceListController',
    'deviceManagement.deviceInformationController',
    'deviceManagement.deviceOrderController',
    'deviceManagement.deviceRequestBreakFixController',
    'deviceManagement.deviceFactory',
    'deviceManagement.deviceLocationFactory',
    'deviceManagement.productModelFactory',
    'deviceManagement.meterReadFactory',
    'deviceManagement.deviceRequestFactory',
    'deviceManagement.directives',
    'deviceManagement.deviceNotificationController',
    'deviceServiceRequest',
    'deviceServiceRequest.deviceAddController',
    'deviceServiceRequest.deviceUpdateController',
    'deviceServiceRequest.deviceSearchController',
    'deviceServiceRequest.deviceServiceRequestDeviceController',
    'deviceServiceRequest.deviceDecommissionController',
    'deviceServiceRequest.directives',
    'deviceServiceRequest.deviceSearchFactory',
    'deviceServiceRequest.deviceServiceRequestFactory',
    'pageCount',
    'pageCount.directives',
    'pageCount.missingPageCountListController',
    'pageCount.pageCountTabController',
    'pageCount.pageCountListController',
    'pageCount.pageCountFactory',
    'library',
    'library.libraryController',
    'library.libraryDeleteInlineController',
    'library.libraryListController',
    'library.libraryViewController',
    'library.libraryFactory',
    'library.libraryTagFactory',
    'library.directives',
    'invoice',
    'invoice.invoiceController',
    'invoice.invoiceListController',
    'invoice.invoiceListFactory',
    'invoice.directives',
    'hateoasFactory.serviceFactory',
    'utility',
    'utility.historyUtility',
    'utility.blankCheckUtility',
    'utility.directives',
    'utility.controller',
    'utility.contactPickerController',
    'utility.addressPickerController',
    'utility.addressBillToPickerController',
    'utility.addressShipToPickerController',
    'utility.devicePickerController',
    'utility.pageCountSelectController',
    'utility.pageCountSelectService',
    'utility.recursionHelper',
    'utility.personalizationService',
    'utility.formatters',
    'utility.hateaosConfig',
    'utility.hateaosFactory',
    'utility.grid',
    'utility.imageService',
    'utility.columnPickerController',
    'utility.printExportTitleController',
    'filterSearch',
    'filterSearch.directives',
    'filterSearch.gridFilterController',
    'filterSearch.gridSearchController',
    'filterSearch.chlFilterController',
    'filterSearch.locationFilterController',
    'filterSearch.bookmarkFilterController',
    'filterSearch.libraryFilterController',
    'filterSearch.statusFilterController',
    'filterSearch.orderStatusFilterController',
    'filterSearch.requestStatusFilterController',
    'filterSearch.supplyOrderTypeFilterController',
    'filterSearch.deviceRequestTypeFilterController',
    'filterSearch.invitedStatusFilterController',
    'filterSearch.roleFilterController',
    'filterSearch.dateRangeFilterController',
    'filterSearch.invoiceDateFilterController',
    'filterSearch.accountFilterController',
    'filterSearch.soldToFilterController',
    'filterSearch.meterReadTypeFilterController',
    'filterSearch.filterSearchService',
    'security',
    'security.securityService',
    'security.securityHelper',
    'vButton'
], function(angular) {
    'use strict';
    angular.module('mps', [
        'ngRoute',
        'ngResource',
        'ngCookies',
        'ngSanitize',
        'googlechart',
        'ngTagsInput',
        'pascalprecht.translate',
        'vButton',
        'mps.hateoasFactory',
        'mps.dashboard',
        'mps.account',
        'mps.serviceRequests',
        'mps.serviceRequestAddresses',
        'mps.serviceRequestContacts',
        'mps.serviceRequestDevices',
        'mps.queue',
        'mps.orders',
        'mps.user',
        'mps.security',
        'mps.report',
        'mps.invoice',
        'mps.deviceManagement',
        'mps.library',
        'mps.pageCount',
        'mps.nav',
        'mps.utility',
        'angular-gatekeeper',
        'mps.form',
        'mps.filterSearch',
        'ui.grid',
        'ui.grid.edit',
        'ui.grid.rowEdit',
        'ui.grid.cellNav',
        'ui.grid.resizeColumns',
        'ui.grid.moveColumns',
        'ui.grid.selection',
        'ui.grid.pagination',
        'ui.grid.exporter',
        'ui.grid.autoResize',
        'spring-data-rest',
        'tree'
    ])

    .factory('errorLogInterceptor', function() {
        return {
            responseError: function(response) {
                if(console && typeof(console.log) === 'function') {
                    //console.log('Error: ' + JSON.stringify(response));
                }
                NREUM.noticeError(response);
                return response;
            }
        };
    })
    .factory('halInterceptor', function() {
        return {
            response: function(response) {
                angular.copy(response.data._embedded, response.resource);
                return response;
            }
        };
    })
    .constant('serviceUrl', config.portal.serviceUrl)
    .constant('lbsURL', config.portal.lbsUrl)
    .constant('permissionSet', {
        dashboard:{
            view: 'VIEW_HOME_PAGE'
        },
        lbs:{
            view: 'LBS_ENABLED'
        },
        userManagement: {
            impersonate: 'IMPERSONATE_VIEW',
            createUser: 'CREATE_NEW_USER',
            manageUser: 'MANAGE_USER_PROFILE',
            profileReport: 'USER_PROFILE_REPORT',
            disableUser: 'DISABLE_USER',
            reactivateUser: 'REACTIVATE_USER',
            approvals: 'MY_APPROVALS',
            manageMyProfile: 'MANAGE_MY_PROFILE',
            inviteUser: 'INVITE_NEW_USER'
        },
        deviceManagement:{
            search: 'SEARCH_ASSET',
            view: 'VIEW_DEVICE_DETAIL',
            controlPanel: 'VIEW_DEVICE_CONTROL_PANEL',
            updatePageCount: 'UPDATE_PAGE_COUNTS',
            viewSRHistory: 'VIEW_SR_HISTORY',
            viewOpenSR: 'VIEW_OPEN_SRS',
            viewOpenOrders: 'VIEW_OPEN_ORDERS'
        },
        serviceRequestManagement:{
            viewBreakFix:'VIEW_BREAKFIX_REQUEST',
            createBreakFix: 'REQUEST_BREAKFIX',
            viewSuppliesOrder: 'VIEW_SUPPLIES_ORDERS',
            viewHardwareOrder: 'VIEW_HARDWARE_ORDER',
            orderSuppliesCatalog: 'ORDER_SUPPLIES_CATALOG',
            orderSuppliesAsset: 'ORDER_SUPPLIES_ASSET',
            createSuppliesReturn: 'CREATE_SUPPLIES_RETURN_REQUEST',
            orderHardware: 'ORDER_HARDWARE',
            orderInstallHardware: 'ORDER_INSTALL_HARDWARE',
            uploadConsumableOrder: 'MASS_UPLOAD_FOR_CONSUMABLES_ORDER',
            uploadHardwareOrder: 'MASS_UPLOAD_FOR_HARDWARE_ORDER',
            createPONumber: 'INITIATE_NEW_PO_NUMBER',
            viewMADC: 'VIEW_MADC_REQUESTS',
            moveMADC: 'MOVE_MADC_REQUEST',
            addMADC: 'ADD_MADC_REQUEST',
            deinstallMADC: 'DEINSTALL_MADC_REQUEST',
            decommissionMADC: 'DECOMMISSION_MADC_REQUEST',
            changeMADC: 'CHANGE_MADC_REQUEST',
            uploadMADC: 'MASS_UPLOAD_MADC',
            viewContactAddress: 'VIEW_CONTACT_AND_ADDRESS',
            contactMADC: 'CONTACT_MADC_REQUEST',
            addressMADC: 'ADDRESS_MADC_REQUEST',
            chlMADC: 'CHL_MADC_REQUEST'
        },
        invoices: {
            view: 'VIEW_INVOICES'
        },
        reports: {
            viewRunStandard: 'VIEW_AND_RUN_STANDARD',
            viewStrategic: 'VIEW_STRATEGIC_REPORTS',
            upload: 'UPLOAD_REPORT'
        },
        contentManagement:{
            viewNonstrategic: 'VIEW_NONSTRATEGIC_DOCS',
            viewStrategic: 'VIEW_STRATEGIC_DOCS',
            upload: 'UPLOAD_DOCS',
            deleteMy: 'DELETE_ONLY_MY_DOCS',
            deleteAll: 'DELETE_ALL_DOCS',
            manageAccountTag: 'MANAGE_ACCOUNT_TAG',
            manageGlobalTag: 'MANAGE_GLOBAL_TAG'
        },
        admin:{
            report: 'ADMIN_REPORT_DOCUMENT',
            homepage:'ADMIN_HOME_PAGE',
            translationManager: 'ADMIN_TRANSLATION_MANAGER'
        }
    })
    .config(function (SpringDataRestAdapterProvider) {

        // set the links key to _myLinks
        SpringDataRestAdapterProvider.config({
            embeddedNamedResources: true
        });
    })
    .config(function(GatekeeperProvider, serviceUrl){
        GatekeeperProvider.configure({
            serviceUri: config.idp.serviceUrl,
            clientId: config.idp.clientId
        });
        GatekeeperProvider.protect(serviceUrl);
    })

    .run(['Gatekeeper', '$rootScope', '$cookies','$q', 'UserService','SecurityService', 'SecurityHelper', 'permissionSet',
    function(Gatekeeper, $rootScope, $cookies, $q, UserService, SecurityService, SecurityHelper, permissionSet) {

        Gatekeeper.login({organization_id: '30', federation_redirect: 'true'});

        $rootScope.idpUser = Gatekeeper.user;
        $rootScope.currentUser = {
            deferred: $q.defer()
        };
        var security = new SecurityService();
        var configurePermissions = [
            {
                name: 'documentLibraryAccess',
                permission: [
                    permissionSet.contentManagement.viewNonstrategic,
                    permissionSet.contentManagement.viewStrategic
                ]
            },
            {
                name: 'deviceInfoAccess',
                permission: permissionSet.deviceManagement.view
            },
            {
                name:'lbsAccess',
                permission: permissionSet.lbs.view
            },
            {
                name: 'deviceView',
                permission: permissionSet.deviceManagement.view
            },
            {
                name: 'serviceHistoryAccess',
                permission: [
                    permissionSet.deviceManagement.viewSRHistory,
                    permissionSet.deviceManagement.viewOpenSR
                ]
            },
            {
                name: 'pageCountAccess',
                permission: permissionSet.deviceManagement.updatePageCount
            },
            {
                name: 'addDevice',
                permission: permissionSet.serviceRequestManagement.addMADC
            },
            {
                name: 'orderDevice',
                permission: permissionSet.serviceRequestManagement.orderHardware
            },
            {
                name: 'searchDevice',
                permission: permissionSet.deviceManagement.search
            },
            {
                name: 'viewHomePage',
                permission: permissionSet.dashboard.view
            },
            {
                name: 'addressAccess',
                permission: permissionSet.serviceRequestManagement.addressMADC
            },
            {
                name: 'contactAccess',
                permission: permissionSet.serviceRequestManagement.contactMADC
            },
            {
                name: 'decommissionAccess',
                permission: [
                    permissionSet.serviceRequestManagement.decommissionMADC,
                    permissionSet.serviceRequestManagement.deinstallMADC
                ]
            },
            {
                name: 'createBreakFixAccess',
                permission: permissionSet.serviceRequestManagement.createBreakFix
            },
            {
                name: 'controlPanelAccess',
                permission: permissionSet.deviceManagement.controlPanel
            },
            {
                name:'updateDevice',
                permission: permissionSet.serviceRequestManagement.changeMADC
            },
            {
                name:'updateDeviceAccess',
                permission: [
                    permissionSet.serviceRequestManagement.changeMADC,
                    permissionSet.serviceRequestManagement.moveMADC
                ]
            },
            {
                name:'deviceAccess',
                permission: [
                    permissionSet.deviceManagement.search,
                    permissionSet.deviceManagement.view
                ]
            },
            {
                name:'addressContactAccess',
                permission: permissionSet.serviceRequestManagement.viewContactAddress
            },
            {
                name: 'openOrderAccess',
                 permission: permissionSet.deviceManagement.viewOpenOrders
            },
            {
                name:'orderSupplies',
                permission: permissionSet.serviceRequestManagement.uploadConsumableOrder

            },
            {
                name:'orderSuppliesAsset',
                permission: permissionSet.serviceRequestManagement.orderSuppliesAsset

            },
            {
                name:'orderSuppliesCatalog',
                permission: permissionSet.serviceRequestManagement.orderSuppliesCatalog
            },
            {
                name:'orderHardware',
                permission: [
                    permissionSet.serviceRequestManagement.orderHardware,
                    permissionSet.serviceRequestManagement.orderInstallHardware
                ]
            },
            {
                name:'createSuppliesReturn',
                permission: permissionSet.serviceRequestManagement.createSuppliesReturn

            },
            {
                name:'orderAccess',
                permission: [
                    permissionSet.serviceRequestManagement.orderHardware,
                    permissionSet.serviceRequestManagement.viewSuppliesOrder,
                    permissionSet.serviceRequestManagement.viewHardwareOrder,
                    permissionSet.serviceRequestManagement.orderSuppliesAsset,
                    permissionSet.serviceRequestManagement.orderSuppliesCatalog,
                    permissionSet.serviceRequestManagement.createSuppliesReturn,
                    permissionSet.serviceRequestManagement.uploadConsumableOrder,
                    permissionSet.serviceRequestManagement.uploadHardwareOrder
                ]
            },
            {
                name:'serviceRequestAccess',
                permission: [
                     permissionSet.serviceRequestManagement.viewBreakFix,
                     permissionSet.serviceRequestManagement.viewSuppliesOrder,
                     permissionSet.serviceRequestManagement.viewMADC,
                     permissionSet.serviceRequestManagement.viewContactAddress
                ]
            },
            {
                name:'reportAccess',
                permission: [
                     permissionSet.reports.viewRunStandard,
                     permissionSet.reports.viewStrategic
                ]
            },
            {
                name:'viewInvoicesAccess',
                permission: permissionSet.invoices.view
            },
            {
                name: 'userManagementAccess',
                permission:[
                    permissionSet.userManagement.impersonate,
                    permissionSet.userManagement.manageUser,
                    permissionSet.userManagement.createUser,
                    permissionSet.userManagement.profileReport,
                    permissionSet.userManagement.disableUser,
                    permissionSet.userManagement.reactivateUser,
                    permissionSet.userManagement.approvals,
                    permissionSet.userManagement.manageMyProfile,
                    permissionSet.userManagement.inviteUser
                ]
            },
            {
                name: 'serviceRequestBreakFixAccess',
                permission: permissionSet.serviceRequestManagement.viewBreakFix
            },
            {
                name: 'serviceRequestMADCAccess',
                permission: permissionSet.serviceRequestManagement.viewMADC
            },
            {
                name: 'orderSuppliesHardwareAccess',
                permission:[
                    permissionSet.serviceRequestManagement.viewSuppliesOrder,
                    permissionSet.serviceRequestManagement.viewHardwareOrder
                ]
            },
            {
                name: 'cancelServiceRequest',
                permission:[
                    permissionSet.serviceRequestManagement.changeMADC,
                    permissionSet.serviceRequestManagement.moveMADC,
                    permissionSet.serviceRequestManagement.decommissionMADC,
                    permissionSet.serviceRequestManagement.deinstallMADC,
                    permissionSet.serviceRequestManagement.addressMADC,
                    permissionSet.serviceRequestManagement.contactMADC
                ]
            }
        ];
        new SecurityHelper($rootScope).setupPermissionList(configurePermissions);

        $q.all(security.requests).then(function(){
            angular.element(document.getElementsByTagName('body')).attr('style',''); // show the application
        });

        $rootScope.idpUser.$promise.then(function(){
            UserService.getLoggedInUserInfo();
        }, function(reason) {
            NREUM.noticeError('IDP User failed to load for app.js reason: ' + reason);
            $rootScope.currentUser.deferred.reject(reason);
        });

        /*
            1.) put service url into mps factory
            2.) call mps.register services
            3.) load current user info
            4.) load current user's default account information
        */

        $rootScope.showDashboardNotification = true;

        $rootScope.logout = Gatekeeper.logout;
    }])

    .config(['$translateProvider', '$routeProvider', '$locationProvider', '$httpProvider',
        function ($translateProvider, $routeProvider, $locationProvider, $httpProvider) {
            $httpProvider.interceptors.push('errorLogInterceptor');
            $httpProvider.defaults.headers.common = { 'Accept': 'application/json, text/plain, */*'};
            var supportedLanguages = ['en'],
                myLanguage = 'en';

            for (var i in window.browser_languages) {
                var language = window.browser_languages[i];

                if (supportedLanguages.indexOf(language) >= 0) {
                    myLanguage = language;
                    break;
                }
            }

            $translateProvider.useSanitizeValueStrategy(null);

            $translateProvider
                .preferredLanguage(myLanguage)
                .useStaticFilesLoader({
                    prefix: 'etc/resources/i18n/',
                    suffix: '.json'
                })
                .useLocalStorage();

            $routeProvider
            .otherwise({
                templateUrl: '/app/dashboard/templates/home.html',
                controller: 'DashboardController'
            });


            $locationProvider.html5Mode(true);
    }]);
});

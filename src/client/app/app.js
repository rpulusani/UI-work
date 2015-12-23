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
    'serviceRequest.directives',
    'serviceRequest.listController',
    'serviceRequest.serviceRequestController',
    'serviceRequest.controllerHelperService',
    'contact',
    'contact.contactController',
    'contact.contactListController',
    'contact.factory',
    'contact.directives',
    'deviceManagement',
    'deviceManagement.deviceController',
    'deviceManagement.deviceListController',
    'deviceManagement.deviceInformationController',
    'deviceManagement.deviceOrderController',
    'deviceManagement.deviceRequestBreakFixController',
    'deviceManagement.deviceFactory',
    'deviceManagement.productModelFactory',
    'deviceManagement.meterReadFactory',
    'deviceManagement.deviceOrderFactory',
    'deviceManagement.deviceRequestFactory',
    'deviceManagement.directives',
    'deviceServiceRequest',
    'deviceServiceRequest.deviceAddController',
    'deviceServiceRequest.deviceUpdateController',
    'deviceServiceRequest.deviceSearchController',
    'deviceServiceRequest.deviceServiceRequestDeviceController',
    'deviceServiceRequest.deviceDecommissionController',
    'deviceServiceRequest.directives',
    'deviceServiceRequest.deviceSearchFactory',
    'deviceServiceRequest.deviceServiceRequestFactory',
    'hateoasFactory.serviceFactory',
    'utility',
    'utility.historyUtility',
    'utility.blankCheckUtility',
    'utility.directives',
    'utility.controller',
    'utility.contactPickerController',
    'utility.addressPickerController',
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
    'filterSearch',
    'filterSearch.directives',
    'filterSearch.gridFilterController',
    'filterSearch.gridSearchController',
    'filterSearch.chlFilterController',
    'security',
    'security.securityService',
    'security.securityHelper'
], function(angular) {
    'use strict';
    angular.module('mps', [
        'ngRoute',
        'ngResource',
        'ngCookies',
        'ngSanitize',
        'googlechart',
        'pascalprecht.translate',
        'mps.hateoasFactory',
        'mps.dashboard',
        'mps.account',
        'mps.serviceRequests',
        'mps.serviceRequestAddresses',
        'mps.serviceRequestContacts',
        'mps.serviceRequestDevices',
        'mps.user',
        'mps.security',
        'mps.report',
        'mps.invoice',
        'mps.deviceManagement',
        'mps.pageCount',
        'mps.nav',
        'mps.utility',
        'angular-gatekeeper',
        'mps.form',
        'mps.filterSearch',
        'ui.grid',
        'ui.grid.resizeColumns',
        'ui.grid.moveColumns',
        'ui.grid.selection',
        'ui.grid.pagination',
        'ui.grid.exporter',
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
    .constant('permissionSet', {
        dashboard:{
            view: 'VIEW_HOME_PAGE'
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
            viewBreakFix:'VIEW_BREAKFIX_REQUESTS',
            createBreakFix: 'REQUEST_BREAKFIX',
            viewSuppliesOrder: 'VIEW_SUPPLIES_ORDER',
            orderSuppliesCatelog: 'ORDER_SUPPLIES_CATALOG',
            orderSuppliesAsset: 'ORDER_SUPPLIES_ASSET',
            createSuppliesReturn: 'CREATE_SUPPLIES_RETURN_REQUEST',
            orderHardware: 'ORDER_HARDWARE',
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
            delete: 'DELETE_ALL_DOCS',
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

    .run(['Gatekeeper', '$rootScope', '$cookies','$q', 'UserService','SecurityService',
    function(Gatekeeper, $rootScope, $cookies, $q, UserService, SecurityService) {

        Gatekeeper.login({organization_id: '3'});

        $rootScope.idpUser = Gatekeeper.user;
        $rootScope.currentUser = {
            deferred: $q.defer()
        };
        new SecurityService();
        $rootScope.idpUser.$promise.then(function(){
            angular.element(document.getElementsByTagName('body')).attr('style','');
            var promise = UserService.getLoggedInUserInfo($rootScope.idpUser.email);
                promise.then(function(user){
                    angular.extend($rootScope.currentUser, user);
                    $rootScope.currentUser.deferred.resolve($rootScope.currentUser);
                }, function(reason){
                    NREUM.noticeError('API User Information failed to load for app.js reason: ' + reason);
                });
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
       /* $q.when(Gatekeeper.user, function(){
            UserService.get({idpId: Gatekeeper.user.id}, function(user){
                if (user._embedded && user._embedded.users.length > 0) {
                    $rootScope.currentAccount = $rootScope.currentUser._links.accounts[0].href.split('/').pop();
                }
            });
        });*/


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

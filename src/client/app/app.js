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
    'address',
    'address.directives',
    'address.factory',
    'address.addressController',
    'address.addressListController',
    'ui.grid',
    'angular-spring-data-rest',
    'serviceRequest',
    'serviceRequest.factory',
    'serviceRequest.directives',
    'serviceRequest.listController',
    'serviceRequest.serviceRequestController',
    'contact',
    'contact.contactController',
    'contact.contactListController',
    'contact.factory',
    'contact.directives',
    'deviceManagement',
    'deviceManagement.deviceController',
    'deviceManagement.deviceListController',
    'deviceManagement.devicePickerController',
    'deviceManagement.deviceInformationController',
    'deviceManagement.deviceOrderController',
    'deviceManagement.deviceRequestBreakFixController',
    'deviceManagement.deviceFactory',
    'deviceManagement.meterReadFactory',
    'deviceManagement.deviceOrderFactory',
    'deviceManagement.deviceRequestFactory',
    'deviceManagement.devicePickerFactory',
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
    'utility.pageCountSelectController',
    'utility.pageCountSelectService',
    'utility.recursionHelper',
    'utility.personalizationService',
    'utility.formatters',
    'utility.hateaosConfig',
    'utility.hateaosFactory',
    'utility.grid'
], function(angular) {
    'use strict';
    angular.module('mps', [
        'ngRoute',
        'ngResource',
        'ngCookies',
        'ngSanitize',
        'pascalprecht.translate',
        'mps.hateoasFactory',
        'mps.dashboard',
        'mps.account',
        'mps.serviceRequests',
        'mps.serviceRequestAddresses',
        'mps.serviceRequestContacts',
        'mps.serviceRequestDevices',
        'mps.user',
        'mps.report',
        'mps.invoice',
        'mps.deviceManagement',
        'mps.pageCount',
        'mps.nav',
        'mps.utility',
        'mps.chart',
        'angular-gatekeeper',
        'mps.form',
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

    .run(['Gatekeeper', '$rootScope', '$cookies','$q', 'UserService',
    function(Gatekeeper, $rootScope, $cookies, $q, UserService) {

        //TODO: Get appropriate organization
        // Gatekeeper.login({organization: 'lexmark'});
        Gatekeeper.login();

        $rootScope.idpUser = Gatekeeper.user;
        $rootScope.currentUser = {
            deferred: $q.defer()
        };
        $rootScope.idpUser.$promise.then(function(){
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

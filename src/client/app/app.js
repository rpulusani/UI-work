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
    'address',
    'address.controller',
    'address.directives',
    'address.factory',
    'ui.grid',
    'angular-spring-data-rest',
    'serviceRequest',
    'serviceRequest.factory',
    'serviceRequest.directives',
    'contact',
    'contact.contactController',
    'contact.contactListController',
    'contact.factory',
    'contact.directives',
    'utility',
    'utility.historyUtility',
    'utility.blankCheckUtility',
    'utility.directives',
    'utility.controller'
], function(angular) {
    'use strict';
    angular.module('mps', [
        'ngRoute',
        'ngResource',
        'ngCookies',
        'pascalprecht.translate',
        'mps.serviceRequests',
        'mps.serviceRequestAddresses',
        'mps.serviceRequestContacts',
        'mps.user',
        'mps.report',
        'mps.invoice',
        'mps.deviceManagement',
        'mps.pageCount',
        'mps.nav',
        'mps.utility',
        'angular-gatekeeper',
        'mps.form',
        'ui.grid',
        'ui.grid.resizeColumns',
        'ui.grid.moveColumns',
        'ui.grid.selection',
        'ui.grid.pagination',
        'spring-data-rest'
    ])

    .factory('errorLogInterceptor', function() {
        return {
            responseError: function(response) {
                if(console && typeof(console.log) === 'function') {
                    console.log('Error: ' + JSON.stringify(response));
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

    .config(function(GatekeeperProvider, serviceUrl){
        GatekeeperProvider.configure({
            serviceUri: config.idp.serviceUrl,
            clientId: config.idp.clientId
        });
        GatekeeperProvider.protect(serviceUrl);
    })

    .run(['Gatekeeper', 'UserService', '$rootScope', '$cookies',
    function(Gatekeeper, UserService, $rootScope, $cookies) {

        //TODO: Get appropriate organization
        // Gatekeeper.login({organization: 'lexmark'});
        Gatekeeper.login();

        $rootScope.idpUser = Gatekeeper.user;
        $rootScope.currentUser = {};
        UserService.get({idpId: Gatekeeper.user.id}, function(user){
            if (user._embedded && user._embedded.users.length > 0) {
                $rootScope.currentUser = user._embedded.users[0];
                //TODO: Deal with multiple account when definition is ready by stakeholder
                $rootScope.currentAccount = $rootScope.currentUser._links.accounts[0].href.split('/').pop();
            }
        });

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
                templateUrl: '/app/dashboard/templates/home.html'
            });


            $locationProvider.html5Mode(true);
    }]);
});

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
    'gatekeeper',
    'mps.form'
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
    }
})

.constant('mpsApiUri', '')

.constant('serviceUrl', config.portal.serviceUrl)

.config(function(GatekeeperProvider, serviceUrl){
  GatekeeperProvider.configure({
    serviceUri: config.idp.serviceUrl,
    clientId: config.idp.clientId
  });
  GatekeeperProvider.protect(serviceUrl);
})

.run(function(Gatekeeper, $rootScope) {
    $rootScope.user = Gatekeeper.user;
})

.config(['$translateProvider', '$routeProvider', '$locationProvider', '$httpProvider',
    function ($translateProvider, $routeProvider, $locationProvider, $httpProvider) {
        $httpProvider.interceptors.push('errorLogInterceptor');

        var supportedLanguages = ['en'],
            myLanguage = 'en',
            language,
            i;

        for (i in window.browser_languages) {
            language = window.browser_languages[i];

            if (supportedLanguages.indexOf(language) >= 0) {
                myLanguage = language;
                break;
            }
        }

        $translateProvider.useSanitizeValueStrategy(null);

        $translateProvider
            .preferredLanguage(myLanguage)
            .useStaticFilesLoader({
                prefix: '/etc/resources/i18n/',
                suffix: '.json'
            })
            .useLocalStorage();

        $routeProvider
        .otherwise({
            templateUrl: '/app/dashboard/templates/home.html'
        });


        $locationProvider.html5Mode(true);
}]);

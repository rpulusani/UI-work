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
    'mps.common'
])
.config(['$translateProvider', '$routeProvider', '$locationProvider', function ($translateProvider, $routeProvider, $locationProvider) {
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

    $translateProvider.useSanitizeValueStrategy(null)

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

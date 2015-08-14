'use strict';
angular.module('mps', [
    'ngRoute',
    'ngResource',
    'ngCookies',
    'pascalprecht.translate',
    'mps.routes',
    'mps.serviceRequests',
    'mps.serviceRequestAddresses',
    'mps.serviceRequestContacts',
    'mps.user',
    'mps.common'
])

.config(['$translateProvider', function ($translateProvider) {
    var supportedLanguages = ['en'];

    var myLanguage = 'en';
    for(var i in window.browser_languages) {
        var language = window.browser_languages[i];
        if(supportedLanguages.indexOf(language) >= 0) {
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

}]);

define(['angular', 'user', 'hateoasFactory.serviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .factory('AllAccounts', [ 'serviceUrl', 'HATEOASFactory', '$rootScope',
        function(serviceUrl, HATEOASFactory, $rootScope) {
            var AllAccounts = {
                serviceName: 'lexmark-administration/accounts',
                embeddedName: 'accounts',
                url: serviceUrl + 'lexmark-administration/accounts'
            };
            return new HATEOASFactory(AllAccounts);
        }
    ]);
});

define(['angular', 'user', 'hateoasFactory.serviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .factory('UserInfoService', [ 'serviceUrl', 'HATEOASFactory', '$rootScope',
        function(serviceUrl, HATEOASFactory, $rootScope) {
            var UserInfoService = {

                //customize Address
                serviceName: 'user-info',
                embeddedName: 'user-info',
                url: serviceUrl + 'user-info'
            };

            return new HATEOASFactory(UserInfoService);
        }
    ]);
});

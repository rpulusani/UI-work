define(['angular', 'deviceManagement', 'hateoasFactory.serviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .factory('Locations', ['serviceUrl', '$translate', 'HATEOASFactory',
        function(serviceUrl, $translate, HATEOASFactory) {
            var Locations = {
                serviceName: 'locations',
                embeddedName: 'countries',
                url: serviceUrl + '/assets/locations',
                route: ''
            };

        return new HATEOASFactory(Locations);
    }]);
});

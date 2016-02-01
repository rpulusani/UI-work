define(['angular', 'serviceRequest', 'hateoasFactory.serviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequests')
    .factory('ServiceRequestTypes', ['serviceUrl', '$translate', 'HATEOASFactory',
        function(serviceUrl, $translate, HATEOASFactory) {
            var ServiceRequestTypes = {
                serviceName: 'service-requests/types',
                embeddedName: 'requestTypes',
                url: serviceUrl + 'service-requests/types',
                route: ''
            };

        return new HATEOASFactory(ServiceRequestTypes);
    }]);
});

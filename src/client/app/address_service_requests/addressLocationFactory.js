define(['angular', 'address', 'hateoasFactory.serviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .factory('AddressLocations', ['serviceUrl', '$translate', 'HATEOASFactory',
        function(serviceUrl, $translate, HATEOASFactory) {
            var AddressLocations = {
                serviceName: 'addresses/locations',
                embeddedName: 'countries',
                url: serviceUrl + 'addresses/locations',
                route: ''
            };

        return new HATEOASFactory(AddressLocations);
    }]);
});

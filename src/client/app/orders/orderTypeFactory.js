define(['angular', 'order', 'hateoasFactory.serviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.orders')
    .factory('OrderTypes', ['serviceUrl', '$translate', 'HATEOASFactory',
        function(serviceUrl, $translate, HATEOASFactory) {
            var OrderTypes = {
                serviceName: 'orders/types',
                embeddedName: 'requestTypes',
                url: serviceUrl + 'orders/types',
                route: ''
            };

        return new HATEOASFactory(OrderTypes);
    }]);
});

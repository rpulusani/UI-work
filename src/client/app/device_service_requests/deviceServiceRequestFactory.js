define(['angular', 'deviceServiceRequest'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .factory('DeviceServiceRequest', ['serviceUrl', '$translate', 'HATEAOSFactory',
        function(serviceUrl, $translate, HATEAOSFactory) {
            var DeviceServiceRequest = {
                serviceName: 'service-requests',
                route: '/service_requests/devices'
            };

        return new HATEAOSFactory(DeviceServiceRequest);
    }]);
});

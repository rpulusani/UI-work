'use strict';
angular.module('mps.serviceRequestDevices')
.factory('DeviceServiceRequest', ['serviceUrl', '$translate', 'HATEOASFactory',
    function(serviceUrl, $translate, HATEOASFactory) {
        var DeviceServiceRequest = {
            serviceName: 'service-requests',
            route: '/service_requests/devices'
        };

    return new HATEOASFactory(DeviceServiceRequest);
}]);

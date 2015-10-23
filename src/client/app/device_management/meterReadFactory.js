define(['angular', 'deviceManagement'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .factory('MeterReads', ['serviceUrl', '$translate', 'HATEAOSFactory',
        function(serviceUrl, $translate, HATEAOSFactory) {
            var MeterReads = {
                serviceName: 'meter-reads',
                route: '/service_requests/pageCounts'
            };

        return new HATEAOSFactory(MeterReads);
    }]);
});

define(['angular', 'deviceManagement'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .factory('MeterReadService', ['serviceUrl', '$translate', 'HATEAOSFactory',
        function(serviceUrl, $translate, HATEAOSFactory) {
            var MeterReads = {
                serviceName: 'meterReads',
                embeddedName: 'meterReads',
                route: ''
            };

        return new HATEAOSFactory(MeterReads);
    }]);
});

define(['angular', 'deviceManagement', 'angular-translate'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .factory('MeterReadService', ['$translate', 'HATEAOSFactory',
        function($translate, HATEAOSFactory) {
            var MeterReads = {
                serviceName: 'meterReads',
                embeddedName: 'meterReads',
                params: {
                    size: 100
                }
            };

            return new HATEAOSFactory(MeterReads);
        }
    ]);
});

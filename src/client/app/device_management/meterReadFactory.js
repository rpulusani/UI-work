'use strict';
angular.module('mps.deviceManagement')
.factory('MeterReadService', ['serviceUrl', '$translate', 'HATEOASFactory',
    function(serviceUrl, $translate, HATEOASFactory) {
        var MeterReads = {
            serviceName: 'meterReads',
            embeddedName: 'meterReads',
            route: ''
        };

    return new HATEOASFactory(MeterReads);
}]);

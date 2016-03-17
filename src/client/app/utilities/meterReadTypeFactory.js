
angular.module('mps.utility')
.factory('MeterReadTypes', ['$resource', 'serviceUrl', 'HATEOASFactory',
    function($resource, serviceUrl, HATEOASFactory) {
        var MeterReadTypes = {
            serviceName: 'meter-reads/types',
            embeddedName: 'meterReadTypes',
            url: serviceUrl + 'meter-reads/types',
            columns: [],
            route: ''
        };
        return new HATEOASFactory(MeterReadTypes);
   }
]);
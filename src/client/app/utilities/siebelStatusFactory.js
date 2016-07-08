angular.module('mps.utility')
.factory('SiebelStatus', ['serviceUrl', 'HATEOASFactory',
    function(serviceUrl, HATEOASFactory) {
        var SiebelStatus = {
            serviceName: 'utilities/siebelStatus1',
            embeddedName: '',
            url: serviceUrl + 'utilities/siebelStatus',
            columns: [],
            route: ''
        };
        return new HATEOASFactory(SiebelStatus);
   }
]);

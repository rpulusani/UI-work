
'use strict';
angular.module('mps.orders')
.factory('AgreementFactory', [
    'serviceUrl',
    '$translate',
    'HATEOASFactory',
    'FormatterService',
    '$filter',
    '$q',
    function(
        serviceUrl,
        $translate,
        HATEOASFactory,
        formatter,
        $filter,
        $q
        ) {

        var Agreements = {
                serviceName: 'agreements',
                embeddedName: 'agreements', //get away from embedded name and move to a function to convert url name to javascript name
                columns: 'defaultSet',
                columnDefs: {
                    defaultSet: [

                    ]
                },

                functionArray: [

                ],

                route: '/orders',
        };
    return  new HATEOASFactory(Agreements);
}]);


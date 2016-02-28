

angular.module('mps.orders')
.factory('ContractFactory', [
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
                serviceName: 'contracts',
                embeddedName: 'contracts', //get away from embedded name and move to a function to convert url name to javascript name
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


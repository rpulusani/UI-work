

angular.module('mps.library')
.factory('Owners', ['serviceUrl', '$translate', '$rootScope', 'HATEOASFactory',
    function(serviceUrl, $translate, $rootScope, HATEOASFactory) {
        var Owners = {
            serviceName: 'owners',
            embeddedName: 'owners',
            url: serviceUrl + 'documents/owners',
            route: '/library'
        };

        return new HATEOASFactory(Owners);
    }
]);


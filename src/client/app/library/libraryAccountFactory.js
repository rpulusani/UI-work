angular.module('mps.library')
.factory('LibraryAccounts', ['serviceUrl', '$translate', '$rootScope', 'HATEOASFactory',
    function(serviceUrl, $translate, $rootScope, HATEOASFactory) {
        var LibraryAccounts = {
            serviceName: 'accounts',
            embeddedName: 'accounts',
            url: serviceUrl + 'documents/accounts',
            route: '/library'
        };

        return new HATEOASFactory(LibraryAccounts);
    }
]);

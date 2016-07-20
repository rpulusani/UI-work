angular.module('mps.user')
.factory('UserTransactionalAccountsService', [ 'serviceUrl', 'HATEOASFactory', '$rootScope',
    function(serviceUrl, HATEOASFactory, $rootScope) {
        var UserTransactionalAccountsService = {
			serviceName: 'transactionalAccounts',
            embeddedName: 'transactionalAccounts',
            url: serviceUrl + 'users/' + $rootScope.currentUser.email + "/transactional-accounts"
        };

        return new HATEOASFactory(UserTransactionalAccountsService);
    }
]);
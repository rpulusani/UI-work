
angular.module('mps.account')
.factory('AccountService', ['serviceUrl','HATEOASFactory', '$translate',
    function(serviceUrl, HATEOASFactory, $translate) {
        var Account = {
            serviceName: 'accounts',
            embeddedName: 'accounts',
            url: serviceUrl + 'accounts',
            route: '',
            columns: 'defaultSet',
            preventPersonalization: true,
            columnDefs: {
                defaultSet: [{
                    name: $translate.instant('ACCOUNT.ID'),
                    field: 'account.accountId',
                    searchOn: 'accountId'
                }, {
                    name: $translate.instant('ACCOUNT.NAME'),
                    field: 'account.name',
                    searchOn: 'name'
                }]
            }
        };

        return new HATEOASFactory(Account);
   }
]);

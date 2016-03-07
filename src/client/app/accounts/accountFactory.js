'use strict';
angular.module('mps.account')
.factory('AccountService', ['HATEOASFactory', '$translate',
    function(HATEOASFactory, $translate) {
        var Account = {
            serviceName: 'accounts',
            embeddedName: 'accounts',
            route: '',
            columns: 'defaultSet',
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

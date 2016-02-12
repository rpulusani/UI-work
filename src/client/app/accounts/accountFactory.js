define(['angular', 'account'], function(angular) {
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
                        name: 'Account Id',
                        field: 'accountId',
                        searchOn: 'accountId'
                    }, {
                        name: 'Account Name',
                        field: 'name',
                        searchOn: 'name'
                    }]
                }
            };

            return new HATEOASFactory(Account);
       }
    ]);
});

define(['angular', 'account'], function(angular) {
	'use strict';
	angular.module('mps.account')
	.factory('AccountService', ['$resource', 'serviceUrl', 'HATEOASFactory',
        function($resource, serviceUrl, HATEOASFactory) {
            var Account = {
                serviceName: 'accounts',
                embeddedName: 'accounts',
                columns: [],
                route: ''

            };


            return new HATEOASFactory(Account);
       }
    ]);
});

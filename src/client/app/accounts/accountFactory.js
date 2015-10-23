define(['angular', 'account'], function(angular) {
	'use strict';
	angular.module('mps.account')
	.factory('AccountService', ['$resource', 'serviceUrl', 'HATEAOSFactory',
        function($resource, serviceUrl, HATEAOSFactory) {
            var Account = {
                serviceName: 'accounts',
                embeddedName: 'account',
                columns: [],
                route: ''

            };


            return new HATEAOSFactory(Account);
       }
    ]);
});

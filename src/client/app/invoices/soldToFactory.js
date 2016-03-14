define(['angular', 'invoice'], function(angular) {
	'use strict';
	angular.module('mps.invoice')
	.factory('SoldToNumbers', ['$resource', 'serviceUrl', 'HATEOASFactory',
        function($resource, serviceUrl, HATEOASFactory) {
            var SoldToNumbers = {
                serviceName: 'soldToNumbers',
                embeddedName: 'strings',
                url: serviceUrl + 'invoices/sold-to-numbers',
                columns: [],
                route: ''
            };
            return new HATEOASFactory(SoldToNumbers);
       }
    ]);
});

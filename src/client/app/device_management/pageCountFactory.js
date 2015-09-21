define(['angular', 'deviceManagement'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .factory('PageCount', ['$resource',
        function($resource) {
        	return {
		      pageCountTypes: $resource('app/device_management/data/meter-read-types.json',{

		      }),
		      pageCounts: $resource('/accounts/:accountId/pageCounts/:id', {accountId: '@accountId', id: '@id'}, {

		      })
		    };
        }
    ]);
});

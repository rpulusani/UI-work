define(['angular', 'deviceManagement'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .factory('Device', ['$resource',
        function($resource) {
            var url = '/accounts/:accountId/devices/:id';
            return $resource(url, {accountId: '@accountId', id: '@id'}, {

            });
        }
    ])
    // .factory('PageCount', ['$resource',
    //     function($resource) {
    //         var url = 'app/device_management/data/meter-read-types.json';
    //         return $resource(url, {

    //         });
    //     }
    // ]);
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

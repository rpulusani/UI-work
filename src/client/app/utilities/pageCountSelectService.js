define(['angular', 'utility'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .factory('PageCountSelect', ['$resource',
        function($resource) {
            return {
                  pageCountTypes: $resource('app/device_management/data/meter-read-types.json',{}),
            };
        }
    ]);
});

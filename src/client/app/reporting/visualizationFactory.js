define(['angular', 'report'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .factory('Visualizations', ['$translate', 'HATEOASFactory',
        function($translate, HATEOASFactory) {
            var Visualization = {
                serviceName: 'visualizations',
                route: '/visualizations'
            };

            return new HATEOASFactory(Visualization);
        }
    ]);
});

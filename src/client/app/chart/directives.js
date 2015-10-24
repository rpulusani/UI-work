define(['angular', 'chart'], function(angular) {
    'use strict';
    angular.module('mps.chart')
    .directive('draw', function() {
        return {
            restrict: 'A',
            scope: {
                options: '=',
                data: '='
            },
            controller: 'ChartController'
        };
    });
});

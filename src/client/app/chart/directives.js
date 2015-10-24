define(['angular', 'chart'], function(angular) {
    'use strict';
    angular.module('mps.chart')
    .directive('draw', function() {
        return {
            restrict: 'A',
            template: '<canvas></canvas>',
            scope: {
                radius: '=',
                xpos: '=',
                ypos: '='
            },
            controller: 'ChartController'
        };
    });
});

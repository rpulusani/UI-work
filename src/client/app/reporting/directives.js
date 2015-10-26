define(['angular', 'report'], function(angular) {
    'use strict';
     angular.module('mps.report')
    .directive('reportFinder', function() {
        return {
            restrict: 'A',
            templateUrl: '/app/reporting/templates/finder.html'
        };
    });
});

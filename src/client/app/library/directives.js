define(['angular', 'library'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .directive('docItem', function() {
        return {
            restrict: 'A'
        };
    });
});

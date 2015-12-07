define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .directive('gridFilter', function() {
        return {
            restrict: 'A',
            scope:{
                options: '='
            },
            templateUrl: '/app/filter_search/templates/filter.html',
            controller: 'GridFilterController'
        };
    })
    .directive('locationFilter', function() {
        return {
            restrict: 'A',
            scope:{
                options: '=',
                title: '@'
            },
            templateUrl: '/app/filter_search/templates/locationFilter.html',
        };
    })
    .directive('chlFilter', function() {
        return {
            restrict: 'A',
            scope:{
                options: '=',
                title: '@'
            },
            templateUrl: '/app/filter_search/templates/CHLFilter.html',
        };
    })
    .directive('gridSearch', function() {
        return {
            restrict: 'A',
            scope: {
                columns: '='
            },
            templateUrl: '/app/filter_search/templates/search.html',
            controller: 'GridSearchController'
        };
    });
});

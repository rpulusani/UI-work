define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .directive('gridFilter', function() {
        return {
            restrict: 'A',
            scope:{
                options: '=',
                params: '='
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
                title: '@',
                params: '=',
                filterDef: '='
            },
            templateUrl: '/app/filter_search/templates/locationFilter.html',
        };
    })
    .directive('chlFilter', function() {
        return {
            restrict: 'A',
            scope:{
                title: '@',
                params:'=',
                filterDef: '=',
                action: '@'
            },
            templateUrl: '/app/filter_search/templates/CHLFilter.html',
            controller: 'CHLFilterController'
        };
    })
    .directive('gridSearch', function() {
        return {
            restrict: 'A',
            scope: {
                columns: '=',
                params: '=',
                search: '='
            },
            templateUrl: '/app/filter_search/templates/search.html',
            controller: 'GridSearchController'
        };
    });
});

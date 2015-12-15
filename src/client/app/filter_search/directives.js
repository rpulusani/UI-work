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
            controller: 'GridSearchController',
            link: function(scope, el, attr){
                require(['lxk.fef'], function() {
                    var $ = require('jquery'),
                    filterDiv = $(el).find(".filter--search");
                    $(filterDiv).hover(function(){
                        $(this).toggleClass("hover");
                        $(".search-box").toggleClass("hover");
                        $(".btn-search").toggleClass("hover");
                        $(".selectric").toggleClass("hover");
                    });
                    $(filterDiv).find(".search-box").focus(function(){
                        $(filterDiv).addClass("focus");
                        $(".search-box").addClass("focus");
                        $(".btn-search").addClass("focus");
                        $(".selectric").addClass("focus");
                    });
                    $(filterDiv).find(".search-box").blur(function(){
                        $(filterDiv).removeClass("focus");
                        $(".search-box").removeClass("focus");
                        $(".btn-search").removeClass("focus");
                        $(".selectric").removeClass("focus");
                    });
                    $(filterDiv).find(".selectric").click(function(){
                        $(".selectricItems").width(filterDiv.width()-1);
                    });
                });
            }
        };
    });
});

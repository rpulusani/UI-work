define([
    'angular'
], function(angular){
    'use strict';

    var tree = angular.module('tree', []);

    tree.config(['$routeProvider',
        function ($routeProvider){
            $routeProvider
            .when('/tree-example', {
                templateUrl: '/app/tree/view/tree-example.html'
            });
        }
    ]);

    return tree;
});

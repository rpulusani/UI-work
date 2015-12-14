define([
    'tree',
    'utility',
    'utility.recursionHelper',
    'tree.treeController',
    'tree.treeItemController'
], function(tree, utility){
    'use strict';

    tree.directive('tree', ['RecursionHelper', function(RecursionHelper){
        return {
            restrict: 'AE',
            templateUrl: '/app/tree/templates/tree.html',
            scope: {
                treeType: '@'
            },
            controller: 'TreeController'
        };
    }])
    .directive('treeItem', ['RecursionHelper', function(RecursionHelper){
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: '/app/tree/templates/tree-item.html',
            scope: {
                item: '=',
                treeType: '@'
            },
            controller: 'TreeItemController',
            compile: function(element){
                return RecursionHelper.compile(element);
            }
        };
    }]);
});

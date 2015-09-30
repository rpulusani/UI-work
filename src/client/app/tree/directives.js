define([
    'tree',
    'nav',
    'nav.services',
    'tree.controllers'
], function(tree, nav){
    'use strict';

    tree.directive('tree', ['RecursionHelper', function(RecursionHelper){
        return {
            restrict: 'AE',
            templateUrl: '/app/tree/templates/tree.html',
            controller: 'TreeController'
        };
    }])
    .directive('treeItem', ['RecursionHelper', function(RecursionHelper){
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: '/app/tree/templates/tree-item.html',
            scope: {
                item: '='
            },
            controller: 'TreeItemController',
            compile: function(element){
                return RecursionHelper.compile(element);
            }
        };
    }]);
});

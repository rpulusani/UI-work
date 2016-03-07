
'use strict';

tree.directive('tree', ['RecursionHelper', function(RecursionHelper){
    return {
        restrict: 'AE',
        templateUrl: '/app/tree/templates/tree.html',
        scope: {
            treeType: '@',
            filterChl: '=',
            action: '@',
            value: '=',
            initialItem: '=',
            previousItems: '='
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
            selectedItems: '=',
            item: '=',
            treeType: '@',
            filterChl: '=',
            value: '=',
            action: '@',
            treeNodes: '=',
            previousItems: '='
        },
        controller: 'TreeItemController',
        compile: function(element){
            return RecursionHelper.compile(element);
        }
    };
}]);


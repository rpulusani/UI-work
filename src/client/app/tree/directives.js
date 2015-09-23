define([
    'tree',
    'nav',
    'nav.services'
], function(tree){
    'use strict';

    tree.directive('tree', ['RecursionHelper', function(RecursionHelper){
        return {
            restrict: 'AE',
            templateUrl: '/app/tree/templates/tree.html',
            scope: {
                /*
                items: '='
                */
            },
            controller: function($scope){
                var mockItems = [
                    {
                        id: 'item1',
                        title: 'Item 1',
                        children: [
                            {
                                id: 'item11',
                                title: 'Item 1.1',
                                children: [
                                    {
                                        id: 'item111',
                                        title: 'Item 1.1.1',
                                        children: []
                                    },
                                    {
                                        id: 'item112',
                                        title: 'Item 1.1.2',
                                        children: []
                                    }
                                ]
                            },
                            {
                                id: 'item12',
                                title: 'Item 1.2',
                                children: []
                            }
                        ]
                    },
                    {
                        id: 'item2',
                        title: 'Item 2',
                        children: []
                    }
                ];

                $scope.items = mockItems;

                $scope.toggleItems = function(items){
                    console.log(items);
                    /*
                    var limit = items.length,
                        i = 0;

                    for(i;i<limit;i++){
                        items[i].expanded = !items[i].expanded;

                        if(items[i].children){
                            toggleItems(items[i].children);
                        }
                    }
                    */
                };
            }
        };
    }])
    .directive('treeItem', ['RecursionHelper', function(RecursionHelper){
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: '/app/tree/templates/tree-item.html',
            scope: {
                item: '=',
                expanded: '@'
            },
            controller: function($scope){
                console.log($scope.item);
                console.log($scope.expanded);
            },
            compile: function(element){
                return RecursionHelper.compile(element);
            }
        };
    }]);
});

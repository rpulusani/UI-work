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
                        items: [
                            {
                                id: 'item1.1',
                                title: 'Item 1.1',
                                items: [
                                    {
                                        id: 'item1.1.1',
                                        title: 'Item 1.1.1',
                                        items: [
                                            {
                                                id: 'item1.1.1.1',
                                                title: 'Item 1.1.1.1',
                                                items: [
                                                    {
                                                        id: 'item1.1.1.1.1',
                                                        title: 'Item 1.1.1.1.1'
                                                    },
                                                    {
                                                        id: 'item1.1.1.1.2',
                                                        title: 'Item 1.1.1.1.2'
                                                    }
                                                ]
                                            },
                                            {
                                                id: 'item1.1.1.2',
                                                title: 'Item 1.1.1.2'
                                            }
                                        ]
                                    },
                                    {
                                        id: 'item1.1.2',
                                        title: 'Item 1.1.2'
                                    }
                                ]
                            },
                            {
                                id: 'item1.2',
                                title: 'Item 1.2'
                            }
                        ]
                    },
                    {
                        id: 'item2',
                        title: 'Item 2'
                    }
                ];

                $scope.items = mockItems;

                $scope.expandAll = function(items){
                    var limit = items.length,
                        i = 0;

                    for(i;i<limit;i++){
                        items[i].expanded = true;

                        if(items[i].items){
                            $scope.expandAll(items[i].items);
                        }
                    }
                };

                $scope.collapseAll = function(items){
                    var limit = items.length,
                        i = 0;

                    for(i;i<limit;i++){
                        items[i].expanded = false;

                        if(items[i].items){
                            $scope.collapseAll(items[i].items);
                        }
                    }
                };

                $scope.selectAll = function(items){
                    var limit = items.length,
                        i = 0;

                    for(i;i<limit;i++){
                        items[i].selected = true;

                        if(items[i].items){
                            $scope.selectAll(items[i].items);
                        }
                    }
                };

                $scope.deselectAll = function(items){
                    var limit = items.length,
                        i = 0;

                    for(i;i<limit;i++){
                        items[i].selected = false;

                        if(items[i].items){
                            $scope.deselectAll(items[i].items);
                        }
                    }
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
                item: '='
            },
            controller: function($scope){
                if($scope.item && $scope.item.items && $scope.item.items.length > 0){
                    var limit = $scope.item.items.length,
                        i = 0;

                    $scope.item.expanded = true;
                    $scope.item.disabled = false;

                    $scope.$watch("item.selected", function(newVal, oldVal){
                        if(newVal){
                            for(i=0;i<limit;i++){
                                $scope.item.items[i].selected = true;
                                $scope.item.items[i].disabled = true;
                            }
                        }else{
                            for(i=0;i<limit;i++){
                                //$scope.item.items[i].selected = true;
                                $scope.item.items[i].disabled = false;
                            }
                        }
                    });
                }
            },
            compile: function(element){
                return RecursionHelper.compile(element);
            }
        };
    }]);
});

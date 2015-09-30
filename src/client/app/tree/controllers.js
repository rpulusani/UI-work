define([
    'tree',
    'tree.services'
], function(tree){
    tree
    .controller('TreeController', ['$scope', 'TreeItems',
        function($scope, TreeItems){
            $scope.items = TreeItems.data || [];

            $scope.bulkAction = function(evt){
                $scope.$broadcast(evt);
            };

            if($scope.items.length === 0){
                TreeItems.query(function(){
                    $scope.items = TreeItems.data;
                });
            }
        }
    ])
    .controller('TreeItemController', ['$scope',
        function($scope){
            if($scope.item){
                $scope.item.disabled = false;
                $scope.item.selected = false;
                $scope.item.expanded = true;
            }

            $scope.toggleChildren = function(item){
                var children = item.items || [],
                    limit = children.length,
                    i = 0;

                for(i=0;i<limit;i++){
                    if(item.selected){
                        children[i].selected = true;
                        children[i].disabled = true;
                    }else{
                        children[i].disabled = false;
                    }

                    if(children[i].items && children[i].items.length > 0){
                        $scope.toggleChildren(children[i]);
                    }
                }
            };

            $scope.$on('expandAll', function(evt){
                $scope.item.expanded = true;
            });
            $scope.$on('collapseAll', function(evt){
                $scope.item.expanded = false;
            });
            $scope.$on('selectAll', function(evt, elem){
                $scope.item.selected = true;
                $scope.toggleChildren($scope.item);
            });
            $scope.$on('deselectAll', function(evt){
                $scope.item.selected = false;
                $scope.toggleChildren($scope.item);
            });
        }
    ]);
});

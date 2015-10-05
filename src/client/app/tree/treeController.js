define([
    'tree',
    'tree.treeItemsService'
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
    ]);
});

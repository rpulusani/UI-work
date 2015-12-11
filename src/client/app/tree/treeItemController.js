define([
    'tree'
], function(tree){
    tree
    .controller('TreeItemController', ['$scope', 'AccountService',
        function($scope, Account){
            if($scope.item){
                $scope.item.disabled = false;
                $scope.item.selected = false;
                $scope.item.expanded = false;
            }

            $scope.expandCall = function(){
                $scope.item.expanded = !$scope.item.expanded;
                $scope.$broadcast('expanded');
            };

            $scope.$on('expanded', function(evt){
                if ($scope.item.expanded === true) {
                    $scope.item.items = [];
                    if ($scope.treeType && $scope.treeType === 'chl') {
                        Account.setItem($scope.item);
                        var options = {
                            updateParams: false,
                            params:{
                                accountId: Account.item.accountId,
                                accountLevel: Account.item.level,
                                embed:'childAccounts'
                            }
                        };
                        Account.item.get(options).then(function(){
                            if (Account.item && Account.item.item) {
                                Account.item = Account.item.item;
                            }

                            if (Account.item 
                                && Account.item._embedded 
                                && Account.item._embedded.childAccounts 
                                && Account.item._embedded.childAccounts.length > 0) {
                                var childAccounts = Account.item._embedded.childAccounts;
                                for (var i=0; i<childAccounts.length; i++) {
                                    var childItem = {};
                                    childItem = childAccounts[i];
                                    childItem._links = {
                                        self: {}
                                    };
                                    if (Account.item._links.childAccounts) {
                                        if (Account.item._links.childAccounts.length) {
                                            childItem._links.self.href = Account.item._links.childAccounts[i].href;
                                        } else {
                                            childItem._links.self.href = Account.item._links.childAccounts.href;
                                        }
                                    }
                                    childItem.expanded = true;
                                    $scope.item.items.push(childItem);
                                }
                            }
                        }); 
                    }
                    
                }
            });

            $scope.toggleChildren = function() {

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

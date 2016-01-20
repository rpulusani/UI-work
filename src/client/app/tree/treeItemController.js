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
                $scope.item.showExpandIcon = true;
                if ($scope.item.numberOfChildren && parseInt($scope.item.numberOfChildren) === 0) {
                    $scope.item.showExpandIcon = false;
                }
            }

            $scope.expandCall = function(){
                $scope.item.expanded = !$scope.item.expanded;
                $scope.$broadcast('expanded');
            };

            $scope.$on('expanded', function(evt){
                if ($scope.item.expanded === true) {
                    $scope.item.items = [];
                    if ($scope.treeType && ($scope.treeType === 'chl' || $scope.treeType === 'daAccounts')) {
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

            var deselectOthers = function(item, itemList) {
                if (itemList && itemList.length > 0) {
                    for(var i=0;i<itemList.length;i++) {
                        if(itemList[i].accountId !== item.accountId) {
                            itemList[i].selected = false;
                        }
                        if(itemList[i].items && itemList[i].items.length > 0) {
                            deselectChildren(itemList[i].items, item);
                        }
                        
                    }
                }
            };

            var deselectChildren = function(children, item) {
                for(var j=0;j<children.length;j++) {
                    if(children[j].accountId !== item.accountId) {
                        children[j].selected = false;
                    }
                    if(children[j].items && children[j].items.length > 0){
                        deselectChildren(children[j].items, item);
                    }
                }
            }

            $scope.toggleChildren = function(item){
                var children = item.items || [],
                    i = 0,
                    options = {};

                if ($scope.action && $scope.action === 'selectLevel') {
                    if (item.selected) {
                        $scope.value.id = item.accountId;
                        $scope.value.name = item.name;
                        deselectOthers(item, $scope.treeNodes);
                    }
                } else {
                    if (item.selected) {
                        $scope.selectedItems.push(item.accountId);
                        if ($scope.treeType && $scope.treeType === 'chl' && $scope.filterChl && typeof $scope.filterChl === 'function') {
                            $scope.filterChl($scope.selectedItems);
                        }
                        
                    } else {
                        if($scope.selectedItems.indexOf(item.accountId) !== -1) {
                            $scope.selectedItems.splice($scope.selectedItems.indexOf(item.accountId), 1);
                            if ($scope.treeType && $scope.treeType === 'chl' && $scope.filterChl && typeof $scope.filterChl === 'function') {
                                $scope.filterChl($scope.selectedItems);
                            }
                        }
                    }
                }

                /*commenting until getting other direction from UX team*/
                /*for(i=0;i<limit;i++){
                    if(item.selected){
                        //children[i].selected = true;
                        //children[i].disabled = true;
                    }else{
                        children[i].disabled = false;
                    }

                    if(children[i].items && children[i].items.length > 0){
                        $scope.toggleChildren(children[i]);
                    }
                }*/
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

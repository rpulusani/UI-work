define([
    'tree'
], function(tree){
    tree
    .controller('TreeItemController', ['$scope', 'AccountService',
        function($scope, Account){
            if($scope.item){
                console.log('$scope.item',$scope.item);
                $scope.item.items = [];
                Account.setItem($scope.item);
                // Account.item.params = Account.setupParams(
                //                                 {url: Account.item._links.self.href},
                //                                 {params:{
                //                                     accountId: Account.item.accountId,
                //                                     accountLevel: Account.item.level
                //                                 }});
                //$scope.tempItem.items = [];
                var options = {
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
                    
                    console.log('Account.item',Account.item);
                    if (Account.item 
                        && Account.item._embedded 
                        && Account.item._embedded.childAccounts 
                        && Account.item._embedded.childAccounts.length > 0) {
                        var childAccounts = Account.item._embedded.childAccounts;
                        for (var i=0; i<childAccounts.length; i++) {
                            var childItem = {};
                            childItem = childAccounts[i];
                            // childItem.name = childAccounts[i].name;
                            // childItem.level = childAccounts[i].level;
                            childItem._links = {
                                self: {}
                            };
                            if (Account.item._links.childAccounts) {
                                console.log('Account.item._links.childAccounts', Account.item._links.childAccounts);
                                console.log('Account.item._links.childAccounts.length', Account.item._links.childAccounts.length);
                                if (Account.item._links.childAccounts.length) {
                                    childItem._links.self.href = Account.item._links.childAccounts[i].href;
                                } else {
                                    childItem._links.self.href = Account.item._links.childAccounts.href;
                                }
                            }
                            
                            $scope.item.items.push(childItem);
                        }
                    }
                    console.log($scope.item);
                });



                $scope.item.disabled = false;
                $scope.item.selected = false;
                $scope.item.expanded = true;
            }

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

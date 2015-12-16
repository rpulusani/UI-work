define([
    'tree',
    'tree.treeItemsService'
], function(tree){
    tree
    .controller('TreeController', ['$scope', 'TreeItems', 'AccountService', 'UserService',
        function($scope, TreeItems, Account, User){
            $scope.items = [];
            $scope.selectedItems = [];
            var tempItem = {};
            $scope.bulkAction = function(evt){
                $scope.$broadcast(evt);
            };

            function setChlChildren(tempItem) {
                Account.setItem(tempItem);
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
                            if (childItem.level === 'global' 
                                || childItem.level === 'legal' 
                                || childItem.level === 'account' 
                                || childItem.level === 'domestic') {
                                setChlChildren(childItem);
                            } else {
                                $scope.items.push(childItem);
                            }
                        }
                    }
                });
            }

            if ($scope.treeType && $scope.treeType === 'chl') {
                User.getLoggedInUserInfo().then(function(user) {
                User.item._links.accounts = User.item._links.accounts[0];
                    User.getAdditional(User.item, Account).then(function() {
                        tempItem.accountId = Account.item.accountId;
                        tempItem.name = Account.item.name;
                        tempItem.level = Account.item.level;
                        tempItem._links = {
                            self: {}
                        };
                        tempItem._links.self.href = Account.item._links.self.href;
                        if (tempItem.level === 'global' 
                            || tempItem.level === 'legal' 
                            || tempItem.level === 'account'
                            || childItem.level === 'domestic') {
                            setChlChildren(tempItem);
                        } else {
                            $scope.items.push($scope.tempItem);
                        }
                    });
                });
            }
        }
    ]);
});

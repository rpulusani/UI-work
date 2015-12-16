define([
    'tree',
    'tree.treeItemsService'
], function(tree){
    tree
    .controller('TreeController', ['$scope', 'TreeItems', 'AccountService', 'UserService', '$q',
        function($scope, TreeItems, Account, User, $q){
            $scope.items = [];
            $scope.selectedItems = [];
            var tempItem = {};
            $scope.bulkAction = function(evt){
                $scope.$broadcast(evt);
            };

            function setChlChildren(tempItem, depth) {
                Account.setItem(tempItem);
                //console.log('tempItem',tempItem);
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
                        var current, last, childAccounts, childItem;
                        //current = Account.item;
                        //last = current;
                        //while(current) {
                            //console.log('Account.item.accountId', Account.item.accountId);
                            childAccounts = Account.item._embedded.childAccounts;
                            var promises = [];
                            for (var i=0; i<childAccounts.length; i++) {
                                console.log('childAccounts[i].accountId', childAccounts[i].accountId);
                                childItem = childAccounts[i];
                                childItem._links = {
                                    self: {}
                                };
                                childItem._links.self.href = 'https://api.venus-dev.lexmark.com/mps/accounts/'+childItem.accountId+'?accountLevel='+childItem.level;
                                //console.log(childItem._links.self.href);
                                //childItem.next = null;
                                //last.next = childItem;
                                //last = childItem;
                                // if (Account.item._links.childAccounts) {
                                //     if (Account.item._links.childAccounts.length) {
                                //         console.log('in if');
                                //         console.log(childAccounts[i].accountId);
                                //         console.log(Account.item._links.childAccounts[i].href);
                                //         childItem._links.self.href = Account.item._links.childAccounts[i].href;
                                //     } else {
                                //         console.log('in else');
                                //         childItem._links.self.href = Account.item._links.childAccounts.href;
                                //     }
                                // }
                                /*if (childItem.level !== 'global' && childItem.level !== 'legal' 
                                    && childItem.level !== 'account' && childItem.level !== 'domestic'
                                    && childItem.level !== 'siebel') {
                                    
                                }*/
                                Account.setItem(childItem);
                                //console.log('tempItem',tempItem);
                                var options = {
                                    updateParams: false,
                                    params:{
                                        accountId: Account.item.accountId,
                                        accountLevel: Account.item.level,
                                        embed:'childAccounts'
                                    }
                                };
                                var promise = Account.item.get(options);
                                promise.then(function() {
                                    console.log('Account.item', Account.item);
                                });

                                promises.push(promise);
                                //$scope.items.push(childItem);   
                                //setChlChildren(childItem, depth + 1);
                            }
                            $q.all(promises);
                        //}
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
                        if (tempItem.level === 'global' || tempItem.level === 'legal' 
                            || tempItem.level === 'account' || tempItem.level === 'domestic'
                            || tempItem.level === 'siebel') {
                            setChlChildren(tempItem,0);
                        } else {
                            $scope.items.push($scope.tempItem);
                        }
                    });
                });
            }
        }
    ]);
});

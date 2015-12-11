define([
    'tree',
    'tree.treeItemsService'
], function(tree){
    tree
    .controller('TreeController', ['$scope', 'TreeItems', 'AccountService', 'UserService',
        function($scope, TreeItems, Account, User){
            $scope.items = [];
            $scope.tempItem = {};
            $scope.bulkAction = function(evt){
                $scope.$broadcast(evt);
            };
            if ($scope.treeType && $scope.treeType === 'chl') {
                User.getLoggedInUserInfo().then(function(user) {
                User.item._links.accounts = User.item._links.accounts[0];
                    User.getAdditional(User.item, Account).then(function() {
                        $scope.tempItem.accountId = Account.item.accountId;
                        $scope.tempItem.name = Account.item.name;
                        $scope.tempItem.level = Account.item.level;
                        $scope.tempItem._links = {
                            self: {}
                        };
                        $scope.tempItem._links.self.href = Account.item._links.self.href;
                        $scope.tempItem.items = [];
                        var options = {
                            params:{
                                embed:'childAccounts'
                            }
                        };
                        Account.item.get(options).then(function(){
                            Account.item = Account.item.item;
                            if (Account.item._embedded.childAccounts && Account.item._embedded.childAccounts.length > 0) {
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
                                    $scope.tempItem.items.push(childItem);
                                }
                            }
                            $scope.items.push($scope.tempItem);
                        });
                    });
                });
            }
        }
    ]);
});

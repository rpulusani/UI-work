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
                        $scope.items.push($scope.tempItem);
                    });
                });
            }
        }
    ]);
});

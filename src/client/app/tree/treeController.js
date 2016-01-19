define([
    'tree',
    'tree.treeItemsService'
], function(tree){
    tree
    .controller('TreeController', ['$scope', '$rootScope', 'TreeItems', 'AccountService', 'UserInfoService', 'UserService', '$q',
        function($scope, $rootScope, TreeItems, Account, UserInfo, Users, $q){
            $scope.items = [];
            $scope.tempItems = [];
            $scope.selectedItems = [];
            var tempItem = {};
            $scope.bulkAction = function(evt){
                $scope.$broadcast(evt);
            };

            function setChlChildren(tempItem, deferred) {
                Account.setItem(tempItem);
                var promise,
                options = {
                    updateParams: false,
                    params:{
                        accountId: Account.item.accountId,
                        accountLevel: Account.item.level,
                        embed:'childAccounts'
                    }
                };
                promise = Account.item.get(options);
                promise.then(function(processedResponse){
                    deferred.resolve(processedResponse);
                });
                return promise;
            }

            if ($scope.treeType && $scope.treeType === 'chl') {
                UserInfo.getTransactionalAccounts().then(function(accounts) {
                    if(accounts._embedded && accounts._embedded.transactionalAccounts 
                        && accounts._embedded.transactionalAccounts.length > 0) {
                        var promises = [];
                        for (i=0; i<accounts._embedded.transactionalAccounts.length; i++) {
                            var item = accounts._embedded.transactionalAccounts[i].account;
                            item._links = {
                                self: {}
                            };
                            item._links.self = accounts._embedded.transactionalAccounts[i]._links.account;
                            deferred = $q.defer();
                            var promise = setChlChildren(item, deferred);
                            promises.push(promise);
                        }
                        $q.all(promises).then(function(response) {
                            for (i=0; i<response.length; i++) {
                                if(response[i]
                                && response[i].data 
                                && response[i].data._embedded 
                                && response[i].data._embedded.childAccounts 
                                && response[i].data._embedded.childAccounts.length > 0) {
                                    var childAccounts = response[i].data._embedded.childAccounts;
                                    for (var j=0; j<childAccounts.length; j++) {
                                        var childItem = childAccounts[j];
                                        $scope.items.push(childItem);  
                                    }
                                }
                            }
                        });
                    }
                });
            } else if ($scope.treeType && $scope.treeType === 'daAccounts') {
                console.log('in right place');
                console.log('$rootScope.currentUser', $rootScope.currentUser);
                Users.getLoggedInUserInfo().then(function() {
                    Users.item.links.accounts().then(function() {
                        console.log('Users.item.accounts', Users.item.accounts);
                    });
                });
            }
        }
    ]);
});

define([
    'tree',
    'tree.treeItemsService'
], function(tree){
    tree
    .controller('TreeController', ['$scope', 'TreeItems', 'AccountService', 'UserService',
        function($scope, TreeItems, Account, User){
            //$scope.items = TreeItems.data || [];
            $scope.items = [];
            $scope.tempItem = {};
            $scope.bulkAction = function(evt){
                $scope.$broadcast(evt);
            };

            User.getLoggedInUserInfo().then(function(user) {
                User.item._links.accounts = User.item._links.accounts[0];

                // Devices.setItem(device);
                // var options = {
                //     params:{
                //         embed:'contact,address'
                //     }
                // };
                // Devices.item.links.self(options).then(function(){
                //     Devices.item = Devices.item.self.item;
                //     $location.path(Devices.route + '/' + device.id + '/review');

                // });

                User.getAdditional(User.item, Account).then(function() {
                    console.log('Account', Account);

                    //Account.setItem(Account.item);
                    $scope.tempItem.id = Account.item.accountId;
                    $scope.tempItem.title = Account.item.name;
                    $scope.tempItem.items = [];
                    var options = {
                        params:{
                            embed:'childAccounts'
                        }
                    };
                    Account.item.links.self(options).then(function(){
                        Account.item =  Account.item.self.item;
                        if (Account.item._embedded.childAccounts && Account.item._embedded.childAccounts.length > 0) {
                            var childAccounts = Account.item._embedded.childAccounts;
                            for (var i=0; i<childAccounts.length; i++) {
                                var childItem = {};
                                childItem.id = childAccounts[i].accountId;
                                childItem.title = childAccounts[i].name;
                                childItem._links = {
                                    self: {}
                                };
                                if (Account.item._links.childAccounts) {
                                    if (Account.item._links.childAccounts.length === 1) {
                                        childItem._links.self.href = Account.item._links.childAccounts[i].href;
                                    } else {

                                    }
                                }
                                
                                $scope.tempItem.items.push(childItem);
                            }
                        }
                        $scope.items.push($scope.tempItem);
                        console.log($scope.items);
                    });

                    /*$scope.tempItem.id = Account.item.accountId;
                    $scope.tempItem.title = Account.item.name;
                    if (Account.item._links.childAccounts && Account.item._links.childAccounts.length > 0) {
                        for (var i=0; i<Account.item._links.childAccounts.length; i++) {
                            Account.getAdditional(Account.item, Addresses).then(function() {
                                Addresses.getPage().then(function() {
                                    Grid.display(Addresses, $scope, personal);
                                }, function(reason) {
                                    NREUM.noticeError('Grid Load Failed for ' + Addresses.serviceName +  ' reason: ' + reason);
                                });
                            });
                        }
                    }*/
                    
                    // Account.getAdditional(Account.item, Addresses).then(function() {
                    //     Addresses.getPage().then(function() {
                    //         Grid.display(Addresses, $scope, personal);
                    //     }, function(reason) {
                    //         NREUM.noticeError('Grid Load Failed for ' + Addresses.serviceName +  ' reason: ' + reason);
                    //     });
                    // });
                });
            });

            // if($scope.items.length === 0){
            //     TreeItems.query(function(){
            //         $scope.items = TreeItems.data;
            //     });
            // }
        }
    ]);
});

angular.module('mps.filterSearch')
.controller('AccountAllFilterController', ['$scope', '$translate', 'AccountService', 'AllAccounts', 'UserService',
    function($scope, $translate, Accounts, AllAccounts, Users) {
        $scope.showClearMessage = false;
        $scope.selectedAccountsList = [];
        $scope.accounts = [];

        AllAccounts.get().then(function() {
            if (AllAccounts.item._embedded && AllAccounts.item._embedded.accounts) {
                var accountsList = AllAccounts.item._embedded.accounts;

                for (var i = 0; i < accountsList.length; i++) {
                    var account = {};
                    account.name = accountsList[i].name;
                    account.accountId = accountsList[i].accountId;
                    account.selected = false;
                    $scope.accounts.push(account);
                }
            }
        });

        $scope.accountsFilter = function(account) {
            if (account.selected) {
                $scope.selectedAccountsList.push(account.accountId);
            } else {
                if ($scope.selectedAccountsList.indexOf(account.accountId) !== -1) {
                    $scope.selectedAccountsList.splice($scope.selectedAccountsList.indexOf(account.accountId), 1);
                }
            }

            if ($scope.selectedAccountsList && $scope.filterDef && typeof $scope.filterDef === 'function'){
                if ($scope.selectedAccountsList.length > 0) {
                    $scope.showClearMessage = true;
                    $scope.noOfAccountsSelected = $scope.selectedAccountsList.length;
                } else {
                    $scope.showClearMessage = false;
                }

                var accountList = $scope.selectedAccountsList.join();
                if ($scope.selectedAccountsList.length > 0) {
                    $scope.params['accountIds'] = accountList;
                    $scope.filterDef($scope.params);
                } else {
                    $scope.params = {};
                    $scope.filterDef($scope.params, ['accountIds']);
                }
            }
        };

        $scope.clearAccountsFilter = function() {
            if($scope.filterDef && typeof $scope.filterDef === 'function') {
                $scope.params = {};
                $scope.noOfAccountsSelected = 0;
                $scope.selectedAccountsList = [];
                $scope.showClearMessage = false;

                for (var i = 0; i < $scope.accounts.length; i++) {
                    $scope.accounts[i].selected = false;
                }

                $scope.filterDef($scope.params, ['accountIds']);
            }
        };

    }
]);

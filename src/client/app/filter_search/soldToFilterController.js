'use strict';
angular.module('mps.filterSearch')
.controller('SoldToFilterController', ['$scope', '$translate', 'AccountService', 'UserService',
    function($scope, $translate, Accounts, User) {
        User.getTransactionalAccounts().then(function(res) {
            var accts = res._embedded.transactionalAccounts,
            i = 0;

            $scope.soldToList = [];

            for (i; i < accts.length; i += 1) {
                $scope.soldToList.push({
                    soldTo: accts[i].account.soldToNumber,
                    accountId: accts[i].account.accountId
                });
            }
        });

        $scope.$watch('soldToFilter', function(soldToFilter) {
            if (soldToFilter) {
                $scope.params['accountLevel'] = 'siebel';
                $scope.params['accountId'] = soldToFilter;
                $scope.filterDef($scope.params, ['fromDate', 'toDate']);
            }
        });
    }
]);

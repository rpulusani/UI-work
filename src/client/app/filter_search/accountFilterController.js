define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('AccountFilterController', ['$scope', '$translate', 'AccountService', 'UserService',
        function($scope, $translate, Accounts, User) {
            $scope.showClearMessage = false;
            User.getTransactionalAccounts().then(function(res) {
                var accts = res._embedded.transactionalAccounts,
                i = 0;

                $scope.accounts = [];

                for (i; i < accts.length; i += 1) {
                    $scope.accounts.push({
                        name: accts[i].account.name,
                        accountId: accts[i].account.accountId
                    });
                }
            });

            $scope.$watch('accountFilter', function(accountFilter) {
                if (accountFilter) {
                    $scope.showClearMessage = true;
                    $scope.params['accountId'] = accountFilter;
                    $scope.filterDef($scope.params, ['fromDate', 'toDate', 'soldToNumber']);
                }
            });

            $scope.clearAccountFilter = function(){
                if($scope.filterDef && typeof $scope.filterDef === 'function'){
                    $scope.accountFilter = '';
                    $scope.params = {};
                    $scope.filterDef($scope.params, ['soldToNumber', 'accountId', 'fromDate', 'toDate']);
                }
            };
        }
    ]);
});

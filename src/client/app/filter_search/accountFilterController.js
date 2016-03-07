'use strict';
angular.module('mps.filterSearch')
.controller('AccountFilterController', ['$scope', '$translate', 'AccountService', 'UserService',
    function($scope, $translate, Accounts, User) {
        User.getTransactionalAccounts().then(function(res) {
            var accts = res._embedded.transactionalAccounts,
            i = 0;

            $scope.accounts = [];

            for (i; i < accts.length; i += 1) {
                $scope.accounts.push({
                    name: accts[i].account.name,
                    label: accts[i].account.name
                });
            }
        });
    }
]);

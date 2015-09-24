define(['angular', 'user', 'account.accountFactory'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .controller('AccountListController', ['$scope', 'AccountService',
        function($scope, AccountService) {
            var accountList = JSON.parse($scope.accounts);
            if (accountList.length > 0) {
                var i=0;
                for(i ; i < accountList.length ; i++) {
                    var accountId = accountList[i].href.split('/').pop();
                    $scope.accountName = "";
                    $scope.selectedAccount = AccountService.get({accountId: accountId}, function(response){
                        if ($scope.accountName !== ''){
                            $scope.accountName = $scope.accountName + ',' + response.name;
                        } else {
                            $scope.accountName = response.name;
                        }
                    });
                }
            }
        }
    ]);
});

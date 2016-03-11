

angular.module('mps.library')
.directive('libraryInlineDelete', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/library/templates/library-inline-delete.html',
        replace: true,
        scope: { onConfirmDelete: '&' },
        controller: 'libraryDeleteInlineController',
    };
})
.directive('libraryViewFields', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/library/templates/library-view-fields.html'
    };
})
.directive('libraryQueryFields', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/library/templates/library-query-fields.html'
    };
})
.directive('libraryNewFields', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/library/templates/library-new-fields.html',
        controller: ['$scope', 'AccountService', 'UserService', '$q', function($scope, Account, Users, $q){
            $scope.documentItem.accountList = [];
            Users.getLoggedInUserInfo().then(function() {
                if (Users.item._links.accounts) {
                    $scope.showAllAccounts = false;
                    if (angular.isArray(Users.item._links.accounts)) {
                        for (var i=0;i<Users.item._links.accounts.length;i++) {
                            $scope.documentItem.accountList.push(Users.item.accounts[i]);
                        }
                    } else {
                        Users.getAdditional(Users.item, Account).then(function() {
                            if ($scope.documentItem.accountList.length === 0) {
                                $scope.documentItem.accountList.push(Account.item);
                            }
                        });
                    }
                }
            });
        }]
    };
});


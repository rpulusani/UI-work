

angular.module('mps.invoice')
.controller('InvoiceController', ['$scope', '$location', '$rootScope', 'SecurityHelper',
    function($scope, $location, $rootScope, SecurityHelper) {
        $scope.currentTab = "allInvoiceTab";
        if(!$rootScope.viewInvoicesAccess){
            new SecurityHelper($rootScope).confirmPermissionCheck("viewInvoicesAccess");    
        }
        $scope.isActive = function(tabId){
           return tabId === $scope.currentTab;
        };
        $scope.onClickTb = function(tab){
            $scope.currentTab = tab;
        };
    }
]);


define(['angular', 'invoice'], function(angular) {
    'use strict';
    angular.module('mps.invoice')
    .controller('InvoiceController', ['$scope', '$location', '$rootScope', 'SecurityHelper',
        function($scope, $location, $rootScope, SecurityHelper) {
            $scope.currentTab = "allInvoiceTab";
            new SecurityHelper($rootScope).redirectCheck($rootScope.viewInvoicesAccess);
            $scope.isActive = function(tabId){
               return tabId === $scope.currentTab;
            };
            $scope.onClickTb = function(tab){
                $scope.currentTab = tab;
            };
        }
    ]);
});

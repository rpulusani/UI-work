define(['angular', 'invoice'], function(angular) {
    'use strict';
    angular.module('mps.invoice')
    .controller('InvoiceController', ['$scope', '$location',
        function($scope, $location, Device) {
            $scope.currentTab = "allInvoiceTab";
            $scope.isActive = function(tabId){
               return tabId === $scope.currentTab;
            };
            $scope.onClickTb = function(tab){
                $scope.currentTab = tab;
            };
        }
    ]);
});

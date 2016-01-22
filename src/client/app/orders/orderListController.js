define(['angular','order', 'order.factory', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.orders')
    .controller('OrderListController', [
        '$scope',
        '$location',
        '$rootScope',
        'OrderRequest',
        'grid',
        'PersonalizationServiceFactory',
        'FilterSearchService',
        function(
            $scope,
            $location,
            $rootScope,
            Orders,
            Grid,
            Personalize,
            FilterSearchService) {
            $rootScope.currentRowList = [];
            Orders.setParamsToNull();
            var personal = new Personalize($location.url(),$rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(Orders, $scope, $rootScope, personal, 'defaultSet');

            $scope.view = function(SR){
                Orders.setItem(SR);
                var options = {
                    params:{
                    }
                };
            };

            $scope.orders = Orders;

            filterSearchService.addBasicFilter('ORDER_MGT.ALL_ORDERS', {embed: 'primaryContact,requester'}, false, 
                function(Grid) {
                    setTimeout(function() {
                        $scope.$broadcast('setupPrintAndExport', $scope);
                        $scope.$broadcast('setupColumnPicker', Grid);
                    }, 0);
                }
            );
        }
    ]);
});

define(['angular','order', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.orders')
    .controller('SupplyOrderListController', [
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
            filterSearchService = new FilterSearchService(Orders, $scope, $rootScope, personal,'suppliesSet');

            $scope.view = function(SR){
                Orders.setItem(SR);
                var options = {
                    params:{
                    }
                };
            };
            var params =  {
                type: 'SUPPLIES_ORDERS_ALL',
                embed: 'primaryContact,requester'
            };

            filterSearchService.addBasicFilter('ORDER_MGT.ALL_SUPPLY_ORDERS', params, false,
                function(Grid) {
                    setTimeout(function() {
                        $scope.$broadcast('setupColumnPicker', Grid);
                        $scope.$broadcast('setupPrintAndExport', $scope);
                    }, 0);
                }
            );
            filterSearchService.addPanelFilter('FILTERS.FILTER_BY_DATE', 'DateRangeFilter', undefined,
                function(Grid) {
                    $scope.$broadcast('setupColumnPicker', Grid);
                    $scope.$broadcast('setupPrintAndExport', $scope);
                }
            );
            filterSearchService.addPanelFilter('FILTERS.FILTER_BY_SUPPLY_ORDER_STATUS', 'SupplyOrderTypeFilter', undefined,
                function(Grid) {
                    $scope.$broadcast('setupColumnPicker', Grid);
                    $scope.$broadcast('setupPrintAndExport', $scope);
                }
            );
            filterSearchService.addPanelFilter('FILTERS.FILTER_BY_ORDER_STATUS', 'OrderStatusFilter', undefined,
                function(Grid) {
                    $scope.$broadcast('setupColumnPicker', Grid);
                    $scope.$broadcast('setupPrintAndExport', $scope);
                }
            );
            filterSearchService.addPanelFilter('FILTERS.FILTER_MY_ORDERS', 'MyOrderFilter', undefined,
                function(Grid) {
                    $scope.$broadcast('setupColumnPicker', Grid);
                    $scope.$broadcast('setupPrintAndExport', $scope);
                }
            );
            filterSearchService.addPanelFilter('SERVICE_REQUEST.FILTER_BY_BOOKMARK', 'BookmarkFilter', undefined,
                function(Grid) {
                    setTimeout(function() {
                        $scope.$broadcast('setupColumnPicker', Grid);
                    }, 500);
                    $scope.$broadcast('setupPrintAndExport', $scope);
                }
            );
        }
    ]);
});

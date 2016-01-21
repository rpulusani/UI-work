define(['angular','deviceManagement'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceOrderController', [
        '$scope',
        '$location',
        '$rootScope',
        'Devices',
        'OrderRequest',
        'grid',
        'PersonalizationServiceFactory',
        'FilterSearchService',
        function(
            $scope,
            $location,
            $rootScope,
            Devices,
            Orders,
            GridService,
            Personalize,
            FilterSearchService) {
            $rootScope.currentRowList = [];
            Orders.setParamsToNull();
            var personal = new Personalize($location.url(),$rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(Orders, $scope, $rootScope, personal, 'singleAssetOrderSet');

            $scope.view = function(SR){
                Orders.setItem(SR);
                var options = {
                    params:{
                    }
                };
            };
            if(Devices.item){
                filterSearchService.addBasicFilter('ORDER_MGT.ALL_SUPPLY_ORDERS', {
                        type: 'SUPPLIES_ORDERS_ALL',
                        assetId: Devices.item.id
                });
            }
        }
    ]);
});


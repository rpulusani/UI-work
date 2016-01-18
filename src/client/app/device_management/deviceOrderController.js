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
            Grid,
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

            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Orders, personal);
            if(Devices.item){
                var options = {
                    params:{
                        type: 'SUPPLIES_ORDERS_ALL',
                        assetId: Devices.item.id
                    }
                };
                Orders.reset();
                Orders.getPage(0,20, options).then(function(){
                    Grid.display(Orders, $scope, personal);
                }, function(reason){
                    NREUM.noticeError('Grid Load Failed for getting ServiceRequests ' + Devices.serviceName +  ' reason: ' + reason);
                });
                filterSearchService.addBasicFilter('ORDER_MGT.ALL_SUPPLY_ORDERS');
            }
        }
    ]);
});


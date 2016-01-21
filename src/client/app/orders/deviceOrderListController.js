define(['angular','order', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.orders')
    .controller('DeviceOrderListController', [
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
            filterSearchService = new FilterSearchService(Orders, $scope, $rootScope, personal,'hardwareSet');

            $scope.view = function(SR){
                Orders.setItem(SR);
                var options = {
                    params:{
                    }
                };
            };
            var params =  {
                type: 'HARDWARE_ORDER',
                embed: 'primaryContact,requester'
            };

            filterSearchService.addBasicFilter('ORDER_MGT.ALL_DEVICE_ORDERS', params, false, 
                function() {
                    setTimeout(function() {
                        $scope.$broadcast('setupPrintAndExport', $scope);
                        $scope.$broadcast('setupColumnPicker', Grid)
                    }, 0);
                }
            );
        }
    ]);
});

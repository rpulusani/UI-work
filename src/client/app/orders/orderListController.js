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
        'ServiceRequestService',
        'FilterSearchService',
        'Devices',
        function(
            $scope,
            $location,
            $rootScope,
            Orders,
            Grid,
            Personalize,
            ServiceRequest,
            FilterSearchService,
            Devices) {
            $rootScope.currentRowList = [];
            Orders.setParamsToNull();
            var personal = new Personalize($location.url(),$rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(Orders, $scope, $rootScope, personal, 'defaultSet');

            $scope.view = function(SR){
              ServiceRequest.setItem(SR);
                var options = {
                    params:{
                        embed:'primaryContact,requester,address,account,asset,sourceAddress,shipToAddress,billToAddress'
                    }
                };
                ServiceRequest.item.get(options).then(function(){
                    Devices.setItem(ServiceRequest.item.asset);
                    $location.path(Orders.route + '/' + ServiceRequest.item.id + '/receipt');
                });
            };

            var removeParamsList = ['from', 'to', 'status', 'requesterFilter'],
                myRequestRemoveParamList = ['from', 'to', 'status'];
            filterSearchService.addBasicFilter('ORDER_MGT.ALL_ORDERS', {embed: 'primaryContact,requester'}, removeParamsList,
                function(Grid) {
                    setTimeout(function() {
                        $scope.$broadcast('setupPrintAndExport', $scope);
                        $scope.$broadcast('setupColumnPicker', Grid);
                    }, 0);
                }
            );
            filterSearchService.addPanelFilter('FILTERS.FILTER_BY_DATE', 'DateRangeFilter', undefined,
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
            filterSearchService.addBasicFilter('FILTERS.FILTER_MY_ORDERS', {requesterFilter: $rootScope.currentUser.contactId}, myRequestRemoveParamList,
                function(Grid) {
                    $scope.$broadcast('setupColumnPicker', Grid);
                    $scope.$broadcast('setupPrintAndExport', $scope);
                }
            );
        }
    ]);
});

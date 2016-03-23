

angular.module('mps.orders')
.controller('DeviceOrderListController', [
    '$scope',
    '$location',
    '$rootScope',
    'OrderRequest',
    'grid',
    'PersonalizationServiceFactory',
    'FilterSearchService',
    'ServiceRequestService',
    'Devices',
    function(
        $scope,
        $location,
        $rootScope,
        Orders,
        Grid,
        Personalize,
        FilterSearchService,
        ServiceRequest,
        Devices
        ) {
        $rootScope.currentRowList = [];

        Orders.setParamsToNull();
        var personal = new Personalize($location.url(),$rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(Orders, $scope, $rootScope, personal,'hardwareSet');

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
        var params =  {
            type: 'HARDWARE_ORDER',
            embed: 'primaryContact,requester'
        };

        var removeParamsList = ['from', 'to', 'status', 'requesterFilter'],
            myRequestRemoveParamList = ['from', 'to', 'status'];
        filterSearchService.addBasicFilter('ORDER_MAN.MANAGE_ORDERS.TXT_FILTER_ALL_HARDWARE_ORDERS', params, removeParamsList,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupPrintAndExport', $scope);
                    $scope.$broadcast('setupColumnPicker', Grid);
                }, 0);
            }
        );
        filterSearchService.addPanelFilter('ORDER_MAN.MANAGE_ORDERS.TXT_FILTER_DATE_RANGE', 'DateRangeFilter', undefined,
            function(Grid) {
                $scope.$broadcast('setupColumnPicker', Grid);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
        filterSearchService.addPanelFilter('ORDER_MAN.MANAGE_ORDERS.TXT_FILTER_ORDER_STATUS', 'OrderStatusFilter', undefined,
            function(Grid) {
                $scope.$broadcast('setupColumnPicker', Grid);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
        filterSearchService.addBasicFilter('ORDER_MAN.MANAGE_ORDERS.FILTER_MY_ORDERS', {requesterFilter: $rootScope.currentUser.contactId}, myRequestRemoveParamList,
            function(Grid) {
                $scope.$broadcast('setupColumnPicker', Grid);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
    }
]);


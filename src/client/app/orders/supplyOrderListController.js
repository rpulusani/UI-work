

angular.module('mps.orders')
.controller('SupplyOrderListController', [
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
        Orders.columns='suppliesSet';
        var personal = new Personalize($location.url(),$rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(Orders, $scope, $rootScope, personal,'suppliesSet');

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
                $location.search('tab','srDetailsAssociateRequestsTabl');
            });
        };
        var params =  {
            type: 'SUPPLIES_ORDERS_ALL',
            embed: 'primaryContact,requester,asset'
        };

        var removeParamsList = ['from', 'to', 'status', 'bookmarkFilter', 'requesterFilter'],
            myRequestRemoveParamList = ['from', 'to', 'status'];
        filterSearchService.addBasicFilter('ORDER_MAN.MANAGE_ORDERS.TXT_FILTER_ALL_SUPPLY_ORDERS', params, removeParamsList,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                    $scope.$broadcast('setupPrintAndExport', $scope);
                }, 0);
            }
        );
        filterSearchService.addPanelFilter('ORDER_MAN.MANAGE_ORDERS.TXT_FILTER_DATE_RANGE', 'DateRangeFilter', undefined,
            function(Grid) {
                $scope.$broadcast('setupColumnPicker', Grid);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
        filterSearchService.addPanelFilter('ORDER_MAN.MANAGE_ORDERS.TXT_FILTER_SUPPLY_ORDER_TYPE', 'SupplyOrderTypeFilter', undefined,
            function(Grid) {
                $scope.$broadcast('setupColumnPicker', Grid);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
        filterSearchService.addPanelFilter('ORDER_MAN.MANAGE_ORDERS.TXT_FILTER_ORDER_STATUS', 'RequestStatusFilterLong', undefined,
            function(Grid) {
                $scope.$broadcast('setupColumnPicker', Grid);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
        filterSearchService.addBasicFilter('ORDER_MAN.MANAGE_ORDERS.TXT_FILTER_MY_ORDERS', {requesterFilter: $rootScope.currentUser.contactId}, myRequestRemoveParamList,
            function(Grid) {
                $scope.$broadcast('setupColumnPicker', Grid);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
        filterSearchService.addPanelFilter('ORDER_MAN.MANAGE_ORDERS.TXT_FILTER_BOOKMARK_DEVICE_ORDERS', 'BookmarkFilter', undefined,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }, 500);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
    }
]);


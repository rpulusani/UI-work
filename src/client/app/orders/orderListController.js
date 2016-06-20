

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
        Orders.columns='defaultSet';
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
                $location.search('tab','srDetailAssociateRequestsTab');
            });
        };

        var removeParamsList = ['from', 'to', 'status', 'requesterFilter'],
            myRequestRemoveParamList = ['from', 'to', 'status'],
            allOrdersOptions = {
                embed: 'primaryContact,requester',
                type: 'ORDERS_ALL'
            },
            myOrdersOptions = {
                embed: 'primaryContact,requester',
                type: 'ORDERS_ALL',
                requesterFilter: $rootScope.currentUser.contactId
            };

        filterSearchService.addBasicFilter('ORDER_MAN.MANAGE_ORDERS.TXT_FILTER_ALL_ORDERS', allOrdersOptions, removeParamsList,
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
        filterSearchService.addPanelFilter('ORDER_MAN.MANAGE_ORDERS.TXT_FILTER_ORDER_STATUS', 'RequestStatusFilterLong', undefined,
            function(Grid) {
                $scope.$broadcast('setupColumnPicker', Grid);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );

        filterSearchService.addBasicFilter('ORDER_MAN.MANAGE_ORDERS.TXT_FILTER_MY_ORDERS', myOrdersOptions, myRequestRemoveParamList,
            function(Grid) {
                $scope.$broadcast('setupColumnPicker', Grid);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
    }
]);

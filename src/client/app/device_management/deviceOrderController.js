
angular.module('mps.deviceManagement')
.controller('DeviceOrderController', [
    '$scope',
    '$location',
    '$rootScope',
    'Devices',
    'OrderRequest',
    'grid',
    'FormatterService',
    'PersonalizationServiceFactory',
    'FilterSearchService',
    'ServiceRequestService',
    'SRControllerHelperService',
    '$translate',
    function(
        $scope,
        $location,
        $rootScope,
        Devices,
        Orders,
        GridService,
        FormatterService,
        Personalize,
        FilterSearchService,
        ServiceRequest,
        SRHelper,
        $translate
        ) {
        Orders.setParamsToNull();
        var personal = new Personalize($location.url(),$rootScope.idpUser.id),
        statusBarLevels = [
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED_SHORT'), value: 'SUBMITTED'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_IN_PROCESS'), value: 'INPROCESS'},
        { name: $translate.instant('DEVICE_MAN.COMMON.TXT_ORDER_SHIPPED'), value: 'SHIPPED'},
        { name: $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_ORDER_DELIVERED'), value: 'DELIVERED'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_COMPLETED'), value: 'COMPLETED'}];

        SRHelper.addMethods(ServiceRequest, $scope, $rootScope);

        function setupConfiguration(){
            $scope.configure = {
                translate: {
                    title: 'DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_RECENT_ORDER',
                    action: 'DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.LNK_VIEW_ALL_ORDERS',
                    subTitle: 'DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_ORDER_NUMBER'
                },
                actionLink: function(){
                    $location.hash('orders-history');
                    $anchorScroll();
                },
                statusDetails:{
                    translate:{
                        title: 'DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_ORDER_STATUS'
                    }
                },
                orderHistorySr:{
                    translate:{
                        title:'DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_RECENT_ORDER_CONTENTS'
                    }
                },
                sr: $scope.openOrder,
                itemUrl: function(){
                     $scope.view($scope.openOrder);
                },
                statusList: $scope.setStatusBar($scope.openOrder.status, $scope.openOrder.statusDate, statusBarLevels),
                mostRecent : {
                	date : FormatterService.formatDate($scope.openOrder.statusDate)
                }
            };
        }

        var options  = {
            'params':{
              'type': 'SUPPLIES_ORDERS_ALL',
              'assetId':Devices.item.id
            }
      };
      Orders.getPage(0, 1, options).then(function() {
          if(Orders.data && Orders.data.length === 1 ){
            $scope.openOrder = angular.copy(Orders.data[0]);
            if (!($scope.openOrder && $scope.openOrder.status)) {
                $scope.openOrder.status = 'SUBMITTED';
            }
            if (!($scope.openOrder && $scope.openOrder.statusDate)) {
                $scope.openOrder.statusDate = new Date().toString();
            }
            setupConfiguration();
          }
      });
        $scope.editable = true; //make order summary actionable

        function setupOrderGrid(){
            var Grid = new GridService();
            Orders.data = [];
            Orders.setParamsToNull();
            Orders.params.size = 20;
            var filterSearchService = new FilterSearchService(Orders, $scope, $rootScope,
                personal, 'singleAssetOrderSet', null, 'gridOrdersOptions');


            if(Devices.item){
                var params =  {
                    type: 'SUPPLIES_ORDERS_ALL',
                    assetId: Devices.item.id
                };
                $scope.gridOrdersOptions.showBookmarkColumn = false;
                filterSearchService.addBasicFilter('ORDER_MAN.MANAGE_ORDERS.TXT_FILTER_ALL_SUPPLY_ORDERS', params, false, function() {
                    $scope.$broadcast('setupPrintAndExport', $scope);
                });
            }
        }
         $scope.view = function(SR){
          ServiceRequest.setItem(SR);
            var options = {
                params:{
                    embed:'primaryContact,requester,address,account,asset,sourceAddress,shipToAddress,billToAddress'
                }
            };
            ServiceRequest.item.get(options).then(function(){
                //Devices.setItem(ServiceRequest.item.asset);
                $location.path(Orders.route + '/' + ServiceRequest.item.id + '/receipt');
            });
        };
        setupOrderGrid();
    }
]);

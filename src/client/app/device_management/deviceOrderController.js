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
        'ServiceRequestService',
        function(
            $scope,
            $location,
            $rootScope,
            Devices,
            Orders,
            GridService,
            Personalize,
            FilterSearchService,
            ServiceRequest
            ) {
            Orders.setParamsToNull();
            var personal = new Personalize($location.url(),$rootScope.idpUser.id);
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
                    statusList:[
                      {
                        'label':'Submitted',
                        'date': '1/29/2016',
                        'current': true
                      },
                      {
                        'label':'In progress',
                        'date': '',
                        'current': false
                      },
                      {
                        'label':'Completed',
                        'date': '',
                        'current': false
                      }
                    ]
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
                    filterSearchService.addBasicFilter('ORDER_MGT.ALL_SUPPLY_ORDERS', params, false, function() {
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
                    Devices.setItem(ServiceRequest.item.asset);
                    $location.path(Orders.route + '/' + ServiceRequest.item.id + '/receipt');
                });
            };
            setupOrderGrid();
        }
    ]);
});


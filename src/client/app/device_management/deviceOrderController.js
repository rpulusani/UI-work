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
                statusList:[
                  {
                    'label':'Submitted',
                    'date': '1/29/2016',
                    'current': true,
                    'progress': 'active'
                  },
                  {
                    'label':'In progress',
                    'date': '',
                    'current': false,
                    'progress': 'active'
                  },
                  {
                    'label':'Completed',
                    'date': '',
                    'current': false,
                    'progress': ''
                  }
                ],
                dateCheck: function(incommingDateStr){
                    console.log(incommingDateStr);
                  if(incommingDateStr && incommingDateStr.trim() !== ''){
                    console.log(incommingDateStr + ' true');
                    return true;
                  }else{
                    console.log(incommingDateStr + ' false');
                    return false;
                  }
                }
            };

            $scope.editable = true; //make order summary actionable

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


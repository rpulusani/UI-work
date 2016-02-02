define(['angular', 'deviceManagement', 'utility.blankCheckUtility', 'deviceManagement.deviceFactory', 'utility.imageService', 'utility.grid', 'serviceRequest'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceNotificationController', [
        '$scope',
        'OrderRequest',
        'Devices',
        'ServiceRequestService',
        '$location',
        '$rootScope',
        function(
            $scope,
            Orders,
            Devices,
            ServiceRequest,
            $location,
            $rootScope
            ) {
                $scope.show = false;
                $scope.serviceHistoryMessage = false;
                $scope.ordersMessage = false;
                ServiceRequest.data = [];
                Orders.data = [];
                $scope.dismiss = function(){
                    $scope.show = false;
                };

                var orderOptions  = {
                    'params':{
                      'type': 'SUPPLIES_ORDERS_ALL',
                      'assetId':Devices.item.id,
                      'status': 'SUBMITTED'
                    }
                };
                Orders.getPage(0, 1, orderOptions).then(function() {
                     if(Orders.data && Orders.data.length === 1 ){
                        $scope.openOrder = angular.copy(Orders.data[0]);
                        $scope.ordersMessage = true;
                        $scope.show = true;
                    }else{
                        $scope.ordersMessage = false;
                    }
                 });
                var srOptions  = {
                    'params':{
                      'type': 'BREAK_FIX',
                      'assetId':Devices.item.id,
                      'status': 'SUBMITTED'
                    }
                };
              ServiceRequest.getPage(0, 1, srOptions).then(function() {
                  if(ServiceRequest.data && ServiceRequest.data.length === 1 ){
                    $scope.openSR = angular.copy(ServiceRequest.data[0]);
                    $scope.serviceHistoryMessage = true;
                    $scope.show = true;
                  }else{
                    $scope.serviceHistoryMessage = false;
                  }

              });
              $scope.goto = function(tab){
                $rootScope.currentDeviceTab = tab;
                $location.search('tab', tab);
              };

        }]);
});


angular.module('mps.deviceManagement')
.controller('DeviceNotificationController', [
    '$scope',
    '$rootScope',
    'OrderRequest',
    'Devices',
    'ServiceRequestService',
    'FormatterService',
    '$translate',
    '$location',
    function(
        $scope,
        $rootScope,
        Orders,
        Devices,
        ServiceRequest,
        FormatterService,
        $translate,
        $location
        ) {
            $scope.show = false;
            $scope.serviceHistoryMessage = false;
            $scope.ordersMessage = false;
            $scope.notificationLength = 0;
            ServiceRequest.data = [];
            Orders.data = [];

            $scope.dismiss = function(){
                $scope.show = false;
            };

            $scope.viewSR = function(SR){
              ServiceRequest.setItem(SR);
                var options = {
                    params:{
                        embed:'primaryContact,requester,address,account,asset,sourceAddress'
                    }
                };
                ServiceRequest.item.get(options).then(function(){
                    $location.path(ServiceRequest.route + '/' + SR.id + '/receipt');
                });
            };

            $scope.viewOrder = function(SR){
                ServiceRequest.setItem(SR);
                var options = {
                    params:{
                        embed:'primaryContact,requester,address,account,asset,sourceAddress,shipToAddress,billToAddress'
                    }
                };
                ServiceRequest.item.get(options).then(function(){
                  $location.path(Orders.route + '/' + ServiceRequest.item.id + '/receipt');
                });
            };

            var orderOptions  = {
                'params':{
                  'type': 'SUPPLIES_ORDERS_ALL',
                  'assetId':Devices.item.id,
                  'status': ['SUBMITTED', 'IN_PROCESS', 'SHIPPED']
                }
            },
            statusBarLevels = [
              { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED_SHORT'), value: 'SUBMITTED'},
              { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_IN_PROCESS'), value: 'INPROCESS'},
              { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_SHIPPED'), value: 'SHIPPED'}];

            Orders.getPage(0, 100000, orderOptions).then(function() {
                 if(Orders.data && Orders.data.length > 0 && $rootScope.viewSupplyOrderAccess){
                    $scope.notificationLength = $scope.notificationLength + Orders.data.length;
                    $scope.openOrderList = angular.copy(Orders.data);
                    var i = 0, j = 0, tempStatus;
                    for (i; i < $scope.openOrderList.length; i+=1) {
                      if ($scope.openOrderList[i].statusDate){
                        $scope.openOrderList[i].updatedStatusDate = FormatterService.formatDate($scope.openOrderList[i].statusDate);
                      }

                      for (j = 0; j<statusBarLevels.length; j++){
                        console.info($scope.openOrderList[i].status.toLowerCase().replace(/_/g, ''));
                        console.info(statusBarLevels[j]);
                        if ($scope.openOrderList[i].status && 
                          $scope.openOrderList[i].status.toLowerCase().replace(/_/g, '') === statusBarLevels[j].value.toLowerCase()) {
                          tempStatus = statusBarLevels[j].name;
                          break;
                        }
                      }
                      $scope.openOrderList[i].updatedStatus = tempStatus;
                    }
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
                  'status': ['SUBMITTED', 'IN_PROCESS', 'SHIPPED']
                }
            };
          ServiceRequest.getPage(0, 100000, srOptions).then(function() {
              if(ServiceRequest.data && ServiceRequest.data.length > 0 && $rootScope.serviceRequestBreakFixAccess){
                $scope.notificationLength = $scope.notificationLength + ServiceRequest.data.length;
                $scope.openSRList = angular.copy(ServiceRequest.data);
                var i = 0, j = 0, tempStatus;
                for (i; i < $scope.openSRList.length; i+=1) {
                  if($scope.openSRList[i].statusDate){
                    $scope.openSRList[i].updatedStatusDate = FormatterService.formatDate($scope.openSRList[i].statusDate);
                  }
                  
                  for(j; j<statusBarLevels.length; j++){
                    if($scope.openSRList[i].status && 
                      $scope.openSRList[i].status.toLowerCase().replace(/_/g, '') === statusBarLevels[j].value.toLowerCase()) {
                        tempStatus = statusBarLevels[j].name;
                        break;
                    }
                  }
                  $scope.openSRList[i].updatedStatus = tempStatus;
                }

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

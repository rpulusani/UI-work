define(['angular', 'deviceManagement', 'serviceRequest', 'deviceManagement.deviceRequestFactory', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceRequestBreakFixListController', [
      '$scope',
      '$translate',
      'grid',
      '$rootScope',
      'PersonalizationServiceFactory',
      'ServiceRequestService',
      '$location',
      'Devices',
      'FilterSearchService',
      '$anchorScroll',
        function(
          $scope,
          $translate,
          GridService,
          $rootScope,
          Personalize,
          ServiceRequest,
          $location,
          Devices,
          FilterSearchService,
          $anchorScroll
          ) {
            ServiceRequest.setParamsToNull();
            var personal = new Personalize($location.url(),$rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(ServiceRequest, $scope, $rootScope, personal,'breakfixSet');


            $scope.configure = {
              translate: {
                title: 'DEVICE_MAN.DEVICE_SERVICE_HISTORY.TXT_OPEN_SR',
                action: 'DEVICE_MAN.DEVICE_SERVICE_HISTORY.LNK_VIEW_SERVICE_HISTORY'
              },
              actionLink: function(){
                $location.hash('break-fix');
                $anchorScroll();
              },
              statusDetails:{
                translate:{
                  title:'DEVICE_MAN.DEVICE_SERVICE_HISTORY.TXT_REQUEST_STATUS'
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
                    'progress': ''
                  },
                  {
                    'label':'Completed',
                    'date': '',
                    'current': false,
                    'progress': ''
                  }
                ],
                dateCheck: function(incommingDateStr){
                  if(incommingDateStr && incommingDateStr.trim() !== ''){
                    return true;
                  }else{
                    return false;
                  }
                }
            };

          if(Devices.item){
            var params =  {
                type: 'BREAK_FIX',
                assetId: Devices.item.id
            };
            filterSearchService.addBasicFilter('REQUEST_MGMT.SERVICE_REQUESTS', params);

            $scope.view = function(SR){
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
          }
        }
    ]);
});

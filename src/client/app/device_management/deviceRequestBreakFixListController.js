define(['angular', 'deviceManagement', 'serviceRequest', 'deviceManagement.deviceRequestFactory', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceRequestBreakFixListController', ['$scope', '$translate', 'grid', '$rootScope',
        'PersonalizationServiceFactory', 'ServiceRequestService', '$location', 'Devices', 'FilterSearchService',
        function($scope, $translate, GridService, $rootScope, Personalize, ServiceRequest,  $location, Devices, FilterSearchService) {
            $rootScope.currentRowList = [];
            ServiceRequest.setParamsToNull();
            var personal = new Personalize($location.url(),$rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(ServiceRequest, $scope, $rootScope, personal);


            $scope.configure = {
              translate: {
                title: 'DEVICE_MAN.DEVICE_SERVICE_HISTORY.TXT_OPEN_SR',
                action: 'DEVICE_MAN.DEVICE_SERVICE_HISTORY.LNK_VIEW_SERVICE_HISTORY'
              },
              actionLink: function(){
                  console.log('Clicked Action Link!');
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

            var Grid = new GridService();
            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, ServiceRequest, personal);
            if(Devices.item){
              var options = {
                params:{
                  type: 'BREAK_FIX',
                  assetId: Devices.item.id
                }
               };
              ServiceRequest.reset();
              ServiceRequest.getPage(0,20, options).then(function(){
                  ServiceRequest.columns = 'breakfixSet';
                  Grid.display(ServiceRequest, $scope, personal);
              }, function(reason){
                  NREUM.noticeError('Grid Load Failed for getting ServiceRequests ' + Devices.serviceName +  ' reason: ' + reason);
              });
            var params =  {
                type: 'BREAK_FIX'
            };
              filterSearchService.addBasicFilter('REQUEST_MGMT.SERVICE_REQUESTS', params);
              //filterSearchService.addPanelFilter('Filter By CHL', 'CHLFilter');

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

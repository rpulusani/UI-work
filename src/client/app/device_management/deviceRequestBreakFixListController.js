define(['angular', 'deviceManagement', 'serviceRequest', 'deviceManagement.deviceRequestFactory', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceRequestBreakFixListController', ['$scope', '$translate', 'grid', '$rootScope',
        'PersonalizationServiceFactory', 'ServiceRequestService', '$location', 'Devices', 'FilterSearchService',
        function($scope, $translate, Grid, $rootScope, Personalize, ServiceRequest,  $location, Devices, FilterSearchService) {
            $rootScope.currentRowList = [];
            var personal = new Personalize($location.url(),$rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(ServiceRequest, $scope, $rootScope, personal);

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
              filterSearchService.addBasicFilter('DEVICE_MGT.ALL_DEVICES', options);
              filterSearchService.addPanelFilter('Filter By CHL', 'CHLFilter');
          }
        }
    ]);
});

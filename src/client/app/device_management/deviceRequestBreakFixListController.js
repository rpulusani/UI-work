define(['angular', 'deviceManagement', 'serviceRequest', 'deviceManagement.deviceRequestFactory', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceRequestBreakFixListController', ['$scope', '$translate', 'grid', '$rootScope',
        'PersonalizationServiceFactory', 'ServiceRequestService', '$location', 'Devices',
        function($scope, $translate, Grid, $rootScope, Personalize, ServiceRequest,  $location, Devices) {
            $rootScope.currentRowList = [];
            var personal = new Personalize($location.url(),$rootScope.idpUser.id);

            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, ServiceRequest, personal);
            if(Devices.item){
              var options = {
                //type: 'BREAK_FIX',
                assetId: Devices.item.id
               };
              ServiceRequest.getPage(0,20, options).then(function(){
                  ServiceRequest.columns = 'breakfixSet';
                  Grid.display(ServiceRequest, $scope, personal);
              }, function(reason){
                  NREUM.noticeError('Grid Load Failed for getting ServiceRequests ' + Devices.serviceName +  ' reason: ' + reason);
              });
          }
        }
    ]);
});

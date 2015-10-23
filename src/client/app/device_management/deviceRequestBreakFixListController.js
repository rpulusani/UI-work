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
              Devices.getAdditional(Devices.item, ServiceRequest).then(function(){
                  Grid.display(ServiceRequest, $scope, personal);
              }, function(reason){
                  NREUM.noticeError('Grid Load Failed for getting ServiceRequests ' + Devices.serviceName +  ' reason: ' + reason);
              });
          }
        }
    ]);
});


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
  'SRControllerHelperService',
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
      SRHelper,
      $anchorScroll
      ) {
        ServiceRequest.setParamsToNull();
        var personal = new Personalize($location.url(),$rootScope.idpUser.id),
        statusBarLevels = [
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED_SHORT'), value: 'SUBMITTED'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_IN_PROCESS'), value: 'INPROCESS'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_COMPLETED'), value: 'COMPLETED'}];

        SRHelper.addMethods(ServiceRequest, $scope, $rootScope);

        function setupConfiguration(){
          $scope.configure = {
            translate: {
              title: 'DEVICE_MAN.DEVICE_SERVICE_HISTORY.TXT_OPEN_SR',
              action: 'DEVICE_MAN.DEVICE_SERVICE_HISTORY.LNK_VIEW_SERVICE_HISTORY',
              subTitle:'DEVICE_MAN.DEVICE_SERVICE_HISTORY.TXT_SERVICE_REQUEST_NUMBER'
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
            serviceHistorySr:{
              translate:{
                title:'DEVICE_MAN.DEVICE_SERVICE_HISTORY.TXT_SERVICE_SUMMARY',
                reference: 'DEVICE_MAN.DEVICE_SERVICE_HISTORY.TXT_REQUEST_CUST_REF_ID',
                problem: 'DEVICE_MAN.DEVICE_SERVICE_HISTORY.TXT_PROBLEM_DESC'
              }
            },
            sr: $scope.openSR,
            itemUrl: function(){
              $scope.view($scope.openSR);
            },
            statusList: $scope.setStatusBar($scope.openSR.status, $scope.openSR.statusDate, statusBarLevels)
          };
        }

        //get Single Top most SR
        //https://api.venus-dev.lexmark.com/mps/service-requests?size=1&accountId=62117&accountLevel=legal&assetId=1-YWMERAL&type=BREAK_FIX
      var options  = {
            'params':{
              'type': 'BREAK_FIX',
              'assetId':Devices.item.id
            }
      };
      ServiceRequest.getPage(0, 1, options).then(function() {
          if(ServiceRequest.data && ServiceRequest.data.length === 1 ){
            $scope.openSR = angular.copy(ServiceRequest.data[0]);
            if (!($scope.openSR && $scope.openSR.status)) {
                $scope.openSR.status = 'SUBMITTED';
            }
            if (!($scope.openSR && $scope.openSR.statusDate)) {
                $scope.openSR.statusDate = new Date().toString();
            }
            setupConfiguration();
          }

      });

      function setupGrid(){
        ServiceRequest.data = [];
        ServiceRequest.setParamsToNull();
        ServiceRequest.params.size = 20;
        var filterSearchService = new FilterSearchService(ServiceRequest, $scope, $rootScope, personal,'breakfixSet');

        if(Devices.item){
          var params =  {
              type: 'BREAK_FIX',
              assetId: Devices.item.id
          };
          $scope.gridOptions.showBookmarkColumn = false;
              filterSearchService.addBasicFilter('DEVICE_MAN.DEVICE_SERVICE_HISTORY.TXT_DEVICE_SERVICE_HISTORY', params);
        }
      }

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

        setupGrid();
    }
]);

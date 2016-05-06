

angular.module('mps.serviceRequestAddresses')
.controller('ServiceRequestDeviceListController', [
    '$scope',
    '$location',
    '$rootScope',
    'ServiceRequestService',
    'grid',
    'PersonalizationServiceFactory',
    'FilterSearchService',
    function(
        $scope,
        $location,
        $rootScope,
        ServiceRequest,
        Grid,
        Personalize,
        FilterSearchService) {
        $rootScope.currentRowList = [];

        ServiceRequest.setParamsToNull();
        ServiceRequest.columns='madcSetSR';
        var personal = new Personalize($location.url(),$rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(ServiceRequest, $scope, $rootScope, personal,'madcSetSR');

       $scope.view = function(SR){
          ServiceRequest.setItem(SR);
            var options = {
                params:{
                    embed:'primaryContact,requester,address,account,asset,sourceAddress,destinationAddress'
                }
            };
            ServiceRequest.item.get(options).then(function(){
                $location.path(ServiceRequest.route + '/' + SR.id + '/receipt');
            });

        };

        var params =  {
            type: 'MADC_ALL,DATA_ASSET_ALL',
            embed: 'primaryContact,requester,sourceAddress'
        };
        var removeParamsList = ['from', 'to', 'status', 'chlFilter', 'location', 'requesterFilter'],
            myRequestRemoveParamList = ['from', 'to', 'status', 'chlFilter', 'location'];
        filterSearchService.addBasicFilter('DEVICE_SERVICE_REQUEST.ALL_DEVICES_REQUESTS', params, removeParamsList,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }, 500);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
        filterSearchService.addPanelFilter('REQUEST_MAN.COMMON.TXT_FILTER_STATUS', 'RequestStatusFilterShort', undefined,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }, 500);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
        filterSearchService.addPanelFilter('REQUEST_MAN.MANAGE_REQUESTS.TXT_FILTER_TYPE', 'DeviceRequestTypeFilter', undefined,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }, 500);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
        filterSearchService.addPanelFilter('REQUEST_MAN.COMMON.TXT_FILTER_DEVICE_CHL', 'CHLFilter', undefined,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }, 500);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
        filterSearchService.addPanelFilter('REQUEST_MAN.COMMON.TXT_FILTER_LOCATION', 'LocationFilter', undefined,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }, 500);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
        filterSearchService.addPanelFilter('REQUEST_MAN.COMMON.TXT_FILTER_DATE_RANGE', 'DateRangeFilter', undefined,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }, 500);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
        filterSearchService.addBasicFilter('REQUEST_MAN.COMMON.TXT_FILTER_MY_REQUESTS', {requesterFilter: $rootScope.currentUser.contactId}, myRequestRemoveParamList,
            function(Grid) {
                $scope.$broadcast('setupColumnPicker', Grid);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
    }
]);


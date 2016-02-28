

angular.module('mps.serviceRequestAddresses')
.controller('ServiceRequestBreakFixListController', [
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
        var personal = new Personalize($location.url(),$rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(ServiceRequest, $scope, $rootScope, personal,'breakfixSRSet');

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

        var params =  {
            type: 'BREAK_FIX',
            embed: 'primaryContact,requester,asset,sourceAddress'
        };
        var removeParamsList = ['from', 'to', 'status', 'chlFilter', 'location', 'requesterFilter'],
            myRequestRemoveParamList = ['from', 'to', 'status', 'chlFilter', 'location'];
        filterSearchService.addBasicFilter('REQUEST_MGMT.ALL_SERVICE_REQUESTS', params, removeParamsList,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }, 500);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
        filterSearchService.addPanelFilter('FILTERS.FILTER_BY_REQUEST_STATS', 'RequestStatusFilter', undefined,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }, 500);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
        filterSearchService.addPanelFilter('SERVICE_REQUEST.FILTER_BY_CHL', 'CHLFilter', undefined,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }, 500);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
        filterSearchService.addPanelFilter('SERVICE_REQUEST.FILTER_BY_LOCATION', 'LocationFilter', undefined,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }, 500);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
        filterSearchService.addPanelFilter('FILTERS.FILTER_BY_DATE', 'DateRangeFilter', undefined,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }, 500);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
        filterSearchService.addBasicFilter('FILTERS.FILTER_MY_REQUESTS', {requesterFilter: $rootScope.currentUser.contactId}, myRequestRemoveParamList,
            function(Grid) {
                $scope.$broadcast('setupColumnPicker', Grid);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
    }
]);


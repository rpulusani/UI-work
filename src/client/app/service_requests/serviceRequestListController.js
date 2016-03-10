define(['angular','serviceRequest', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('ServiceRequestListController', [
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
            filterSearchService = new FilterSearchService(ServiceRequest, $scope, $rootScope, personal, 'defaultSet');

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
            var removeParamsList = ['from', 'to', 'requesterFilter'],
                myRequestRemoveParamList = ['from', 'to'];
            filterSearchService.addBasicFilter('REQUEST_MGMT.ALL_REQUESTS', {embed: 'primaryContact,requester'}, removeParamsList,
                function(Grid) {
                    $scope.$broadcast('setupColumnPicker', Grid);
                    $scope.$broadcast('setupPrintAndExport', $scope);
                }
            );
            filterSearchService.addPanelFilter('REQUEST_MAN.COMMON.TXT_FILTER_DATE_RANGE', 'DateRangeFilter', undefined,
                function(Grid) {
                    $scope.$broadcast('setupColumnPicker', Grid);
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
});

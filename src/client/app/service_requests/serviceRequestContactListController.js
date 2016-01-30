define(['angular','serviceRequest', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('ServiceRequestContactListController', [
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
            filterSearchService = new FilterSearchService(ServiceRequest, $scope, $rootScope, personal, 'contactSet');

            $scope.view = function(SR){
                ServiceRequest.setItem(SR);
                var options = {
                    params:{
                    }
                };
            };
            var params =  {
                type: 'DATA_CONTACT_ALL',
                embed: 'primaryContact,requester'
            };

            filterSearchService.addBasicFilter('All contact service requests', params, false,
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
            filterSearchService.addPanelFilter('FILTERS.FILTER_MY_REQUESTS', 'MyOrderFilter', undefined,
                function(Grid) {
                    setTimeout(function() {
                        $scope.$broadcast('setupColumnPicker', Grid);
                    }, 500);
                    $scope.$broadcast('setupPrintAndExport', $scope);
                }
            );
        }
    ]);
});

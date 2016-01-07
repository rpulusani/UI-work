define(['angular','serviceRequest', 'utility.grid'], function(angular) {
    'use strict';
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
            filterSearchService = new FilterSearchService(ServiceRequest, $scope, $rootScope, personal);

            $scope.view = function(SR){
                ServiceRequest.setItem(SR);
                var options = {
                    params:{
                    }
                };
            };
            var params =  {
                type: 'BREAK_FIX'
            };

            filterSearchService.addBasicFilter('REQUEST_MGMT.ALL_SERVICE_REQUESTS', params,
                function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }
            );
            filterSearchService.addPanelFilter('Filter By CHL', 'CHLFilter');
        }
    ]);
});

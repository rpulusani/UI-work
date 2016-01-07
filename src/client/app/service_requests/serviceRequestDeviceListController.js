define(['angular','serviceRequest', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('ServiceRequestDeviceListController', [
        '$scope',
        '$location',
        '$rootScope',
        'ServiceRequestService',
        'grid',
        'PersonalizationServiceFactory',
        'FilterSearchService',
        'SecurityHelper',
        function(
            $scope,
            $location,
            $rootScope,
            ServiceRequest,
            Grid,
            Personalize,
            FilterSearchService,
            SecurityHelper) {
            $rootScope.currentRowList = [];

            new SecurityHelper($rootScope).redirectCheck($rootScope.serviceRequestAccess);
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
                type: 'MADC_ALL'
            };

            filterSearchService.addBasicFilter('DEVICE_SERVICE_REQUEST.CHANGE_HISTORY', params,
                function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }
            );
        }
    ]);
});

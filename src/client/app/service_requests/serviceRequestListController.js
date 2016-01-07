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
            filterSearchService = new FilterSearchService(ServiceRequest, $scope, $rootScope, personal, 'madcSet');

            $scope.view = function(SR){
                ServiceRequest.setItem(SR);
                var options = {
                    params:{
                    }
                };
            };

            filterSearchService.addBasicFilter('REQUEST_MGMT.ALL_REQUESTS', {},
                function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }
            );
        }
    ]);
});

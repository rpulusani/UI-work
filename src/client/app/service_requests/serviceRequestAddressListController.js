define(['angular','serviceRequest', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('ServiceRequestAddressListController', [
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
            filterSearchService = new FilterSearchService(ServiceRequest, $scope, $rootScope, personal,'addressSet');

            $scope.view = function(SR){
                ServiceRequest.setItem(SR);
                var options = {
                    params:{
                    }
                };
            };
            var params =  {
                type: 'DATA_ADDRESS_ALL',
                embed: 'primaryContact,requester,sourceAddress'
            };

            filterSearchService.addBasicFilter('All address service requests', params, false,
                function(Grid) {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }
            );
        }
    ]);
});

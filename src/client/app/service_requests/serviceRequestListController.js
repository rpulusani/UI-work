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

            filterSearchService.addBasicFilter('REQUEST_MGMT.ALL_REQUESTS', {embed: 'primaryContact,requester'}, false,
                function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }
            );
        }
    ]);
});

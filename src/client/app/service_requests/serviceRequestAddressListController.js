define(['angular','serviceRequest', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('ServiceRequestAddressListController', [
        '$scope',
        '$location',
        '$rootScope',
        'ServiceRequestService',
        'Addresses',
        'grid',
        'PersonalizationServiceFactory',
        'FilterSearchService',
        function(
            $scope,
            $location,
            $rootScope,
            ServiceRequest,
            Addresses,
            Grid,
            Personalize,
            FilterSearchService) {
            $rootScope.currentRowList = [];

            ServiceRequest.setParamsToNull();
            var personal = new Personalize($location.url(),$rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(ServiceRequest, $scope, $rootScope, personal,'addressSet');

            $scope.goToCreate = function() {
                Addresses.item = {};
                $location.path('/service_requests/addresses/new');
            };
            $scope.view = function(SR){
              ServiceRequest.setItem(SR);
                var options = {
                    params:{
                        embed:'primaryContact,requester,address,account,sourceAddress'
                    }
                };
                ServiceRequest.item.get(options).then(function(){
                    $location.path(ServiceRequest.route + '/' + SR.id + '/receipt');
                });

            };
            var params =  {
                type: 'DATA_ADDRESS_ALL',
                embed: 'primaryContact,requester,sourceAddress'
            };
            var removeParamsList = ['from', 'to', 'location', 'requesterFilter'],
                myRequestRemoveParamList = ['from', 'to', 'location'];
            filterSearchService.addBasicFilter('All address service requests', params, removeParamsList,
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
});

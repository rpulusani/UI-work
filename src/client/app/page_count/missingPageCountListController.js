define(['angular','pageCount', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.pageCount')
    .controller('MissingPageCountListController', [
        '$scope',
        '$location',
        '$rootScope',
        'PageCountService',
        'grid',
        'PersonalizationServiceFactory',
        'ServiceRequestService',
        'FilterSearchService',
        'Devices',
        function(
            $scope,
            $location,
            $rootScope,
            PageCountService,
            Grid,
            Personalize,
            ServiceRequest,
            FilterSearchService,
            Devices) {
            $rootScope.currentRowList = [];
            PageCountService.setParamsToNull();
            var personal = new Personalize($location.url(),$rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(PageCountService, $scope, $rootScope, personal, 'defaultSet');

            $scope.view = function(SR){
              ServiceRequest.setItem(SR);
                var options = {
                    params:{
                        embed:'primaryContact,requester,address,account,asset,sourceAddress,shipToAddress,billToAddress'
                    }
                };
                ServiceRequest.item.get(options).then(function(){
                    Devices.setItem(ServiceRequest.item.asset);
                    $location.path(PageCountService.route + '/' + ServiceRequest.item.id + '/receipt');
                });
            };

            var removeParamsList = ['from', 'to', 'source', 'location', 'chlFilter'];
            filterSearchService.addBasicFilter('DEVICE_MAN.DEVICE_PAGE_COUNTS.TXT_PAGE_COUNT_ALL_PAGE_COUNTS', {'missingMeterReads': true}, removeParamsList,
                function(Grid) {
                    setTimeout(function() {
                        $scope.$broadcast('setupPrintAndExport', $scope);
                    }, 0);
                }
            );
            filterSearchService.addPanelFilter('SERVICE_REQUEST.FILTER_BY_CHL', 'CHLFilter', undefined,
                function(Grid) {
                    setTimeout(function() {
                        $scope.$broadcast('setupPrintAndExport', $scope);
                    }, 500);
                }
            );
            filterSearchService.addPanelFilter('SERVICE_REQUEST.FILTER_BY_LOCATION', 'LocationFilter', undefined,
                function(Grid) {
                    setTimeout(function() {
                        $scope.$broadcast('setupPrintAndExport', $scope);
                    }, 500);
                }
            );
            filterSearchService.addPanelFilter('FILTERS.FILTER_BY_DATE', 'DateRangeFilter', undefined,
                function(Grid) {
                    setTimeout(function() {
                        $scope.$broadcast('setupPrintAndExport', $scope);
                    }, 500);
                }
            );
        }
    ]);
});

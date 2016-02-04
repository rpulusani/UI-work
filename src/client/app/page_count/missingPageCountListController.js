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
        'BlankCheck',
        'ServiceRequestService',
        'FormatterService',
        'FilterSearchService',
        'MeterReadService',
        'Devices',
        '$q',
        '$window',
        function(
            $scope,
            $location,
            $rootScope,
            PageCountService,
            Grid,
            Personalize,
            BlankCheck,
            ServiceRequest,
            FormatterService,
            FilterSearchService,
            MeterReads,
            Devices,
            $q,
            $window) {
            $rootScope.currentRowList = [];
            PageCountService.setParamsToNull();
            var personal = new Personalize($location.url(),$rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(PageCountService, $scope, $rootScope, personal, 'defaultSet');

            $scope.view = function(devicePageCount){
                $scope.device = devicePageCount._embedded.asset;
                $scope.device._links = {'self':{'href':{}}};
                $scope.device._links.self.href = devicePageCount._links.asset.href;
                Devices.setItem($scope.device);
                var options = {
                    params:{
                        embed:'contact,address'
                    }
                };

                Devices.item.get(options).then(function(){
                    $location.search('tab', 'pageCountTab');
                    $location.path(Devices.route + '/' + devicePageCount.assetId + '/review');
                });
            };

            $scope.save = function(devicePageCount){
                $scope.meterReadList = [];
                if (BlankCheck.checkNotNullOrUndefined(devicePageCount.ltpcMeterReadId)) {
                    MeterReads.newMessage();
                    var ltpc = MeterReads.item;
                    ltpc.postURL = devicePageCount._links.ltpcMeterRead.href;
                    MeterReads.addField('id', devicePageCount.ltpcMeterReadId);
                    MeterReads.addField('value', devicePageCount.newLtpcCount);
                    MeterReads.addField('type', 'LTPC');
                    if (BlankCheck.checkNotNullOrUndefined(devicePageCount.currentReadDate)) {
                        MeterReads.addField('updateDate', FormatterService.formatDateForPost(devicePageCount.currentReadDate));
                    }
                    $scope.meterReadList.push(ltpc);
                }
                if (BlankCheck.checkNotNullOrUndefined(devicePageCount.colorMeterReadId)) {
                    MeterReads.newMessage();
                    var color = MeterReads.item;
                    color.postURL = devicePageCount._links.colorMeterRead.href;
                    MeterReads.addField('id', devicePageCount.colorMeterReadId);
                    MeterReads.addField('value', devicePageCount.newColorCount);
                    MeterReads.addField('type', 'COLOR');
                    if (BlankCheck.checkNotNullOrUndefined(devicePageCount.currentReadDate)) {
                        MeterReads.addField('updateDate', FormatterService.formatDateForPost(devicePageCount.currentReadDate));
                    }
                    $scope.meterReadList.push(color);
                }

                var deferredList = [];
                if ($scope.meterReadList && $scope.meterReadList.length > 0) {
                    for (var i=0;i<$scope.meterReadList.length;i++) {
                        MeterReads.item.postURL = $scope.meterReadList[i].postURL;
                        var deferred = MeterReads.put({
                            item:  $scope.meterReadList[i]
                        });
                        deferredList.push(deferred);
                    }
                }

                $q.all(deferredList).then(function(result) {
                    MeterReads.wasSaved = true;
                    $window.location.reload();
                }, function(reason){
                    NREUM.noticeError('Failed to create SR because: ' + reason);
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
            filterSearchService.addPanelFilter('FILTERS.FILTER_BY_METER_READ_TYPE', 'MeterReadTypeFilter', undefined,
                function(Grid) {
                    setTimeout(function() {
                        $scope.$broadcast('setupPrintAndExport', $scope);
                    }, 500);
                }
            );
        }
    ]);
});

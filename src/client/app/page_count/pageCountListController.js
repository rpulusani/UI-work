

angular.module('mps.pageCount')
.controller('PageCountListController', [
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
    '$http',
    '$translate',
	'PageCountHelper',
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
        $window,
        $http,
        $translate,
		pageCountHelper
        ) {
        $rootScope.currentRowList = [];
        PageCountService.setParamsToNull();
        var personal = new Personalize($location.url(),$rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(PageCountService, $scope, $rootScope, personal, 'defaultSet');
        $scope.print = true;
        $scope.export = true;
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
                Devices.item = Devices.item.item;
                $location.search('tab', 'pageCountTab');
                $location.path(Devices.route + '/' + devicePageCount.assetId + '/review');
            });
        };

        $scope.ignoreAndSave=function(){
            $scope.doSave();
        };
        $scope.doSave=function(){
            var color,
            ltpc,
            mono,
            devicePageCount=$scope.currentPageCountEdit;

            if (BlankCheck.checkNotNullOrUndefined(devicePageCount.ltpcMeterReadId) && BlankCheck.checkNotNullOrUndefined(devicePageCount.newLtpcCount)) {
                MeterReads.newMessage();
                ltpc = MeterReads.item;
                ltpc.postURL = devicePageCount._links.ltpcMeterRead.href;

                MeterReads.addField('id', devicePageCount.ltpcMeterReadId);
                MeterReads.addField('value', devicePageCount.newLtpcCount);
                MeterReads.addField('type', 'LTPC');

                if (BlankCheck.checkNotNullOrUndefined(devicePageCount.currentReadDate)) {
                    MeterReads.addField('updateDate', FormatterService.formatDateForPost(devicePageCount.currentReadDate));
                }
                
                
                    $http({
                    method: 'PUT',
                    url: devicePageCount._links.ltpcMeterRead.href,
                    data: ltpc
                }).then(function(pageCountResponse) {
                    MeterReads.wasSaved = true;
                    if ( pageCountResponse.data.type && pageCountResponse.data.type === 'LTPC'){
                         devicePageCount.ltpcValue=pageCountResponse.data.value; 
                         devicePageCount.lastReadDate=pageCountResponse.data.updateDate;                         
                         devicePageCount.currentReadDate = "";
                         devicePageCount.newLtpcCount = "";
                    }
                                      
                });
            }

            if (BlankCheck.checkNotNullOrUndefined(devicePageCount.colorMeterReadId) && BlankCheck.checkNotNullOrUndefined(devicePageCount.newColorCount)) {
                MeterReads.newMessage();

                color = MeterReads.item;
                color.postURL = devicePageCount._links.colorMeterRead.href;

                MeterReads.addField('id', devicePageCount.colorMeterReadId);
                MeterReads.addField('value', devicePageCount.newColorCount);
                MeterReads.addField('type', 'COLOR');

                if (BlankCheck.checkNotNullOrUndefined(devicePageCount.currentReadDate)) {
                    MeterReads.addField('updateDate', FormatterService.formatDateForPost(devicePageCount.currentReadDate));
                }

                    $http({
                    method: 'PUT',
                    url: devicePageCount._links.colorMeterRead.href,
                    data: color
                }).then(function(pageCountResponse) {
                    MeterReads.wasSaved = true;
                       if ( pageCountResponse.data.type && pageCountResponse.data.type === 'COLOR'){
                         devicePageCount.colorValue=pageCountResponse.data.value; 
                         devicePageCount.lastReadDate=pageCountResponse.data.updateDate;                       
                         devicePageCount.currentReadDate = "";
                         devicePageCount.newColorCount = "";
                       }
                });
            }
            
            if (BlankCheck.checkNotNullOrUndefined(devicePageCount.ltpcMeterReadId) && 
                BlankCheck.checkNotNullOrUndefined(devicePageCount.newLtpcCount) && 
                BlankCheck.checkNotNullOrUndefined(devicePageCount.colorMeterReadId) && 
                BlankCheck.checkNotNullOrUndefined(devicePageCount.newColorCount) &&
                BlankCheck.checkNotNullOrUndefined(devicePageCount.monoMeterReadId)) {
                MeterReads.newMessage();
                mono = MeterReads.item;
                mono.postURL = devicePageCount._links.monorMeterRead.href;

                MeterReads.addField('id', devicePageCount.monoMeterReadId);
                MeterReads.addField('value', devicePageCount.newLtpcCount-devicePageCount.newColorCount);
                MeterReads.addField('type', 'MONO');

                if (BlankCheck.checkNotNullOrUndefined(devicePageCount.currentReadDate)) {
                    MeterReads.addField('updateDate', FormatterService.formatLocalToUTC(new Date()));
                }
                
                
                    $http({
                    method: 'PUT',
                    url: devicePageCount._links.monorMeterRead.href,
                    data: mono
                }).then(function(pageCountResponse) {
                    MeterReads.wasSaved = true;
                    if ( pageCountResponse.data.type && pageCountResponse.data.type === 'MONO'){
                         devicePageCount.monoValue=pageCountResponse.data.value;
                    }
                                      
                });
            }
        };
        $scope.errorMessage='';
        $scope.popupMsg='';
        $scope.currentPageCountEdit;
        $scope.save = function(devicePageCount) {
                $scope.errorMessage='',
                $scope.popupMsg='';
                $scope.currentPageCountEdit=devicePageCount;
                    var pageCountParams={
                        newLTPC: BlankCheck.checkNotNullOrUndefined(devicePageCount.newLtpcCount)==true?devicePageCount.newLtpcCount:'',
                        oldLTPC: devicePageCount.ltpcValue,
                        newColor:BlankCheck.checkNotNullOrUndefined(devicePageCount.newColorCount)==true?devicePageCount.newColorCount:'',
                        oldColor:BlankCheck.checkNotNullOrUndefined(devicePageCount.colorValue)==true?devicePageCount.colorValue:'',
                        isColorCapable:BlankCheck.checkNotNullOrUndefined(devicePageCount.colorMeterReadId)==true?true:false
                    };
               
                    var result=pageCountHelper.validatePageCount(pageCountParams,$translate);
                    
                    
                    if (result.ltpc.status==='REJECTED'){
                        $scope.errorMessage+=result.ltpc.msg;
                        $scope.errorMessage+=result.ltpc.msgNotUpdate;
                        return;
                    }else if (pageCountParams.isColorCapable && result.color.status==='REJECTED'){
                        $scope.errorMessage+=result.color.msg;
                        $scope.errorMessage+=result.color.msgNotUpdate;  
                        return;
                    }else if (result.ltpc.status==='DEFERRED'){
                        $scope.popupMsg+=result.ltpc.msg;
                        $scope.popupMsg+=result.ltpc.msgNotUpdate;
                        createModal();
                        return;
                    }else if ( pageCountParams.isColorCapable && result.color.status==='DEFERRED'){
                        $scope.popupMsg+=result.color.msg;
                        $scope.popupMsg+=result.color.msgNotUpdate;
                        createModal();
                        return;
                    }else {
                        $scope.doSave();
                    }
                    
       

       
		function createModal(){
            var $ = require('jquery');
            $('#pageCounts-error-popup').modal({
                show: true,
                static: true
            });
        }
        
       
    };




        var removeParamsList = ['from', 'to', 'source', 'location', 'chlFilter'];
        filterSearchService.addPanelFilter('FILTERS.FILTER_BY_METER_READ_TYPE', 'MeterReadTypeFilter', undefined,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupPrintAndExport', $scope);
                }, 0);
            }
        );
        filterSearchService.addBasicFilter('DEVICE_MAN.DEVICE_PAGE_COUNTS.TXT_PAGE_COUNT_ALL_PAGE_COUNTS', {'embed': 'asset'}, removeParamsList,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupPrintAndExport', $scope);
                }, 500);
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


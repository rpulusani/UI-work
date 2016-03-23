

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
        $translate
        ) {
        $rootScope.currentRowList = [];
        PageCountService.setParamsToNull();
        var personal = new Personalize($location.url(),$rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(PageCountService, $scope, $rootScope, personal, 'defaultSet');
        $scope.print = false;
        $scope.export = false;
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


        
        $scope.errorMessage='';
        $scope.save = function(devicePageCount) {
                $scope.errorMessage='';
                var pageCountParams={
                    newLTPC: BlankCheck.checkNotNullOrUndefined(devicePageCount.newLtpcCount)==true?devicePageCount.newLtpcCount:'',
                    oldLTPC: devicePageCount.ltpcValue,
                    newColor:BlankCheck.checkNotNullOrUndefined(devicePageCount.newColorCount)==true?devicePageCount.newColorCount:'',
                    oldColor:BlankCheck.checkNotNullOrUndefined(devicePageCount.colorValue)==true?devicePageCount.colorValue:'',
                    isColorCapable:BlankCheck.checkNotNullOrUndefined(devicePageCount.colorMeterReadId)==true?true:false
                };
               
                var result=validatePageCount(pageCountParams);
                var isValid=true;
                
                if (!result.ltpc.status){
                    $scope.errorMessage+=result.ltpc.msg;                    
                    isValid=false;
                }

                if (pageCountParams.isColorCapable && !result.color.status){
                    $scope.errorMessage+=result.color.msg;                    
                    isValid=false;
                }
                
                if (!isValid){
                    $window.scrollTo(0, 0);
                    return;
                }
            
             var color,
            ltpc;

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
                }).then(function() {
                    if (!BlankCheck.checkNotNullOrUndefined(devicePageCount.colorMeterReadId) || !BlankCheck.checkNotNullOrUndefined(devicePageCount.newColorCount)) {
                            setTimeout(function() {
                                $scope.searchFunctionDef({'embed': 'asset'}, undefined);
                            }, 3000);
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
                }).then(function() {
                    MeterReads.wasSaved = true;
                        setTimeout(function() {
                            $scope.searchFunctionDef({'embed': 'asset'}, undefined);
                        }, 3000);
                });
            }
           
        function checkForColorCountDifference(pageCountParams){
            var diff=(pageCountParams.newColor - pageCountParams.oldColor),
            daysDiff=30,
            msgNotUpdate='',
            status='ACCEPTED',msgColor='';
            
            if (diff < 0){
                msgColor = $translate.instant('PAGE_COUNTS.ERROR.COLOR_READ_LESS');
                msgNotUpdate = $translate.instant('PAGE_COUNTS.ERROR.NOT_UPDATED');
                status = 'REJECTED';
            } else if ( diff > (pageCountParams.newLTPC - pageCountParams.oldLTPC)){
                msgColor = $translate.instant('PAGE_COUNTS.ERROR.COLOR_READ_DIFFERENCE');
                msgNotUpdate = $translate.instant('PAGE_COUNTS.ERROR.NOT_UPDATED');
                status = 'REJECTED';
            } else if (diff > 50000){
                msgColor = $translate.instant('PAGE_COUNTS.ERROR.UNREASONABLE_COLOR_READHIGH');
                msgNotUpdate = 'PAGE_COUNTS.ERROR.NOT_UPDATED_DEFERRED';
                status = 'DEFERRED';
            } else if (diff < 10){
                msgColor = $translate.instant('PAGE_COUNTS.ERROR.UNREASONABLE_COLOR_READLOW');
                msgNotUpdate = $translate.instant('PAGE_COUNTS.ERROR.NOT_UPDATED_DEFERRED');
                status = 'DEFERRED';
            } else if (diff > (daysDiff * 2000)){
                msgColor = $translate.instant('PAGE_COUNTS.ERROR.UNREASONABLE_COLOR_READHIGH');
                msgNotUpdate = $translate.instant('PAGE_COUNTS.ERROR.NOT_UPDATED_DEFERRED');
                status = 'DEFERRED';
            }
            
            return {
                msg:msgColor,
                msgNotUpdate:msgNotUpdate,
                status:status
                
            }
        }

        function checkForLTPCCountDifference(pageCountParams){
            var diff=(pageCountParams.newLTPC - pageCountParams.oldLTPC),
            daysDiff=30,
            msg='',msgNotUpdate='',status='ACCEPTED';
            if (diff < 0){
                msg = $translate.instant('PAGE_COUNTS.ERROR.LTPC_VALUE_LESS');
                msgNotUpdate = $translate.instant('PAGE_COUNTS.ERROR.NOT_UPDATED');
                status = 'REJECTED';
            } else if (diff > 50000){
                msg = $translate.instant('PAGE_COUNTS.ERROR.UNREASONABLE_LTPC_HIGH');
                msgNotUpdate = $translate.instant('PAGE_COUNTS.ERROR.NOT_UPDATED_DEFERRED');
                status = 'DEFERRED';
            } else if (diff < 10){
                msg = $translate.instant('PAGE_COUNTS.ERROR.UNREASONABLE_LTPC_LOW');
                msgNotUpdate = $translate.instant('PAGE_COUNTS.ERROR.NOT_UPDATED_DEFERRED');
                status = 'DEFERRED';
            } else if (diff > (daysDiff * 2000)){
                msg = $translate.instant('PAGE_COUNTS.ERROR.UNREASONABLE_LTPC_HIGH');
                msgNotUpdate = $translate.instant('PAGE_COUNTS.ERROR.NOT_UPDATED_DEFERRED');
                status = 'DEFERRED';
            }
                
            return {
                msg:msg,
                msgNotUpdate:msgNotUpdate,
                status:status
                    
            }
        }

        function validatePageCount(params){
            var result={
                ltpc:{
                    status:true
                },
                color:{
                    status:true
                }
            };

            if (!isDigit(params.newLTPC) || (params.isColorCapable && !isDigit(params.newColor))){
                    
                result.ltpc.msg=$translate.instant('PAGE_COUNTS.ERROR.VALID_PAGECOUNT');
                result.ltpc.status=false;
                result.color.msg='';
                result.color.status=false;
                return result;
            }
            var resultLTPC,
            resultColor;
            resultLTPC=checkForLTPCCountDifference(params);
            if (params.isColorCapable){
                resultColor=checkForColorCountDifference(params);
            }
                
            if (resultLTPC.status!=='ACCEPTED'){
                result.ltpc.msg=resultLTPC.msg + resultLTPC.msgNotUpdate;
                result.ltpc.status=false;
                   
            }
            if (resultLTPC.status==='ACCEPTED' && params.isColorCapable && resultColor.status !=='ACCEPTED'){
                result.color.msg=resultColor.msg + resultColor.msgNotUpdate;
                result.color.status=false;
            }
            return result; 
                
        }
        function isDigit(s){ 
            var patrn=/^[0-9]{1,20}$/; 
            if (!patrn.exec(s)) 
                return false; 
            return true; 
        } 
    };




        var removeParamsList = ['from', 'to', 'source', 'location', 'chlFilter'];
        filterSearchService.addBasicFilter('DEVICE_MAN.DEVICE_PAGE_COUNTS.TXT_PAGE_COUNT_ALL_PAGE_COUNTS', {'embed': 'asset'}, removeParamsList,
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


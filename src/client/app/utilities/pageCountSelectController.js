

angular.module('mps.utility')
.controller('PageCountSelectController', ['$scope', '$location', '$filter', '$routeParams', 'FormatterService',
        'BlankCheck', 'MeterReadService', 'Devices', 'MeterReadTypes',
        function($scope, $location, $filter, $routeParams, FormatterService, BlankCheck, MeterReads, Devices, MeterReadTypes) {
        $scope.showAllMeterReads = false;
        $scope.updateFlag = false;
        $scope.meterReads = [];
         $scope.getMeterReadPriorDate = function(item){
            if(item.updateDate){
                return FormatterService.formatDate(item.updateDate);
            }
            return FormatterService.formatDate(item.createDate);
        };
        $scope.getFormattedDate = function(item){
                if (BlankCheck.checkNotBlankNumberOrDate(item)) {
                    return FormatterService.formatLocalDate(item);
            }
        };

        if(BlankCheck.checkNotBlank($scope.source) && $scope.source!== 'add'
            && BlankCheck.checkNotNullOrUndefined($scope.module)) {
            console.log($scope.module);
            console.log(MeterReads);
            $scope.updateFlag = true;
            Devices.getAdditional($scope.module, MeterReads, false, true).then(function(){
                var tempData = [],
                    reorderedData = [];

                $scope.meterReads = MeterReads.data;
                $scope.showAllMeterReads = false;

                for (var i=0 ; i<= $scope.meterReads.length; i++) {
                    if($scope.meterReads[i] && $scope.meterReads[i].type){
                        $scope.meterReads[i].view = true;

                        switch($scope.meterReads[i].type){
                            case 'LTPC':
                                $scope.ltpc = $scope.meterReads[i];
                            break;
                            case 'COLOR':
                                $scope.color = $scope.meterReads[i];
                            break;
                            case 'MONO':
                                $scope.mono = $scope.meterReads[i];
                            break;
                            default:
                                tempData.push($scope.meterReads[i]);
                            break;
                        }
                        if ($scope.readonly && $scope.readonly === true) {
                            $scope.showAllMeterReads = true;
                                if((BlankCheck.checkNotBlankNumberOrDate($scope.module.newCount) 
                                    && BlankCheck.checkNotBlankNumberOrDate($scope.module.newCount[$scope.meterReads[i].type])) 
                                    || (BlankCheck.checkNotBlankNumberOrDate($scope.module.newDate) 
                                    && BlankCheck.checkNotBlankNumberOrDate($scope.module.newDate[$scope.meterReads[i].type]))) {
                                $scope.meterReads[i].view = true;
                            } else {
                                $scope.meterReads[i].view = false;
                            }
                        }
                    }
                }

                if($scope.mono){
                    reorderedData.push($scope.mono);
                }
                if($scope.color){
                    reorderedData.push($scope.color);
                }
                if($scope.ltpc){
                    reorderedData.push($scope.ltpc);
                }
                $scope.meterReads = reorderedData.concat(tempData);
            });
        } else {
                MeterReadTypes.get().then(function(){
                    if (MeterReadTypes.item && MeterReadTypes.item._embedded && MeterReadTypes.item._embedded.meterReadTypes &&
                        MeterReadTypes.item._embedded.meterReadTypes.length > 0) {
                        var meterReadsList = MeterReadTypes.item._embedded.meterReadTypes,
                        i = 0;
                        for (i; i < meterReadsList.length; i += 1) {
                            $scope.meterReads.push({
                                type: meterReadsList[i],
                                view: true
                            });
                        if ($scope.readonly && $scope.readonly === true) {
                            $scope.showAllMeterReads = true;
                                if((BlankCheck.checkNotBlankNumberOrDate($scope.module.newCount) 
                                    && BlankCheck.checkNotBlankNumberOrDate($scope.module.newCount[$scope.meterReads[i].type])) 
                                    || (BlankCheck.checkNotBlankNumberOrDate($scope.module.newDate) 
                                    && BlankCheck.checkNotBlankNumberOrDate($scope.module.newDate[$scope.meterReads[i].type]))) {
                                $scope.meterReads[i].view = true;
                            } else {
                                $scope.meterReads[i].view = false;
                            }
                        }
                    }
                }
            });
        }
    }
]);


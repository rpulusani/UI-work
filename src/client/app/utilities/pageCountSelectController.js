define(['angular', 'utility', 'utility.pageCountSelectService'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .controller('PageCountSelectController', ['$scope', '$location', '$filter', '$routeParams', 'FormatterService',
        'BlankCheck', 'MeterReadService', 'Devices', 'PageCountSelect',
        function($scope, $location, $filter, $routeParams, FormatterService, BlankCheck, MeterReads, Devices, PageCountSelect) {
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
                if (BlankCheck.checkNotBlank(item)) {
                    return FormatterService.formatDate(item);
                }
            };
            
            if(BlankCheck.checkNotBlank($scope.source) && $scope.source!== 'add' 
                && BlankCheck.checkNotNullOrUndefined($scope.module)) {
                $scope.updateFlag = true;
                Devices.getAdditional($scope.module, MeterReads).then(function(){
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
                                case 'Color':
                                    $scope.color = $scope.meterReads[i];
                                break;
                                case 'Mono':
                                    $scope.mono = $scope.meterReads[i];
                                break;
                                default:
                                    tempData.push($scope.meterReads[i]);
                                break;
                            }
                            if ($scope.readonly && $scope.readonly === true) {
                                $scope.showAllMeterReads = true;
                                if((BlankCheck.checkNotBlank($scope.module.newCount) 
                                    && BlankCheck.checkNotBlank($scope.module.newCount[$scope.meterReads[i].type])) 
                                    || (BlankCheck.checkNotBlank($scope.module.newDate) 
                                    && BlankCheck.checkNotBlank($scope.module.newDate[$scope.meterReads[i].type]))) {
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
                $scope.meterReads = PageCountSelect.pageCountTypes.query();
                $scope.meterReads.success(function() {
                    for (var i=0 ; i<= $scope.meterReads.length; i++) {
                        console.log('in loop', $scope.meterReads[i]);
                    }
                });
                for (var i=0 ; i<= $scope.meterReads.length; i++) {
                    console.log('in loop', $scope.meterReads[i]);
                    if($scope.meterReads[i] && $scope.meterReads[i].type){
                        $scope.meterReads[i].view = true;
                        if ($scope.readonly && $scope.readonly === true) {
                            $scope.showAllMeterReads = true;
                            if((BlankCheck.checkNotBlank($scope.module.newCount) 
                                && BlankCheck.checkNotBlank($scope.module.newCount[$scope.meterReads[i].type])) 
                                || (BlankCheck.checkNotBlank($scope.module.newDate) 
                                && BlankCheck.checkNotBlank($scope.module.newDate[$scope.meterReads[i].type]))) {
                                $scope.meterReads[i].view = true;
                            } else {
                                $scope.meterReads[i].view = false;
                            }
                        }
                    }
                } 
            }
        }
    ]);
});

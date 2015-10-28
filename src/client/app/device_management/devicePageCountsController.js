define([
    'angular',
    'deviceManagement',
    'deviceManagement.meterReadFactory',
    'deviceManagement.deviceFactory'
], function(angular) {
    'use strict';

    angular.module('mps.deviceManagement')
    .controller('DevicePageCountsController', [
        '$scope', '$rootScope', '$location', '$routeParams', 'Devices', 'MeterReadService',
        function($scope, $rootScope, $location, $routeParams, Devices, MeterReads) {
            $rootScope.currentAccount = '1-21AYVOT';
            $rootScope.currentRowList = [];

            $scope.getModifiedDate = function(item){
                if(item.updateDate){
                    return item.updateDate;
                }
                return item.createDate;
            };

            if (Devices.item !== null) {
                Devices.follow(MeterReads).then(function(){
                    $scope.meterReads = MeterReads;
                    $scope.meterReads.data = MeterReads.item._embeddedItems[MeterReads.embeddedName];
                    $scope.showAll = false;

                    var mono, color, lifetime,
                        tempData = [],
                        reorderedData = [],
                        limit = $scope.meterReads.data.length;

                    for(var i=0; i<limit; i++){
                        switch($scope.meterReads.data[i].type){
                            case 'Mono':
                                mono = $scope.meterReads.data[i];
                            break;
                            case 'Color':
                                color = $scope.meterReads.data[i];
                            break;
                            case 'LTPC':
                                lifetime = $scope.meterReads.data[i];
                            break;
                            default:
                                tempData.push($scope.meterReads.data[i]);
                        }
                    }

                    if(mono){
                        reorderedData.push(mono);
                    }
                    if(color){
                        reorderedData.push(color);
                    }
                    if(lifetime){
                        reorderedData.push(lifetime);
                    }

                    $scope.meterReads.data = reorderedData.concat(tempData);
                }, function(reason){
                    NREUM.noticeError(MeterReads.serviceName +  ' failure: ' + reason);
                });
            }
        }
    ]);
});

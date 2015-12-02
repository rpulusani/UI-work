define(['angular', 'deviceManagement', 'utility.blankCheckUtility', 'deviceManagement.deviceFactory', 'utility.imageService', 'utility.grid', 'serviceRequest'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceInformationController', ['$scope', '$location', '$routeParams', 'BlankCheck', 'Devices', 'imageService',
        'DeviceServiceRequest','FormatterService', 'MeterReadService', 'grid', 'ServiceRequestService',
        function($scope, $location, $routeParams, BlankCheck, Devices, ImageService, DeviceServiceRequest, FormatterService, MeterReads, Grid, ServiceRequest) {
            var redirect_to_list = function() {
               $location.path(Devices.route + '/');
            };

            $scope.getMeterReadPriorDate = function(item){
                if(item.updateDate){
                    return item.updateDate;
                }
                return item.createDate;
            };

            $scope.saveMeterReads = function() {
                var limit, i;

                if($scope.meterReads){
                    limit = $scope.meterReads.length;

                    for(i=0; i<limit; i+=1){
                        if($scope.meterReads[i].type !== 'Mono' && ($scope.meterReads[i].newVal || $scope.meterReads[i].newDate)){
                            if($scope.meterReads[i].newVal && $scope.meterReads[i].newVal !== $scope.meterReads[i].value){
                                $scope.meterReads[i].value = $scope.meterReads[i].newVal;
                                $scope.meterReads[i].newVal = null;
                            }

                            if($scope.meterReads[i].newDate && $scope.meterReads[i].newDate !== $scope.getMeterReadPriorDate($scope.meterReads[i])){
                                $scope.meterReads[i].updateDate = $scope.meterReads[i].newDate;
                                $scope.meterReads[i].newDate = null;
                            }

                            MeterReads.update($scope.meterReads[i]).then(function(){
                                console.log("Updated Meter Read " + $scope.meterReads[i].id);
                            }, function(reason){
                                NREUM.noticeError('Failed to update Meter Read ' + $scope.meterReads[i].id +  ' because: ' + reason);
                            });
                        }
                    }
                }

            };

            if (Devices.item === null) {
                redirect_to_list();
            } else {
                $scope.device = Devices.item;
                Devices.getAdditional(Devices, MeterReads).then(function(){
                    var tempData = [],
                        reorderedData = [];

                    $scope.meterReads = MeterReads.data;
                    $scope.showAllMeterReads = false;

                    for (i=0 ; i<= $scope.meterReads.length; i++) {
                        if($scope.meterReads[i] && $scope.meterReads[i].type){
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

                var image = new ImageService();
                image.getPartMediumImageUrl($scope.device.partNumber).then(function(url){
                    console.log("image url is " + url);
                    $scope.medImage = url;
                }, function(reason){
                     NREUM.noticeError('Image url was not found reason: ' + reason);
                  });
                
                });

                if (!BlankCheck.isNull($scope.device._embeddedItems)) {
                    $scope.installAddress = $scope.device._embeddedItems['address'];
                    $scope.primaryContact = $scope.device._embeddedItems['primaryContact'];
                }
                
            }

            if($scope.device !== null && $scope.device !== undefined){
                 $scope.device.installDate = new Date($scope.device.installDate);
            }
            if($scope.installAddress !== null && $scope.installAddress !== undefined){
                $scope.formattedAddress = FormatterService.formatAddress($scope.installAddress);
            }
            if($scope.primaryContact !== null && $scope.primaryContact !== undefined){
                    $scope.primaryContact.formattedName = FormatterService.getFullName($scope.primaryContact.firstName,
                        $scope.primaryContact.lastName, $scope.primaryContact.middleName);
                    $scope.primaryContact.formattedworkPhone =
                         FormatterService.getPhoneFormat($scope.primaryContact.workPhone);
            }

            $scope.goToUpdate = function(device) {
                $location.path(DeviceServiceRequest.route + "/" + device.id + '/update');
            };

            $scope.btnRequestService = function(device) {
                $location.path(DeviceServiceRequest.route + "/" + device.id + '/view');
            };

            $scope.btnDecommissionDevice = function(device) {
                $location.path(DeviceServiceRequest.route + "/decommission/" + device.id + "/view");
            };

            $scope.gridOptions = {};
             ServiceRequest.getPage().then(function() {
                Grid.display(ServiceRequest, $scope);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + ServiceRequest.serviceName +  ' reason: ' + reason);
            });
        }
    ]);
});

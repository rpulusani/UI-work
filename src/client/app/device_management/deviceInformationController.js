define(['angular', 'deviceManagement', 'utility.blankCheckUtility', 'deviceManagement.deviceFactory', 'utility.imageService', 'utility.grid', 'serviceRequest'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceInformationController', [
        '$rootScope',
        '$scope',
        '$location',
        '$routeParams',
        'BlankCheck',
        'Devices',
        'imageService',
        'DeviceServiceRequest',
        'FormatterService',
        'MeterReadService',
        'grid',
        'ServiceRequestService',
        'SecurityHelper',
        function(
            $rootScope,
            $scope,
            $location,
            $routeParams,
            BlankCheck,
            Devices,
            ImageService,
            DeviceServiceRequest,
            FormatterService,
            MeterReads,
            Grid,
            ServiceRequest,
            SecurityHelper
            ) {

            new SecurityHelper($rootScope).redirectCheck($rootScope.deviceAccess);

            var redirect_to_list = function() {
               $location.path(Devices.route + '/');
            };

            $scope.getMeterReadPriorDate = function(item){
                if(item.updateDate){
                    return FormatterService.formatDate(item.updateDate);
                }
                return FormatterService.formatDate(item.createDate);
            };

            $scope.saveMeterReads = function() {
            /*
            desc:   Loops through all meter reads and submits put requests
                    for all that were updated (bulk update)
            */
                var limit, i;

                if($scope.meterReads){
                    limit = $scope.meterReads.length;

                    for(i=0; i<limit; i+=1){
                        // ignore Mono reads since they can't be updated
                        // ignore reads that weren't updated
                        if($scope.meterReads[i].type !== 'Mono' && ($scope.meterReads[i].newVal || $scope.meterReads[i].newDate)){
                            // if a new value was added
                            if($scope.meterReads[i].newVal && $scope.meterReads[i].newVal !== $scope.meterReads[i].value){
                                $scope.meterReads[i].value = $scope.meterReads[i].newVal;
                                $scope.meterReads[i].newVal = null;
                            }

                            // if a new date was added
                            if($scope.meterReads[i].newDate && $scope.meterReads[i].newDate !== $scope.getMeterReadPriorDate($scope.meterReads[i])){
                                $scope.meterReads[i].updateDate = $scope.meterReads[i].newDate;
                                $scope.meterReads[i].newDate = null;
                            }

                            // init MeterReads.item
                            MeterReads.newMessage();

                            // set item props
                            for(var key in $scope.meterReads[i]){
                                // always check to make sure the prop belongs directly to the object
                                if($scope.meterReads[i].hasOwnProperty(key)){
                                    // ignore unneeded props
                                    if(key != "newVal" || key != "newDate"){
                                        MeterReads.addField(key, $scope.meterReads[i][key]);
                                    }
                                }
                            }

                            // reset the postURL
                            MeterReads.addField("postURL", $scope.meterReads[i]._links.self.href);

                            // submit the request
                            MeterReads.put(MeterReads).then(function(){
                                MeterReads.reset();
                            }, function(reason){
                                NREUM.noticeError('Failed to update Meter Read ' + MeterReads.item["id"] +  ' because: ' + reason);
                            });
                        }
                    }
                }

            };

            if (Devices.item === null) {
                redirect_to_list();
            } else {
                $scope.device = Devices.item;
                Devices.getAdditional(Devices.item, MeterReads).then(function(){
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

                var image =  ImageService;
                image.getPartMediumImageUrl($scope.device.partNumber).then(function(url){
                    $scope.medImage = url;
                }, function(reason){
                     NREUM.noticeError('Image url was not found reason: ' + reason);
                  });

                });

                if (!BlankCheck.isNull($scope.device['address'])) {
                    $scope.installAddress = $scope.device.item['address']['item'];
                }
                if (!BlankCheck.isNull($scope.device['contact'])) {
                    $scope.primaryContact = $scope.device.item['contact']['item'];
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
                ServiceRequest.reset();
                $location.path(DeviceServiceRequest.route + "/" + device.id + '/update');
            };

            $scope.btnRequestService = function(device) {
                ServiceRequest.reset();
                $location.path(DeviceServiceRequest.route + "/" + device.id + '/view');
            };

            $scope.btnDecommissionDevice = function(device) {
                ServiceRequest.reset();
                $location.path(DeviceServiceRequest.route + "/decommission/" + device.id + "/view");
            };

            $scope.gridOptions = {};
            var options =  {
                params:{
                    type: 'MADC_ALL'
                }
            };
            ServiceRequest.reset();
            ServiceRequest.getPage(0, 20, options).then(function() {
                ServiceRequest.columns = 'madcSet';
                Grid.display(ServiceRequest, $scope);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + ServiceRequest.serviceName +  ' reason: ' + reason);
            });
        }
    ]);
});

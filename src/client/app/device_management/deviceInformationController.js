
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
    'PersonalizationServiceFactory',
    'ServiceRequestService',
    'SecurityHelper',
    'FilterSearchService',
    'lbsURL',
    '$window',
        'uiGridExporterConstants',
        '$translate',
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
        Personalize,
        ServiceRequest,
        SecurityHelper,
        FilterSearchService,
        lbsURL,
            $window,
            uiGridExporterConstants,
            $translate
        ) {
        ServiceRequest.setParamsToNull();
        new SecurityHelper($rootScope).redirectCheck($rootScope.deviceAccess);

        var redirect_to_list = function() {
           $location.path(Devices.route + '/');
        };

        var personal = new Personalize($location.url(),$rootScope.idpUser.id);
        $scope.gotToLBS = function(){
             $window.open(lbsURL + "?sno=" + $scope.device.serialNumber);
        };

        $scope.configure = {
            devicePicker: {
                singleDeviceSelection: true,
                readMoreUrl: '',
                translate: {
                    replaceDeviceTitle: 'SERVICE_REQUEST.SERVICE_REQUEST_PICKER_SELECTED',
                    h1: 'SERVICE_REQUEST.SERVICE_REQUEST_DEVICE',
                        body: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_REVIEW_SUPPLIES_PAR',
                    readMore: '',
                    confirmation:{
                            abandon:'ORDER_MAN.SUPPLY_ORDER_REVIEW.BTN_ORDER_ABANDON_SUPPLIES',
                            submit: 'DEVICE_MAN.COMMON.BTN_ORDER_SUPPLIES'
                    }
                }
            }
        };

        $scope.view = function(SR){
          ServiceRequest.setItem(SR);
            var options = {
                params:{
                    embed:'primaryContact,requester,address,account,asset,sourceAddress'
                }
            };
            ServiceRequest.item.get(options).then(function(){
                $location.path(ServiceRequest.route + '/' + SR.id + '/receipt');
            });

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
                    if($scope.meterReads[i].type !== 'MONO' && ($scope.meterReads[i].newVal || $scope.meterReads[i].newDate)){
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

                    for (var i=0 ; i<= $scope.meterReads.length; i++) {
                    if($scope.meterReads[i] && $scope.meterReads[i].type){
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
                $scope.installAddress = $scope.device['address']['item'];
            }
            if (!BlankCheck.isNull($scope.device['contact'])) {
                $scope.primaryContact = $scope.device['contact']['item'];
            }

                if ($scope.device !== null && $scope.device !== undefined && $scope.device.installDate !== undefined){
                    $scope.device.installDate = FormatterService.formatDate($scope.device.installDate);
                }
                if ($scope.installAddress !== null && $scope.installAddress !== undefined){
                    $scope.formattedAddress = FormatterService.formatAddress($scope.installAddress);
                }
                if ($scope.primaryContact !== null && $scope.primaryContact !== undefined){
                        $scope.formattedContactAddress = "";
                        $scope.primaryContact.formattedName = FormatterService.getFullName($scope.primaryContact.firstName,
                            $scope.primaryContact.lastName, $scope.primaryContact.middleName);
                        $scope.primaryContact.formattedworkPhone =
                             FormatterService.getPhoneFormat($scope.primaryContact.workPhone);
                        if ($scope.primaryContact.address !== null && $scope.primaryContact.address !== undefined) {
                            $scope.formattedContactAddress = FormatterService.formatAddress($scope.primaryContact.address);
                        }
                }

            }



        $scope.goToUpdate = function(device) {
            ServiceRequest.reset();
            $location.path(DeviceServiceRequest.route + "/" + device.id + '/update');
        };

        $scope.btnRequestService = function(device) {
            ServiceRequest.reset();
            $location.path(DeviceServiceRequest.route + "/" + device.id + '/view').search('tab', null);
        };

        $scope.btnDecommissionDevice = function(device) {
            ServiceRequest.reset();
            $location.path(DeviceServiceRequest.route + "/decommission/" + device.id + "/view");
        };

            $scope.exportDevice = function (filename, rows) {
                var filename = $scope.device.productModel,
                rows = [
                    $scope.device.productModel,
                    $scope.device.serialNumber,
                    $scope.device.assetTag,
                    $scope.device.ipAddress,
                    $scope.device.hostname,
                    $scope.device.costCenter,
                    $scope.device.installDate,
                    $scope.device.contact.item.formattedName,
                    $scope.device.contact.item.email,
                    $scope.device.contact.item.workPhone,
                    $scope.device.contact.item.formattedName,
                    $scope.device.contact.item.address.addressLine1
                ],
                csvFile = '',
                blob,
                url,
                link,
                i = 0,
                // l10n coming
                headers = [
                    $translate.instant('DEVICE_MAN.MANAGE_DEVICE.TXT_PRODUCT_MODEL'),
                    $translate.instant('DEVICE_MAN.MANAGE_DEVICE.TXT_SERIAL_NUMBER'),
                    $translate.instant('DEVICE_MAN.COMMON.TXT_DEVICE_TAG'),
                    $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_IP_ADDR'),
                    $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_HOSTNAME'),
                    $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_DEVICE_COST_CENTER'),
                    $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_INSTALL_DATE'),
                    $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_CONTACT_NAME'),
                    $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_CONTACT_EMAIL'),
                    $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_CONTACT_PHONE'),
                    $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_CONTACT_ADDRESS'),
                    $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_INSTALL_ADDRESS'),
                    $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_ORG_STRUCTURE'),
                    $translate.instant('DEVICE_MAN.COMMON.TXT_PAGE_COUNT_LIFETIME'),
                    $translate.instant('DEVICE_MAN.DEVICE_PAGE_COUNTS.TXT_PAGE_COUNT_COLOR'),
                    $translate.instant('DEVICE_MGT.LAST_UPDATED'),
                ];
                
                csvFile = headers.toString();
                csvFile += '\r\n';

                for (i = 0; i < rows.length; i += 1) {
                    if (i !== rows.length - 1) {
                        csvFile += '"' + rows[i] + '",';
                    } else if (i = rows.length - 1) {
                         csvFile += '"' + rows[i] + '"';
                    }
                }
                
                blob = new Blob([csvFile], {type: 'text/csv;charset=utf-8;'});
                
                if (navigator.msSaveBlob) {
                    navigator.msSaveBlob(blob, filename);
                } else {
                    link = document.createElement('a');

                    if (link.download !== undefined) {
                        url = URL.createObjectURL(blob);
                        
                        link.setAttribute('href', url);
                        link.setAttribute('download', filename);
                        link.style.visibility = 'hidden';
                        
                        document.body.appendChild(link);
                        
                        link.click();
                        
                        document.body.removeChild(link);
                    }
                }
            };

        function madcGrid(){
                ServiceRequest.setParamsToNull();
                ServiceRequest.data = [];
                var filterSearchService = new FilterSearchService(ServiceRequest, $scope, $rootScope, personal, 'madcSet');
            var params =  {
                type: 'MADC_ALL'
            };

                filterSearchService.addBasicFilter('DEVICE_MAN.MANAGE_DEVICE_OVERvIEW.TXT_CHANGE_HISTORY', params, false, function() {
                $scope.$broadcast('setupPrintAndExport', $scope);
            });
        }

        madcGrid();
    }
]);

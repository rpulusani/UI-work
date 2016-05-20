
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
    '$filter',
    'PageCountHelper',
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
        $translate,
        $filter,
        pageCountHelper
        ) {

        var generateCsvRows = function() {
            var rows = [];

            if ($scope.device.productModel) {
                rows.push($scope.device.productModel);
            } else {
                rows.push('none');
            }
           
            if ($scope.device.serialNumber) {
                rows.push($scope.device.serialNumber);
            } else {
                rows.push('none');
            }

            if ($scope.device.assetTag) {
                rows.push($scope.device.assetTag);
            } else {
                rows.push('none');
            }

            if ($scope.device.ipAddress) {
                rows.push($scope.device.ipAddress);
            } else {
                rows.push('none');
            }

            if ($scope.device.hostname) {
                rows.push($scope.device.hostname);
            } else {
                rows.push('none');
            }

            if ($scope.device.costCenter) {
                rows.push($scope.device.costCenter);
            } else {
                rows.push('none');
            }

            if ($scope.formattedAddress) {
                rows.push($scope.formattedAddress.replace(/<br\/>/g, ', '));
            } else {
                rows.push('none');
            }

            if ($scope.device.installDate) {
                rows.push($scope.device.installDate);
            } else {
                rows.push('none');
            }

            if ($scope.device.contact && $scope.device.contact.item) {
                if ($scope.device.contact.item.formattedName) {
                    rows.push($scope.device.contact.item.formattedName);
                } else {
                    rows.push('none');
                }

                if ($scope.formattedContactAddress) {
                    rows.push($scope.formattedContactAddress);
                } else {
                    rows.push('none');
                }

                if ($scope.device.contact.item.email && $scope.device.contact.item.email !== ' ') {
                    rows.push($scope.device.contact.item.email);
                } else {
                    rows.push('none');
                }

                if ($scope.device.contact.item.workPhone) {
                    rows.push($scope.device.contact.item.formattedworkPhone);
                } else {
                    rows.push('none');
                }

                if ($scope.device.chl && $scope.device.chl.item) {
                    rows.push($scope.device.chl.item.name);
                } else {
                    rows.push('none');
                }

                if ($scope.ltpc) {
                    rows.push($scope.ltpc.value);
                } else {
                    rows.push('none');
                }

                if ($scope.mono && $scope.mono.value) {
                    rows.push($scope.mono.value);
                } else {
                    rows.push('none');
                }

                if ($scope.color && $scope.color.value) {
                    rows.push($scope.color.value);
                } else {
                    rows.push('none');
                }

                if ($scope.device.lastUpdated) {
                    rows.push($scope.device.lastUpdated);
                } else {
                    rows.push('none');
                }
            }

            return rows;
        },
        setCsvDefinition = function() {
            var headers = [
                $translate.instant('DEVICE_MAN.MANAGE_DEVICE.TXT_PRODUCT_MODEL'),
                $translate.instant('DEVICE_MAN.MANAGE_DEVICE.TXT_SERIAL_NUMBER'),
                $translate.instant('DEVICE_MAN.COMMON.TXT_DEVICE_TAG'),
                $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_IP_ADDR'),
                $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_HOSTNAME'),
                $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_DEVICE_COST_CENTER'),
                $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_INSTALL_ADDRESS'),
                $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_INSTALL_DATE'),
                $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_CONTACT_NAME'),
                $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_CONTACT_ADDRESS'),
                $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_CONTACT_EMAIL'),
                $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_CONTACT_PHONE'),
                $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_ORG_STRUCTURE'),
                $translate.instant('DEVICE_MAN.COMMON.TXT_PAGE_COUNT_LIFETIME'),
                $translate.instant('DEVICE_MAN.COMMON.TXT_PAGE_COUNT_MONO'),
                $translate.instant('DEVICE_MAN.DEVICE_PAGE_COUNTS.TXT_PAGE_COUNT_COLOR'),
                $translate.instant('DEVICE_MAN.COMMON.TXT_LAST_UPDATED')
            ],
            rows = generateCsvRows();

            $scope.csvModel = {
                filename: $scope.device.productModel,
                data: $scope.device,
                headers: headers,
                // rows are just property names found on the dataObj
                rows: rows
            };

            $scope.pdfModel = {
              content: [
                {
                  table: {
                    headerRows: 1,
                    body: [
                      headers,
                      rows
                    ]
                  }
                }
              ]
            };
        };

        ServiceRequest.setParamsToNull();
        new SecurityHelper($rootScope).redirectCheck($rootScope.deviceAccess);

        $scope.ipLink = '';
        $scope.max=FormatterService.formatDateForRome(new Date());//This is used in date Picker..
        $scope.breadcrumbs = {
            1: {
                href: "/device_management",
                value: "DEVICE_MAN.MANAGE_DEVICES.TXT_MANAGE_DEVICES"
            },
            2: {
                value: Devices.item.productModel
            }
        };

        var redirect_to_list = function() {
           $location.path(Devices.route + '/');
        };

        var personal = new Personalize($location.url(),$rootScope.idpUser.id);
        $scope.gotToLBS = function(){
             $window.open(lbsURL + "?sno=" + $scope.device.serialNumber);
        };

        $scope.goToIpControl = function(){
            $window.open($scope.ipLink);
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
        $scope.minDate = function(item){
        	if(item.updateDate){
                return item.updateDate;
            }
            return item.createDate;
        };
        
        $scope.saveMeterReads = function() {
        /*
        desc:   Loops through all meter reads and submits put requests
                for all that were updated (bulk update)
        */
            var limit, i;
            $scope.errorMessage='';
            if($scope.meterReads){
                limit = $scope.meterReads.length;
                var indColor=-1,indLTPC=-1,indMono=-1;
                for(i=0; i<limit; i+=1){
                    // ignore Mono reads since they can't be updated
                    // ignore reads that weren't updated

                     if ($scope.meterReads[i].type === 'MONO'){
                        indMono=i;
                     }else if ($scope.meterReads[i].type === 'COLOR'){
                        indColor=i;
                     }else if ($scope.meterReads[i].type === 'LTPC'){
                        indLTPC=i;
                     }

                    if ($scope.meterReads[i].newVal || $scope.meterReads[i].newDate){
                        // if a new value was added
                        if ($scope.meterReads[i].newVal 
                            && $scope.meterReads[i].newVal !== $scope.meterReads[i].value
                            && pageCountHelper.isDigitPageCount($scope.meterReads[i].newVal)
                            && $scope.meterReads[i].newVal > $scope.meterReads[i].value){
                            $scope.meterReads[i].value = $scope.meterReads[i].newVal;
                            $scope.meterReads[i].newVal = null;
                        }else{
                            $scope.errorMessage=$translate.instant('PAGE_COUNTS.ERROR.VALID_PAGECOUNT');
                            return;
                        }

                     
                        // if a new date was added
                        if($scope.meterReads[i].newDate && $scope.meterReads[i].newDate !== null ) {
                            $scope.meterReads[i].updateDate = FormatterService.formatLocalDateForPost($scope.meterReads[i].newDate);
                            $scope.meterReads[i].newDate = null;
                        } 

                        updateMeterReads($scope.meterReads[i]);
                    }
                    
                }

               
                //Mono Calc goes here
                if (indLTPC !== -1 && indColor !== -1 
                    && indMono !== -1 && ($scope.meterReads[indLTPC].value > $scope.meterReads[indColor].value)) {
                    $scope.meterReads[indMono].value = ($scope.meterReads[indLTPC].value - $scope.meterReads[indColor].value); 
                    $scope.meterReads[indMono].updateDate = FormatterService.formatLocalDateForPost(new Date());                   
                    updateMeterReads($scope.meterReads[indMono]);
                }  
                
            }

        };

        function updateMeterReads(meterRead){
            // init MeterReads.item
            MeterReads.newMessage();
            MeterReads.addField('id', meterRead.id);
            MeterReads.addField('value', meterRead.value);
            MeterReads.addField('type', meterRead.type);
            MeterReads.addField('updateDate', meterRead.updateDate);
            // reset the postURL
            MeterReads.addField("postURL", meterRead._links.self.href);
            // submit the request
            MeterReads.put(MeterReads).then(function(){
                MeterReads.reset();
            }, function(reason){
                NREUM.noticeError('Failed to update Meter Read ' + MeterReads.item["id"] +  ' because: ' + reason);
            });
        }

        function setupPhysicalLocations(address, building, floor, office) {
            address.building = building;
            address.floor = floor;
            address.office = office;
        }

        if (Devices.item === null) {
            redirect_to_list();
        } else {
            $scope.device = Devices.item;

            if (!BlankCheck.isNull($scope.device.hostName)) {
                $scope.ipLink = 'http://' + $scope.device.hostName;
            } else if (!BlankCheck.isNull($scope.device.ipAddress)) {
                $scope.ipLink = 'http://' + $scope.device.ipAddress;
            }
            Devices.getAdditional(Devices.item, MeterReads, false, true).then(function(){
                var tempData = [],
                    reorderedData = [],
                    meterDate,
                    tempLastUpdate;

                $scope.meterReads = MeterReads.data;
                $scope.showAllMeterReads = false;
                $scope.lastUpdated=null;
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
                    if ($scope.meterReads[i] && BlankCheck.checkNotBlank($scope.meterReads[i].lastUpdateDate)){
                        meterDate = FormatterService.getDateFromString($scope.meterReads[i].lastUpdateDate);
                           if ($scope.lastUpdated === null){
                                $scope.lastUpdated = $scope.meterReads[i].lastUpdateDate;
                           } else if (meterDate.getTime() > tempLastUpdate.getTime()){
                                $scope.lastUpdated = $scope.meterReads[i].lastUpdateDate;
                           }
                        tempLastUpdate = FormatterService.getDateFromString($scope.lastUpdated);
                    }
                }
                if ($scope.lastUpdated !== null){
                    $scope.lastUpdated = FormatterService.formatDate($scope.lastUpdated);
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
                
                setCsvDefinition();

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
            if (!BlankCheck.isNull($scope.device['chl'])) {
                $scope.chl = $scope.device['chl']['item'];
            }

                if ($scope.device !== null && $scope.device !== undefined && $scope.device.installDate !== undefined){
                    $scope.device.installDate = FormatterService.formatDate($scope.device.installDate);
                }
                if ($scope.installAddress !== null && $scope.installAddress !== undefined){
                    setupPhysicalLocations($scope.installAddress,
                        $scope.device.physicalLocation1,
                        $scope.device.physicalLocation2,
                        $scope.device.physicalLocation3
                    );
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
        
        $scope.goTocreateMove = function(device){
        	 Devices.setItem(device);
        	 var options = {
                     params:{
                         embed:'contact,address'
                     }
                 };
             Devices.item.get(options).then(function(){
                 $location.path('/service_requests/devices/' + device.id + '/update');
             });
        };
        
        $scope.goToorderSameDevice = function(device){
        	Devices.item = {};
            $location.path('/orders/catalog/hardware');
        };
        
        $scope.goToSupplies = function(device){
        	Devices.setItem(device);
            var options = {
                params:{
                    embed:'contact,address'
                }
            };

            Devices.item.get(options).then(function(){
                $location.search('tab', 'orderTab');
                $rootScope.currentDeviceTab = 'orderTab';
                $location.path(Devices.route + '/' + device.id + '/review');
            });
        };
        
        function madcGrid(){
                var madcServiceRequest = angular.copy(ServiceRequest);
                madcServiceRequest.setParamsToNull();
                madcServiceRequest.data = [];
                var filterSearchService = new FilterSearchService(madcServiceRequest, $scope, $rootScope, personal, 'madcSet');
            var params =  {
                type: ['MADC_ALL', 'DATA_ASSET_ALL'],
                assetId: Devices.item.id
            };

            filterSearchService.addBasicFilter('DEVICE_MAN.MANAGE_DEVICE_OVERvIEW.TXT_CHANGE_HISTORY', params, false, function() {
                $scope.$broadcast('setupPrintAndExport', $scope);
            });
        }

        if ($rootScope.serviceRequestMADCAccess) {
            setCsvDefinition();
            madcGrid();
        } else {
            setCsvDefinition();
            $scope.$broadcast('setupPrintAndExport', $scope);
        }
    }
]);


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

        
        if(!Devices.item){
                
            $location.path('/device_management');
            return;
        }

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
            rows = generateCsvRows(),
            i = 0;

            $scope.csvModel = {
                filename: $scope.device.productModel,
                data: $scope.device,
                headers: headers,
                // rows are just property names found on the dataObj
                rows: rows
            };

            var pdfHeaders1 = [],
            pdfRows1 = [],
            pdfHeaders2 = [],
            pdfRows2 = [];
            var pdfFirstHeaderColumnsCnt = 11;
            var totalColumnsCnt = headers.length;
            if(totalColumnsCnt <= pdfFirstHeaderColumnsCnt) {
                pdfFirstHeaderColumnsCnt = totalColumnsCnt;
            }            

            for (i; i < pdfFirstHeaderColumnsCnt; i += 1) {
               pdfHeaders1.push({text: headers[i], fontSize: 8});
            }

            i = 0;
            for (i; i < pdfFirstHeaderColumnsCnt; i += 1) {
               pdfRows1.push({text: rows[i], fontSize: 8});
            }

            if(totalColumnsCnt > pdfFirstHeaderColumnsCnt) {
                i = pdfFirstHeaderColumnsCnt;
                for (i; i < totalColumnsCnt; i += 1) {
                   pdfHeaders2.push({text: headers[i], fontSize: 8});
                }

                i = pdfFirstHeaderColumnsCnt;
                for (i; i < totalColumnsCnt; i += 1) {
                   pdfRows2.push({text: rows[i], fontSize: 8});
                }
            }            

            $scope.pdfModel = {
              content: [
                {
                  table: {
                    headerRows: 1,
                    body: [
                      pdfHeaders1,
                      pdfRows1
                    ]
                  }
                },
                {
                  table: {
                    headerRows: 1,
                    body: [
                      pdfHeaders2,
                      pdfRows2
                    ]
                  }
                }
              ]
            };
        };

        ServiceRequest.setParamsToNull();
        new SecurityHelper($rootScope).redirectCheck($rootScope.deviceAccess);

        $scope.ipLink = '';
        $scope.max=FormatterService.formatLocalDateForRome(new Date());//This is used in date Picker..
        $scope.breadcrumbs = {
            1: {
                href: "/device_management",
                value: "DEVICE_MAN.MANAGE_DEVICES.TXT_MANAGE_DEVICES"
            },
            2: {
                value: Devices.item.serialNumber
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
                return FormatterService.formatUTCToLocal(item.updateDate);
            }
            return FormatterService.formatUTCToLocal(item.createDate);
        };

        $scope.bookmark = function(item) {
            var node = angular.element(document.getElementsByClassName('favorite'));
            Devices.setItem(item);

            if (item.bookmarked === false) {
                Devices.item.links.bookmark({method: 'post'}).then(function() {
                    node.toggleClass('icon--not-favorite');
                    node.toggleClass('icon--favorite');
                });
            } else {
                Devices.item.links.bookmark({method: 'delete'}).then(function() {
                    node.toggleClass('icon--not-favorite');
                    node.toggleClass('icon--favorite');
                });
            }
        };

        function createModal(){
            var $ = require('jquery');
            $('#pageCounts-error-popup').modal({
                show: true,
                static: true
            });
        }
        
        $scope.saveMeterReads = function() {
        /*
        desc:   Loops through all meter reads and submits put requests
                for all that were updated (bulk update)
        */
            var limit, i;
            $scope.errorMessage='';
            $scope.warnMessage='';
            if($scope.meterReads){
                limit = $scope.meterReads.length;
                var indColor=-1,indLTPC=-1,indMono=-1;
                var meterReadType = "";
                var colorMeterRead = null;
                var ltpcMeterRead = null;
                var otherColorMeterRead = null;
                var otherLtpcMeterRead = null;
                var ltpcMeterReadNameParts = [];
                var colorMeterReadNameParts = [];
                var mrNamePrefix = "";
                var errorMessage = [];
                var oldDate = null;
                var meterReadCnt = 0;
                var totalMRCount = $scope.meterReads.length;
                for(i=0; i<limit; i+=1){
                    // ignore Mono reads since they can't be updated
                    // ignore reads that weren't updated
                     errorMessage[i]='';
                     
                     if ($scope.meterReads[i].type === 'MONO'){
                        indMono=i;
                     }else if ($scope.meterReads[i].type === 'COLOR'){
                        indColor=i;
                     }else if ($scope.meterReads[i].type === 'LTPC'){
                        indLTPC=i;
                     }

                    meterReadType = $scope.meterReads[i].type.toLowerCase();
                    meterRead = $scope.meterReads[i];
                    
                    if(meterReadType === 'ltpc') {
                        ltpcMeterRead = meterRead;
                    }
                    else if(meterReadType.indexOf('ltpc') >= 0) {
                        otherLtpcMeterRead = meterRead;
                        ltpcMeterReadNameParts = meterReadType.split("_");                                            
                    }
                    
                    if ($scope.meterReads[i].newVal || $scope.meterReads[i].newDate){                        
                                                
                        if(meterReadType === 'color' || meterReadType === 'ltpc') {
                            errorMessage[i] = validateCommonLtpcColorMR(meterRead.value, meterRead.newVal, $scope.meterReads[i].type);                            

                            if(errorMessage[i].length > 0) {
                                $scope.errorMessage = errorMessage[i];
                                return;                         
                            }

                            if(meterReadType === 'color') {
                                colorMeterRead = meterRead;                                
                            }                                  
                        }
                        else if(meterReadType.indexOf('color') >= 0 || meterReadType.indexOf('ltpc') >= 0)
                        {
                            errorMessage[i] = validateCommonOtherMR(meterRead.value, meterRead.newVal, $scope.meterReads[i].type);

                            if(errorMessage[i].length > 0) {
                                $scope.errorMessage = errorMessage[i];
                                return;                         
                            }
                            
                            if(meterReadType.indexOf('color') >= 0) {
                                otherColorMeterRead = meterRead;
                                colorMeterReadNameParts = meterReadType.split("_");                          
                            }
                        }
                        else {
                            errorMessage[i] = validateCommonOtherMR(meterRead.value, meterRead.newVal, $scope.meterReads[i].type);

                            if(errorMessage[i].length > 0) {
                                $scope.errorMessage = errorMessage[i];
                                return;                         
                            }
                        }
                        if($scope.meterReads[i].newDate && $scope.meterReads[i].newDate !== null) {
                            if(meterRead.updateDate) {
                                oldDate = meterRead.updateDate;
                            }
                            else {
                                oldDate = meterRead.createDate;
                            }
                            
                            errorMessage[i] = validateMeterReadDate(oldDate, $scope.meterReads[i].newDate);

                            if(errorMessage[i].length > 0) {
                                $scope.errorMessage = errorMessage[i];
                                return;                         
                            }
                        }
                    }
                    else if(!meterRead.newVal) {
                        meterReadCnt++;
                    } 
                    
                    if(colorMeterRead !== null && meterReadType === 'ltpc') {
                        errorMessage[i] = validateRequiredLtpcColorMR(colorMeterRead, ltpcMeterRead, $scope.meterReads[i].type);
                        
                        if(errorMessage[i].length > 0) {
                            $scope.errorMessage = errorMessage[i];
                            return;                         
                        } 
                    }

                    if(otherColorMeterRead !== null && meterReadType.indexOf('ltpc') >= 0 && colorMeterReadNameParts[0] === ltpcMeterReadNameParts[0]) {
                        errorMessage[i] = validateRequiredOtherMR(otherColorMeterRead, otherLtpcMeterRead, $scope.meterReads[i].type);
                        
                        if(errorMessage[i].length > 0) {
                            $scope.errorMessage = errorMessage[i];
                            return;                         
                        } 
                    }
                   
                    if(errorMessage[i].length === 0) {
                        if(meterReadType === 'ltpc' || meterReadType.indexOf('ltpc') >= 0) {
                            if ($scope.meterReads[i].newVal || $scope.meterReads[i].newDate) {
                                if($scope.meterReads[i].newVal && $scope.meterReads[i].newVal !== null) {
                                    $scope.meterReads[i].value = $scope.meterReads[i].newVal;
                                    $scope.meterReads[i].newVal = null;
                                }                              
                                if($scope.meterReads[i].newDate && $scope.meterReads[i].newDate !== null ) {
                                    $scope.meterReads[i].updateDate = FormatterService.formatDateForPost($scope.meterReads[i].newDate);
                                    $scope.meterReads[i].newDate = null;
                                }
                                updateMeterReads($scope.meterReads[i]);
                            }

                            if($scope.meterReads[i-1].newVal || $scope.meterReads[i-1].newDate) {
                                if($scope.meterReads[i-1].newVal && $scope.meterReads[i-1].newVal !== null) {
                                    $scope.meterReads[i-1].value = $scope.meterReads[i-1].newVal;
                                    $scope.meterReads[i-1].newVal = null;
                                }
                                if($scope.meterReads[i-1].newDate && $scope.meterReads[i-1].newDate !== null ) {
                                    $scope.meterReads[i-1].updateDate = FormatterService.formatDateForPost($scope.meterReads[i-1].newDate);
                                    $scope.meterReads[i-1].newDate = null;
                                }                                
                                updateMeterReads($scope.meterReads[i-1]);
                            }
                        }
                        else if(meterReadType.indexOf('color') < 0 && meterReadType.indexOf('ltpc') < 0) {
                            if ($scope.meterReads[i].newVal || $scope.meterReads[i].newDate) {
                                if($scope.meterReads[i].newVal && $scope.meterReads[i].newVal !== null) {
                                    $scope.meterReads[i].value = $scope.meterReads[i].newVal;
                                    $scope.meterReads[i].newVal = null;
                                }                              
                                if($scope.meterReads[i].newDate && $scope.meterReads[i].newDate !== null ) {
                                    $scope.meterReads[i].updateDate = FormatterService.formatDateForPost($scope.meterReads[i].newDate);
                                    $scope.meterReads[i].newDate = null;
                                }
                                updateMeterReads($scope.meterReads[i]);
                            }
                        }
                    }                                     
                }                
               
                if(meterReadCnt === totalMRCount) {
                    $scope.errorMessage = "Please enter value at least in one page count type.";
                    return; 
                }
                else if (indLTPC !== -1 && indColor !== -1 
                    && indMono !== -1 && ($scope.meterReads[indLTPC].value > $scope.meterReads[indColor].value)) {
                    $scope.meterReads[indMono].value = ($scope.meterReads[indLTPC].value - $scope.meterReads[indColor].value); 
                    $scope.meterReads[indMono].updateDate = FormatterService.formatLocalToUTC(new Date());                    
                    updateMeterReads($scope.meterReads[indMono]);
                }

                if($scope.warnMessage.length > 0) {
                    $scope.popupMsg = $scope.warnMessage;
                    createModal();
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

        function validateCommonLtpcColorMR(oldVal, newVal, meterReadType){
            var errorMsg = "";
            var warnMsg = "";
            if(!newVal) {
                errorMsg += meterReadType + " Page count value can not be blank.";
            }
            else if(!pageCountHelper.isDigitPageCount(newVal)) {
                errorMsg += meterReadType + " Page count value must be numeric.";
            }
            else if(newVal < oldVal) {
                errorMsg += meterReadType + " Meter Read value should be greater than or equal to previous value.";
            }
            else if((newVal - oldVal) > 50000) {
                warnMsg += "Unreasonable " + meterReadType + " Meter Read (Value too high).";
            }
            else if((newVal - oldVal) < 10) {
                warnMsg += "Unreasonable " + meterReadType + " Meter Read (Value too low).";
            }
            if(warnMsg.length > 0) {
                $scope.warnMessage = warnMsg;
            }
            return errorMsg;
        }

        function validateCommonOtherMR(oldVal, newVal, meterReadType){
            var errorMsg = "";
            var warnMsg = "";
            if(!newVal) {
                errorMsg += meterReadType + " Page count value can not be blank.";
            }
            else if(!pageCountHelper.isDigitPageCount(newVal)) {
                errorMsg += meterReadType + " Page count value must be numeric.";
            }
            else if(newVal < oldVal) {
                errorMsg += meterReadType + " Meter Read value should be greater than or equal to previous value.";
            }
            else if((newVal - oldVal) > 50000) {
                warnMsg += "Unreasonable " + meterReadType + " Meter Read (Value too high).";
            }
            else if((newVal - oldVal) < 10) {
                warnMsg += "Unreasonable " + meterReadType + " Meter Read (Value too low).";
            }
            if(warnMsg.length > 0) {
                $scope.warnMessage = warnMsg;
            }
            return errorMsg;
        }

        function validateRequiredLtpcColorMR(colorMR, ltpcMR, meterReadType){
            var errorMsg = "";
            if(colorMR.newVal && 
                pageCountHelper.isDigitPageCount(colorMR.newVal) && 
                (ltpcMR === null ||
                !ltpcMR.newVal)) {
                errorMsg += "For Color device, both a LTPC and Color Meter Read required.";
            }
            else if(colorMR.newVal && 
                pageCountHelper.isDigitPageCount(colorMR.newVal) && 
                ltpcMR !== null &&
                ltpcMR.newVal &&
                pageCountHelper.isDigitPageCount(ltpcMR.newVal) &&
                (colorMR.newVal - colorMR.value) > (ltpcMR.newVal - ltpcMR.value)) {
                errorMsg += "The Meter Read difference for Color cannot be greater than the Meter Read difference for LTPC.";
            }
            return errorMsg;
        }

        function validateRequiredOtherMR(colorMR, ltpcMR, meterReadType){
            var errorMsg = "";
            if(colorMR.newVal && 
                pageCountHelper.isDigitPageCount(colorMR.newVal) && 
                ltpcMR !== null && 
                ltpcMR.newVal &&
                pageCountHelper.isDigitPageCount(ltpcMR.newVal) &&
                colorMR.newVal > ltpcMR.newVal) {
                errorMsg += "The Meter Read difference for " + colorMR.type + " cannot be greater than the Meter Read difference for " + ltpcMR.type + ".";
            }
            else if(colorMR.newVal && 
                pageCountHelper.isDigitPageCount(colorMR.newVal) && 
                ltpcMR !== null && 
                ltpcMR.value &&
                pageCountHelper.isDigitPageCount(ltpcMR.value) &&
                colorMR.newVal < ltpcMR.value) {
                errorMsg += "The Meter Read difference for " + colorMR.type + " cannot be greater than the Meter Read difference for " + ltpcMR.type + ".";
            }
            return errorMsg;
        }

        function validateMeterReadDate(oldDate, newDate){
            var errorMsg = "";
            newDate = FormatterService.formatDateForPost(newDate);
            
            if(newDate < oldDate) {
                errorMsg = "Date/Time selected should not be previous to last submitted date/time."
            }
            return errorMsg;
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
        	 ServiceRequest.reset();
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
                type: 'DEVICE_CHANGE_HISTORY',
                assetId: Devices.item.id
            };

            filterSearchService.addBasicFilter('DEVICE_MAN.MANAGE_DEVICE_OVERvIEW.TXT_CHANGE_HISTORY', params, false, function() {
                $scope.$broadcast('setupPrintAndExport', $scope);
            });
        }

        $scope.doNothing = function(event){   
            var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
            if( keyCode == 13 ) {

                if(!e) var e = event;

                e.cancelBubble = true;
                e.returnValue = false;

                if (e.stopPropagation) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            }
        };
       
        if ($rootScope.serviceRequestMADCAccess) {
            setCsvDefinition();
            madcGrid();
        } else {
            setCsvDefinition();
            $scope.$broadcast('setupPrintAndExport', $scope);
        }
        // BElow section checks the device account permissions...
        function setupInitDevicePermissions(){
            $scope.deviceActionPermissions.orderSuppliesAsset = $rootScope.orderSuppliesAsset;
            $scope.deviceActionPermissions.createBreakFixAccess = $rootScope.createBreakFixAccess;
            $scope.deviceActionPermissions.pageCountAccess = $rootScope.pageCountAccess;
            $scope.deviceActionPermissions.updateDevice = $rootScope.updateDevice;
            $scope.deviceActionPermissions.moveDevice = $rootScope.moveDevice;
            $scope.deviceActionPermissions.orderDevice = $rootScope.orderDevice;
            $scope.deviceActionPermissions.decommissionAccess = $rootScope.decommissionAccess;
            $scope.deviceActionPermissions.serviceRequestBreakFixAccess = $rootScope.serviceRequestBreakFixAccess;
            $scope.deviceActionPermissions.viewSupplyOrderAccess = $rootScope.viewSupplyOrderAccess; 
            $scope.deviceActionPermissions.deviceInfoAccess = $rootScope.deviceInfoAccess; 
    		
        }
        if(Devices.item && Devices.item._embedded){
        	var configPermissions = [];
            configPermissions = angular.copy($rootScope.configurePermissions);        
        	$scope.deviceActionPermissions = {};          		
    		
            
           
            setupInitDevicePermissions();
        	var helperDeviceSelect = new SecurityHelper($scope.deviceActionPermissions) 
        	var accId = Devices.item._embedded.account.accountId,
        	i=0,
        	acntPermissions,
        	accounts = $rootScope.currentUser.transactionalAccount.data;    	
        	
        	for(;i<accounts.length;i++){
            	if(accounts[i].account.accountId === accId){
            		acntPermissions = accounts[i].permisssions.permissions;
            		break;
            	}
            }
        	$scope.deviceActionPermissions.security.setWorkingPermission(acntPermissions);
        	helperDeviceSelect.setupPermissionList(configPermissions);
        }
        //Ends device account permissions...
    	
    	
        
        
    }
]);

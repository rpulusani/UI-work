define(['angular','serviceRequest', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('ServiceRequestDetailController', [
        '$scope',
        '$location',
        '$rootScope',
        'ServiceRequestService',
        'SRControllerHelperService',
        'FormatterService',
        'BlankCheck',
        '$translate',
        function(
            $scope,
            $location,
            $rootScope,
            ServiceRequest,
            SRHelper,
            FormatterService,
            BlankCheck,
            $translate
        ) {

            SRHelper.addMethods(ServiceRequest, $scope, $rootScope);

            if(!ServiceRequest || !ServiceRequest.item){
                $scope.redirectToList();
            }

            $scope.sr = ServiceRequest.item;
            if(ServiceRequest && ServiceRequest.item &&
                ServiceRequest.item.asset ){
                $scope.device = ServiceRequest.item.asset.item;

            }else if(ServiceRequest && ServiceRequest.item &&
                ServiceRequest.item.assetInfo){
               $scope.device =  ServiceRequest.item.assetInfo;
            }

            $scope.configure = {
                header: {
                    translate: {}
                },
                contact:{
                    translate: {
                        title: 'SERVICE_REQUEST.CONTACT_INFORMATION',
                        requestedByTitle: 'SERVICE_REQUEST.REQUEST_CREATED_BY',
                        primaryTitle: 'SERVICE_REQUEST.PRIMARY_CONTACT',
                        changePrimary: 'SERVICE_REQUEST.CHANGE_PRIMARY_CONTACT'
                    },
                    show:{
                        primaryAction : false
                    },
                    source: 'DeviceServiceRequestDevice'
                },
                detail:{
                    translate:{
                        title: 'DEVICE_SERVICE_REQUEST.ADDITIONAL_REQUEST_DETAILS',
                        referenceId: 'SERVICE_REQUEST.INTERNAL_REFERENCE_ID',
                        costCenter: 'SERVICE_REQUEST.REQUEST_COST_CENTER',
                        comments: 'LABEL.COMMENTS',
                        attachments: 'LABEL.ATTACHMENTS',
                        attachmentMessage: 'MESSAGE.ATTACHMENT',
                        fileList: ['.csv', '.xls', '.xlsx', '.vsd', '.doc', '.docx', '.ppt', '.pptx', '.pdf', '.zip'].join(', ')
                    },
                    show:{
                        referenceId: true,
                        costCenter: true,
                        comments: true,
                        attachements: true
                    }
                }
            };
            function addDeviceInformation(){
                $scope.configure.device = {
                    information:{
                            translate: {
                                title: 'DEVICE_MGT.DEVICE_INFO',
                                serialNumber: 'DEVICE_MGT.SERIAL_NO',
                                partNumber: 'DEVICE_MGT.PART_NUMBER',
                                product: 'DEVICE_MGT.PRODUCT_MODEL',
                                ipAddress: 'DEVICE_MGT.IP_ADDRESS',
                                installAddress: 'DEVICE_MGT.INSTALL_ADDRESS'
                            }
                    }

                };
            }
            function addDecommissionInfo(){
                 $scope.configure.device.removal = {
                            translate:{
                                title: 'DEVICE_SERVICE_REQUEST.DEVICE_REMOVAL',
                                pickup: 'DEVICE_SERVICE_REQUEST.DEVICE_PICKUP_LEXMARK',
                                pageCount: 'DEVICE_SERVICE_REQUEST.DEVICE_PAGE_COUNTS'
                            },
                            source: 'decommission'
                    };
            }
            function configureReceiptTemplate(){
                $scope.configure.header.translate.h1 = 'SERVICE_REQUEST.REQUEST_SERVICE_FOR_SUBMITTED';
                $scope.configure.header.translate.h1Values = {
                    'srNumber': FormatterService.getFormattedSRNumber($scope.sr)
                };
                $scope.configure.header.translate.body = 'SERVICE_REQUEST.REQUEST_SERVICE_SUBMIT_HEADER_BODY';
                $scope.configure.header.translate.bodyValues= {};
                $scope.configure.receipt = {
                    translate:{
                        title:'SERVICE_REQUEST.REQUEST_SERVICE_DETAIL',
                        titleValues: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) }
                    }
                };
            }

            $rootScope.showCancelBtn = true;

            $scope.goToServiceCancel = function(requestNumber){
                $location.path('/service_requests/' + requestNumber + '/cancel');
            };


            $scope.setupTemplates(function(){}, configureReceiptTemplate, function(){});
            switch($scope.sr.type){
                case 'MADC_DECOMMISSION':
                    addDeviceInformation();
                    addDecommissionInfo();
                    $scope.device.lexmarkPickupDevice = 'true';
                    $scope.formattedPickupDevice = FormatterService.formatYesNo($scope.device.lexmarkPickupDevice);
                break;
                case 'DATA_ASSET_DEREGISTER':
                    addDeviceInformation();
                    addDecommissionInfo();
                    $scope.device.lexmarkPickupDevice = 'false';
                    $scope.formattedPickupDevice = FormatterService.formatYesNo($scope.device.lexmarkPickupDevice);
                break;
                case 'BREAK_FIX':
                addDeviceInformation();
                $scope.configure.device.service ={
                        translate:{
                            title:'DEVICE_SERVICE_REQUEST.SERVICE_DETAILS',
                            description:'DEVICE_SERVICE_REQUEST.PROBLEM_DESCRIPTION'
                        }
                    };
                break;
                default:
                break;
            }

            if (!BlankCheck.isNull($scope.sr) && !BlankCheck.isNull($scope.sr.primaryContact) &&
                !BlankCheck.isNull($scope.sr.primaryContact.item)){
                        $scope.formattedPrimaryContact = FormatterService.formatContact($scope.sr.primaryContact.item);
            }
            if(!BlankCheck.isNull($scope.sr) && !BlankCheck.isNull($scope.sr.requester) &&
                !BlankCheck.isNull($scope.sr.requester.item)){
                $scope.requestedByContactFormatted = FormatterService.formatContact($scope.sr.requester.item);
            }
             if (!BlankCheck.isNull($scope.sr)) {
                $scope.formattedNotes = FormatterService.formatNoneIfEmpty($scope.sr.notes);
                $scope.formattedReferenceId = FormatterService.formatNoneIfEmpty($scope.sr.customerReferenceId);
                $scope.formattedCostCenter = FormatterService.formatNoneIfEmpty($scope.sr.costCenter);
            }
    }]);
});

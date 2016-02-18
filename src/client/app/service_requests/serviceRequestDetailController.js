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
        'OrderRequest',
        '$timeout',
        'OrderItems',
        'OrderTypes',
        function(
            $scope,
            $location,
            $rootScope,
            ServiceRequest,
            SRHelper,
            FormatterService,
            BlankCheck,
            $translate,
            Orders,
            $timeout,
            OrderItems,
            OrderTypes
        ) {
            $scope.hideSubmitButton = true;
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
                    },
                },
                statusList:[
                  {
                    'label':'Submitted',
                    'date': '1/29/2016',
                    'current': true
                  },
                  {
                    'label':'In progress',
                    'date': '',
                    'current': false
                  },
                  {
                    'label':'Completed',
                    'date': '',
                    'current': false
                  }
                ]
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
            function addDeviceMove(){
                $scope.configure.device = {
                    information:{
                        translate:{
                            title:'DEVICE_SERVICE_REQUEST.REQUEST_MOVE_TITLE',
                            move: 'DEVICE_SERVICE_REQUEST.LEXMARK_MOVE_DEVICE',
                            installAddress: 'DEVICE_MGT.INSTALL_ADDRESS'
                        }
                    }
                };
                $scope.configure.receipt.translate.title = 'DEVICE_SERVICE_REQUEST.UPDATE_DEVICE_DETAIL';
                $scope.configure.header.translate.h1 = 'DEVICE_SERVICE_REQUEST.UPDATE_DEVICE_REQUEST_NUMBER';
            }
            function addReturnOrderInfo(){
                $scope.configure.order = {
                        returnSupplies:{
                            translate:{
                                returnDetails: 'ORDER_MAN.ORDER_SUPPLY_RETURN_REVIEW.TXT_RETURN_DETAILS',
                                returnReason: 'ORDER_MAN.ORDER_SUPPLY_RETURN_REVIEW.TXT_RETURN_TYPE',
                                returnNotes: 'ORDER_MAN.ORDER_SUPPLY_RETURN_REVIEW.TXT_NOTES'
                            }
                        },
                        address:{
                            header:{
                                translate:{
                                    h1: 'ORDER_MAN.ORDER_SELECT_ADDRESS.TXT_ORDER_SELECT_RETURN_ADDRESS_TITLE',
                                    h1Values: {},
                                    body: 'ORDER_MAN.ORDER_SELECT_ADDRESS.TXT_ORDER_ADDRESS_PAR',
                                    bodyValues: '',
                                    readMore: ''
                                }
                            },
                            information:{
                                translate:{
                                    title:'ORDER_MAN.ORDER_SUPPLY_RETURN_REVIEW.TXT_ADDRESS_RETURN',
                                    makeChanges:'ORDER_MAN.ORDER_SUPPLY_RETURN_REVIEW.LINK_TXT_ADDRESS_RETURN'
                                }
                            },
                            source:'ReturnOrders',
                            pickerObject: $scope.order,
                            actions:{
                                translate: {
                                    abandonRequest:'ORDER_MAN.ORDER_SELECT_ADDRESS.BTN_ORDER_DISCARD_ADDRESS',
                                    submit: 'ORDER_MAN.ORDER_SELECT_ADDRESS.BTN_ORDER_CHANGE_ADDRESS'
                                }
                            }
                        }
                    };
            }
            function addDeviceOrderInfo(){
                $timeout(function(){
                    OrderItems.columns = 'pruchaseSet';
                        $scope.$broadcast('OrderContentRefresh', {
                            'OrderItems': $scope.sr.item.orderItems // send whatever you want
                        });
                }, 50);
                $scope.configure.header.translate.h1 = "ORDER_CATALOGS.RECEIPT.TXT_DETAIL_TITLE";
                        $scope.configure.header.translate.h1Values = {'srNumber': FormatterService.getFormattedSRNumber($scope.sr)};
                        $scope.configure.header.translate.body = "ORDER_CATALOGS.RECEIPT.TXT_PARA";
                        $scope.configure.header.translate.readMore = "";
                        $scope.configure.header.readMoreUrl = Orders.route;
                        $scope.configure.header.translate.bodyValues= {
                            'order': FormatterService.getFormattedSRNumber($scope.sr),
                            'srHours': 24,
                            'deviceManagementUrl': 'orders/',
                        };
                        $scope.configure.receipt = {
                            translate:{
                                title:"ORDER_CATALOGS.RECEIPT.TXT_DETAIL_TITLE",
                                titleValues: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) }
                            }
                        };
                $scope.configure.queued = false;
                $scope.configure.detail.attachments = 'ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_ATTACHMENTS';
                $scope.configure.order = {
                    details:{
                        translate:{
                            title: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_DETAILS'
                        }
                    }
                };
                $scope.configure.order.shipToBillTo = {
                                translate:{
                                    shipToAddress:'ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_SHIP_TO_ADDR',
                                    instructions:'ORDER_MAN.COMMON.TXT_ORDER_DELIVERY_INSTR',
                                    deliveryDate:'ORDER_MAN.COMMON.TXT_ORDER_REQ_DELIV_DATE',
                                    expedite:'ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_DELIVERY_EXPEDITE',
                                    billToAddress:'ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_BILL_TO_ADDR'
                                }
                            };
                $scope.configure.order.po = {
                    translate:{
                        label: 'ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_PURCHASE_ORDER',
                        title:'ORDER_MAN.COMMON.TXT_ORDER_PO_DETAILS',
                    }
                };
                $scope.configure.contact.show.primaryAction = false;
            }

            function addSupplyOrderInfo(){

                $timeout(function(){
                    OrderItems.columns = 'pruchaseSet';
                        $scope.$broadcast('OrderContentRefresh', {
                            'OrderItems': $scope.sr.item.orderItems // send whatever you want
                        });
                }, 50);
                 $scope.configure.header.translate.h1 = "ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_DETAIL_SUPPLIES";
                        $scope.configure.header.translate.h1Values = {'srNumber': FormatterService.getFormattedSRNumber($scope.sr)};
                        $scope.configure.header.translate.body = "ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_SUBMITTED_PAR";
                        $scope.configure.header.translate.readMore = "ORDER_MAN.SUPPLY_ORDER_SUBMITTED.LNK_MANAGE_DEVICES";
                        $scope.configure.header.readMoreUrl = Orders.route;
                        $scope.configure.header.translate.bodyValues= {
                            'order': FormatterService.getFormattedSRNumber($scope.sr),
                            'srHours': 24,
                            'deviceManagementUrl': 'device_management/',
                        };
                        $scope.configure.receipt = {
                            translate:{
                                title:"ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_DETAIL_SUPPLIES",
                                titleValues: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) }
                            }
                        };
                $scope.configure.queued = false;
                $scope.configure.detail.attachments = 'ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_ATTACHMENTS';
                $scope.configure.order = {
                    details:{
                        translate:{
                            title: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_DETAILS'
                        }
                    }
                };
                $scope.configure.order.shipToBillTo = {
                                translate:{
                                    shipToAddress:'ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_SHIP_TO_ADDR',
                                    instructions:'ORDER_MAN.COMMON.TXT_ORDER_DELIVERY_INSTR',
                                    deliveryDate:'ORDER_MAN.COMMON.TXT_ORDER_REQ_DELIV_DATE',
                                    expedite:'ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_DELIVERY_EXPEDITE',
                                    billToAddress:'ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_BILL_TO_ADDR'
                                }
                            };
                $scope.configure.order.po = {
                    translate:{
                        label: 'ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_PURCHASE_ORDER',
                        title:'ORDER_MAN.COMMON.TXT_ORDER_PO_DETAILS',
                    }
                };
                $scope.configure.contact.show.primaryAction = false;
            }
            function addAddressInfo(Title){
                $scope.configure.address = {
                    information:{
                        translate:{
                            title: Title,
                        }
                    }
                };
            }
            function addContactInfo(Title){
                $scope.configure.contactsr = {
                    translate:{
                        title: Title,
                    }
                };
                if (!BlankCheck.isNull($scope.sr) && !BlankCheck.isNull($scope.sr.primaryContact) &&
                    !BlankCheck.isNull($scope.sr.primaryContact.item) &&
                    !BlankCheck.isNull($scope.sr.primaryContact.item.address)){

                        $scope.formattedPrimaryContactAddress =
                            FormatterService.formatAddress($scope.sr.primaryContact.item.address);
                }
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
                        titleValues: {
                            'srNumber': FormatterService.getFormattedSRNumber($scope.sr)
                        },
                        subtitle: 'SERVICE_REQUEST.REQUEST_STATUS'
                    },
                    print: true
                };
            }


            $scope.goToServiceCancel = function(requestNumber, type){
                switch(type){
                    case 'MADC_DECOMMISSION':
                        $location.path('/service_requests/' + requestNumber + '/cancel/CANCEL_DECOMMISSION');
                    break;
                    case 'MADC_INSTALL':
                        $location.path('/service_requests/' + requestNumber + '/cancel/CANCEL_INSTALL');
                    break;
                    case 'MADC_MOVE':
                        $location.path('/service_requests/' + requestNumber + '/cancel/CANCEL_MOVE');
                    break;
                    default:
                    $scope.redirectToList();
                }

            };
        function processStandardTypes(){
            switch($scope.sr.type){
                case 'SUPPLIES_ASSET_ORDER':
                    addSupplyOrderInfo();
                break;
                case 'SUPPLIES_CATALOG_ORDER':
                    //addSupplyOrderInfo();
                break;
                case 'HARDWARE_ORDER':
                    addDeviceOrderInfo();
                break;
                case 'DATA_ADDRESS_ADD':
                    addAddressInfo('ADDRESS_SERVICE_REQUEST.ADDRESS_REQUESTED');
                    $scope.formattedAddress = "No Address information found";
                    $scope.configure.receipt.translate.title = 'DEVICE_SERVICE_REQUEST.ADD_ADDRESS_DETAIL';
                    $scope.configure.header.translate.h1 = 'DEVICE_SERVICE_REQUEST.ADD_DEVICE_REQUEST_NUMBER';
                break;
                case 'DATA_ADDRESS_CHANGE':
                    addAddressInfo('ADDRESS_SERVICE_REQUEST.DATA_ADDRESS_CHANGE');
                    $scope.formattedAddress = "No Address information found";
                    $scope.configure.receipt.translate.title = 'DEVICE_SERVICE_REQUEST.UPDATE_ADDRESS_DETAIL';
                    $scope.configure.header.translate.h1 = 'DEVICE_SERVICE_REQUEST.UPDATE_ADDRESS_REQUEST_NUMBER';
                break;
                case 'DATA_ADDRESS_REMOVE':
                    addAddressInfo('ADDRESS_SERVICE_REQUEST.DATA_ADDRESS_REMOVE');
                    $scope.formattedAddress = "No Address information found";
                    $scope.configure.receipt.translate.title = 'DEVICE_SERVICE_REQUEST.DELETE_ADDRESS_DETAIL';
                    $scope.configure.header.translate.h1 = 'DEVICE_SERVICE_REQUEST.DELETE_ADDRESS_REQUEST_NUMBER';
                break;
                case 'DATA_CONTACT_REMOVE':
                    addContactInfo('CONTACT_SERVICE_REQUEST.DATA_CONTACT_REMOVE_TITLE');
                    $scope.configure.receipt.translate.title = 'DEVICE_SERVICE_REQUEST.DELETE_CONTACT_DETAIL';
                    $scope.configure.header.translate.h1 = 'DEVICE_SERVICE_REQUEST.DELETE_CONTACT_REQUEST_NUMBER';
                break;
                case 'DATA_CONTACT_CHANGE':
                    addContactInfo('CONTACT_SERVICE_REQUEST.DATA_CONTACT_CHANGE');
                    $scope.configure.receipt.translate.title = 'DEVICE_SERVICE_REQUEST.UPDATE_CONTACT_DETAIL';
                    $scope.configure.header.translate.h1 = 'DEVICE_SERVICE_REQUEST.UPDATE_CONTACT_REQUEST_NUMBER';
                break;
                case 'MADC_MOVE':
                    addDeviceMove();
                    $scope.formattedMoveDevice = 'Yes';
                    $scope.configure.header.showCancelBtn = true;
                    $scope.configure.header.showUpdateBtn = true;
                break;
                case 'DATA_ASSET_CHANGE':
                    addDeviceMove();
                    $scope.formattedMoveDevice = 'No';
                break;
                case 'MADC_INSTALL':
                    addDeviceInformation();
                    $scope.configure.receipt.translate.title = 'DEVICE_SERVICE_REQUEST.ADD_DEVICE_DETAIL';
                    $scope.configure.header.translate.h1 = 'DEVICE_SERVICE_REQUEST.ADD_DEVICE_REQUEST_NUMBER';
                    $scope.configure.header.showCancelBtn = true;
                    $scope.configure.header.showUpdateBtn = true;
                break;
                case 'MADC_DECOMMISSION':
                    addDeviceInformation();
                    addDecommissionInfo();
                    $scope.device.lexmarkPickupDevice = 'true';
                    $scope.formattedPickupDevice = FormatterService.formatYesNo($scope.device.lexmarkPickupDevice);
                    $scope.configure.receipt.translate.title = 'DEVICE_SERVICE_REQUEST.DECOMMISION_DEVICE_DETAIL';
                    $scope.configure.header.translate.h1 = 'DEVICE_SERVICE_REQUEST.DECOMMISSION_DEVICE_REQUEST_NUMBER';
                    $scope.configure.header.showCancelBtn = true;
                    $scope.configure.header.showUpdateBtn = true;
                break;
                case 'DATA_ASSET_DEREGISTER':
                    addDeviceInformation();
                    addDecommissionInfo();
                    $scope.device.lexmarkPickupDevice = 'false';
                    $scope.formattedPickupDevice = FormatterService.formatYesNo($scope.device.lexmarkPickupDevice);
                    $scope.configure.receipt.translate.title = 'DEVICE_SERVICE_REQUEST.DECOMMISION_DEVICE_DETAIL';
                    $scope.configure.header.translate.h1 = 'DEVICE_SERVICE_REQUEST.DECOMMISSION_DEVICE_REQUEST_NUMBER';
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
        }

            $scope.goToServiceChange = function(requestNumber, type) {
                $location.path('/service_requests');
            };

            $scope.setupTemplates(function(){}, configureReceiptTemplate, function(){});
            if($scope.sr.type.indexOf('RETURN_SUPPLIES') > -1){
                addReturnOrderInfo();
            }else{
               processStandardTypes();
            }


        if (!BlankCheck.isNull($scope.sr.sourceAddress) && !BlankCheck.isNull($scope.sr.sourceAddress.item)) {
                $scope.formattedDeviceAddress = FormatterService.formatAddress($scope.sr.sourceAddress.item);
        }

        if (!BlankCheck.isNull($scope.sr.destinationAddress) && !BlankCheck.isNull($scope.sr.destinationAddress.item)) {
                $scope.formattedDeviceAddress = FormatterService.formatAddress($scope.sr.destinationAddress.item);
        }

        if ($scope.device && !BlankCheck.isNull($scope.device.deviceContact)) {
                $scope.formattedDeviceContact = FormatterService.formatContact($scope.device.deviceContact);
        }

        if (!BlankCheck.isNull($scope.sr) && !BlankCheck.isNull($scope.sr.primaryContact) &&
            !BlankCheck.isNull($scope.sr.primaryContact.item)){
                    $scope.formattedPrimaryContact = FormatterService.formatContact($scope.sr.primaryContact.item);
        }
        if(!BlankCheck.isNull($scope.sr) && !BlankCheck.isNull($scope.sr.requester) &&
            !BlankCheck.isNull($scope.sr.requester.item)){
            $scope.requestedByContactFormatted = FormatterService.formatContact($scope.sr.requester.item);
        }
        if ($scope.sr.billToAddress && !BlankCheck.isNull($scope.sr.billToAddress.item)){
                $scope.formatedBillToAddress = FormatterService.formatAddress($scope.sr.billToAddress.item);
        }else {
                $scope.formatedBillToAddress = FormatterService.formatNoneIfEmpty($scope.sr.billToAddress);
        }

        if ($scope.sr.shipToAddress && !BlankCheck.isNull($scope.sr.shipToAddress.item)){
                $scope.formatedShipToAddress = FormatterService.formatAddress($scope.sr.shipToAddress.item);
        }else {
                $scope.formatedShipToAddress = FormatterService.formatNoneIfEmpty($scope.sr.shipToAddress);
        }

        if (!BlankCheck.isNull($scope.sr)) {
            $scope.formattedNotes = FormatterService.formatNoneIfEmpty($scope.sr.notes);
            $scope.formattedReferenceId = FormatterService.formatNoneIfEmpty($scope.sr.customerReferenceId);
            $scope.formattedCostCenter = FormatterService.formatNoneIfEmpty($scope.sr.costCenter);
            $scope.formattedExpedite = FormatterService.formatYesNo($scope.sr.expediteOrder);
            $scope.formattedDeliveryDate = FormatterService.formatNoneIfEmpty(
                FormatterService.formatDate($scope.sr.requestedDeliveryDate));
            $scope.formattedPONumber = FormatterService.formatNoneIfEmpty($scope.sr.purchaseOrderNumber);
            $scope.formattedInstructions = FormatterService.formatNoneIfEmpty($scope.sr.specialHandlingInstructions);
            $scope.formattedReason = FormatterService.formatNoneIfEmpty(OrderTypes.getDisplay($scope.sr.type));
            $scope.formattedDescription = FormatterService.formatNoneIfEmpty($scope.sr.description);
        }
    }]);
});

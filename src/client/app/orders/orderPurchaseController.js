define(['angular','order', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.orders')
    .controller('OrderPurchaseController', [
        '$scope',
        '$location',
        '$rootScope',
        'OrderRequest',
        'grid',
        'FilterSearchService',
        'SRControllerHelperService',
        'ServiceRequestService',
        'OrderItems',
        '$translate',
        'Devices',
        '$timeout',
        'Contacts',
        'BlankCheck',
        'FormatterService',
        function(
            $scope,
            $location,
            $rootScope,
            Orders,
            Grid,
            FilterSearchService,
            SRHelper,
            ServiceRequest,
            OrderItems,
            $translate,
            Devices,
            $timeout,
            Contacts,
            BlankCheck,
            FormatterService) {

            SRHelper.addMethods(Orders, $scope, $rootScope);
            $scope.editable = false; //make order summary not actionable

            var configureSR = function(ServiceRequest){
                    ServiceRequest.addField('description', '');
                    ServiceRequest.addRelationship('account', $scope.device, 'account');
                    ServiceRequest.addRelationship('asset', $scope.device, 'self');
                    ServiceRequest.addRelationship('primaryContact', $scope.device, 'contact');
                    ServiceRequest.addField('type', 'SUPPLIES_ASSET_ORDER');
            };

            if (Devices.item === null) {
                $scope.redirectToList();
            } else if($rootScope.selectedContact &&
                $rootScope.returnPickerObject &&
                $rootScope.selectionId === Devices.item.id){

                    $scope.device = $rootScope.returnPickerObject;
                    $scope.sr = $rootScope.returnPickerSRObject;
                    ServiceRequest.addRelationship('primaryContact', $rootScope.selectedContact, 'self');
                    $scope.device.primaryContact = angular.copy($rootScope.selectedContact);
                    $scope.resetContactPicker();

            } else if($rootScope.selectedBillToAddress && $rootScope.returnPickerObjectAddressBillTo){

                $scope.sr = $rootScope.returnPickerSRObject;
                ServiceRequest.addRelationship('billToAddress', $rootScope.selectedBillToAddress, 'self');
                $scope.orders.billToAddress = angular.copy($rootScope.selectedBillToAddress);
                $scope.resetAddressBillToPicker();

            } else if($rootScope.selectedShipToAddress && $rootScope.returnPickerObjectAddressShipTo){

                $scope.sr = $rootScope.returnPickerSRObject;
                ServiceRequest.addRelationship('shipToAddress', $rootScope.selectedShipToAddress, 'self');
                $scope.orders.shipToAddress = angular.copy($rootScope.selectedShipToAddress);
                $scope.resetAddressShipToPicker();

            } else{

                $rootScope.device = Devices.item;
                if(Orders.item){
                    $rootScope.orders = Orders.item;
                }else{
                    Orders.item = {};
                    $rootScope.orders = Orders.item;
                }

                if (!BlankCheck.isNull(Devices.item['contact'])) {
                    $scope.device.primaryContact = $scope.device['contact']['item'];
                }
            }

            $scope.setupSR(ServiceRequest, configureSR);
            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate );
            if($rootScope.device){
                $scope.getRequestor(ServiceRequest, Contacts);
            }

            function configureReviewTemplate(){
                configureTemplates();
                $timeout(function(){
                OrderItems.columns = 'pruchaseSet';
                    $scope.$broadcast('OrderContentRefresh', {
                        'OrderItems': OrderItems // send whatever you want
                    });
                }, 50);
                $scope.configure.actions.translate.submit = 'ORDER_MAN.SUPPLY_ORDER_REVIEW.BTN_ORDER_SUBMINT_SUPPLIES';
                $scope.configure.actions.submit = function(){

                   ServiceRequest.addField('orderItems', OrderItems.buildSrArray());
                   var deferred = ServiceRequest.post({
                         item:  $scope.sr
                    });

                    deferred.then(function(result){
                        $location.path(Orders.route + '/purchase/receipt');
                    }, function(reason){
                        NREUM.noticeError('Failed to create SR because: ' + reason);
                    });

                };
            }

            function configureReceiptTemplate(){
                $scope.configure.header.translate.h1 = "ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_SUBMIT_SUPPLIES";
                $scope.configure.header.translate.h1Values = {'productModel': $scope.device.productModel};
                $scope.configure.header.translate.body = "ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_SUBMITTED_PAR";
                $scope.configure.header.translate.readMore = "ORDER_MAN.SUPPLY_ORDER_SUBMITTED.LNK_MANAGE_DEVICES";
                $scope.configure.header.readMoreUrl = Devices.route;
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
                $scope.configure.contact.show.primaryAction = false;
            }
            function configureTemplates(){
                if($scope.device){
                     $scope.configure = {
                        header: {
                            translate:{
                                h1: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_REVIEW_SUPPLIES',
                                h1Values:{ productModel: Devices.item.productModel},
                                body: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_REVIEW_SUPPLIES_PAR',
                                bodyValues: '',
                                readMore: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.LNK_LEARN_MORE'
                            },
                            readMoreUrl: '#',
                            showCancelBtn: false
                        },
                        order:{
                            details:{
                                translate:{
                                    title:'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_DETAILS',
                                    action:'ORDER_MAN.SUPPLY_ORDER_REVIEW.LNK_CHANGE'
                                },
                                actionLink:{},
                            },
                            po:{
                                translate:{
                                    title:'ORDER_MAN.COMMON.TXT_ORDER_PO_DETAILS',
                                    label: 'ORDER_MAN.COMMON.TXT_ORDER_PO_NUM'
                                }
                            },
                            accountDetails:{
                                translate:{
                                    title:'ORDER_MAN.COMMON.TEXT_ACCOUNT_DETAILS'
                                }
                            },
                            shipToBillTo:{
                                translate:{
                                    title:'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_SHIPPING_BILLING',
                                    shipToAddress:'ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_SHIP_TO_ADDR',
                                    shipToAction:'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_SELECT_SHIP_TO_FOR',
                                    office:'',
                                    building:'',
                                    floor:'',
                                    instructions:'ORDER_MAN.COMMON.TXT_ORDER_DELIVERY_INSTR',
                                    instructionsNote:'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_DELIVERY_NOTE',
                                    deliveryDate:'ORDER_MAN.COMMON.TXT_ORDER_REQ_DELIV_DATE',
                                    expedite:'ORDER_MAN.SUPPLY_ORDER_REVIEW.CTRL_ORDER_EXPEDITE',
                                    billToAddress:'ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_BILL_TO_ADDR',
                                    billToAction:'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_SELECT_BILL_TO_FOR'
                                }
                            }
                        },
                        contact:{
                            translate: {
                                title: 'ORDER_MAN.COMMON.TXT_ORDER_CONTACTS',
                                requestedByTitle: 'ORDER_MAN.COMMON.TXT_ORDER_CREATED_BY',
                                primaryTitle: 'SERVICE_REQUEST.PRIMARY_CONTACT',
                                changePrimary: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_CHANGE_CONTACT'
                            },
                            show:{
                                primaryAction : true
                            },
                            source: 'OrderPurchase'
                        },
                        detail:{
                            translate:{
                                title: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_ADDL_DETAILS',
                                referenceId: 'SERVICE_REQUEST.INTERNAL_REFERENCE_ID',
                                costCenter: 'SERVICE_REQUEST.REQUEST_COST_CENTER',
                                comments: 'LABEL.COMMENTS',
                                attachments: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_ATTACHMENTS_SIZE',
                                attachmentMessage: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_ATTACH_FILE_FORMATS',
                                fileList: ''
                            },
                            show:{
                                referenceId: true,
                                costCenter: true,
                                comments: true,
                                attachements: true
                            }
                        },
                        actions:{
                            translate: {
                                abandonRequest:'ORDER_MAN.SUPPLY_ORDER_REVIEW.BTN_ORDER_ABANDON_SUPPLIES',
                                submit: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.BTN_ORDER_SUBMINT_SUPPLIES'
                            },
                            submit: function() {
                                $location.path(Orders.route + '/' + $scope.device.id + '/review');
                            }
                        },
                        modal:{
                            translate:{
                                abandonTitle: 'SERVICE_REQUEST.TITLE_ABANDON_MODAL',
                                abandondBody: 'SERVICE_REQUEST.BODY_ABANDON_MODAL',
                                abandonCancel:'SERVICE_REQUEST.ABANDON_MODAL_CANCEL',
                                abandonConfirm: 'SERVICE_REQUEST.ABANDON_MODAL_CONFIRM',
                            },
                            returnPath: Orders.route + '/'
                        },
                        contactPicker:{
                            translate:{
                                title: 'CONTACT.SELECT_CONTACT',
                                contactSelectText: 'CONTACT.SELECTED_CONTACT_IS',
                            },
                            returnPath: Orders.route + '/' +  '/review'
                        },
                        billToPicker:{
                            translate:{
                                selectedAddressTitle:'ORDER_MAN.ORDER_SELECT_BILL_TO_ADDR.TXT_ORDER_SELECT_BILL_TO'
                            },
                            returnPath: Orders.route + '/' + '/review',
                            source: 'OrderPurchase'
                        },
                        shipToPicker:{
                            translate:{
                                selectedAddressTitle:''
                            },
                            returnPath: Orders.route + '/' + '/review',
                            source: 'OrderPurchase'
                        }
                    };
                }
            }

             if ($scope.device && !BlankCheck.isNull($scope.device.primaryContact)){
                    $scope.formattedPrimaryContact = FormatterService.formatContact($scope.device.primaryContact);
            }
            if ($scope.orders && !BlankCheck.isNull($scope.orders.billToAddress)){
                    $scope.formatedBillToAddress = FormatterService.formatAddress($scope.orders.billToAddress);
            }
            if ($scope.orders && !BlankCheck.isNull($scope.orders.shipToAddress)){
                    $scope.formatedShipToAddress = FormatterService.formatAddress($scope.orders.shipToAddress);
            }
        }
    ]);
});

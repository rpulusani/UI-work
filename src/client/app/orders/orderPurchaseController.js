

angular.module('mps.orders')
.controller('OrderPurchaseController', [
    '$scope',
    '$location',
    '$filter',
    '$rootScope',
    'OrderRequest',
    'grid',
    'FilterSearchService',
    'SRControllerHelperService',
    'OrderItems',
    '$translate',
    'Devices',
    '$timeout',
    'Contacts',
    'BlankCheck',
    'FormatterService',
    "$routeParams",
    'TombstoneService',
    'tombstoneWaitTimeout',
    'ServiceRequestService',
    'OrderControllerHelperService',
    function(
        $scope,
        $location,
        $filter,
        $rootScope,
        Orders,
        Grid,
        FilterSearchService,
        SRHelper,
        OrderItems,
        $translate,
        Devices,
        $timeout,
        Contacts,
        BlankCheck,
        FormatterService,
        $routeParams,
        Tombstone,
        tombstoneWaitTimeout,
        ServiceReqeust,
        OrderControllerHelper) {

        SRHelper.addMethods(Orders, $scope, $rootScope);
        OrderControllerHelper.addMethods(Orders, $scope, $rootScope);

        var statusBarLevels = [
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED_SHORT'), value: 'SUBMITTED'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_IN_PROCESS'), value: 'INPROCESS'},
        { name: $translate.instant('DEVICE_MAN.COMMON.TXT_ORDER_SHIPPED'), value: 'SHIPPED'},
        { name: $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_ORDER_DELIVERED'), value: 'DELIVERED'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_COMPLETED'), value: 'COMPLETED'}];

        $scope.editable = false; //make order summary not actionable

        $scope.isLoading = false;
        Orders.tempSpace.shipToAddress = (Devices.item._embedded.address === undefined)? Devices.item.address.item : Devices.item._embedded.address;
        $scope.scratchSpace = Orders.tempSpace;
        $scope.type = 'SUPPLIES';
        var configureSR = function(Orders){
                if(Orders.item && !Orders.item.description){
                    Orders.addField('description', '');
                }
                Orders.addRelationship('account', $scope.device, 'account');
                Orders.addRelationship('asset', $scope.device, 'self');
                Orders.addRelationship('primaryContact', $scope.device, 'contact');
                Orders.addField('type', 'SUPPLIES_ASSET_ORDER');
                
        };
       
        function getSRNumber(existingUrl) {
            $timeout(function(){
                return Orders.getAdditional(Orders.item, Tombstone, 'tombstone', true).then(function(){
                    if (existingUrl === $location.url()) {
                        if(Tombstone.item && Tombstone.item.siebelId) {
                            Orders.item.requestNumber = Tombstone.item.siebelId;
                            ServiceReqeust.item = Orders.item;
                            $location.path(Orders.route + '/catalog/supplies/receipt/notqueued');
                        } else {
                            return getSRNumber($location.url());
                        }
                    }
                });
            }, tombstoneWaitTimeout);
        }

        if (Devices.item === null) {
            Orders.item = null;
            $scope.redirectToList();
        } else if($rootScope.selectedContact &&
            $rootScope.returnPickerObject &&
            $rootScope.selectionId === Devices.item.id){
                configureSR(Orders);
                Devices.item = $rootScope.returnPickerObject;
                $scope.sr = $rootScope.returnPickerSRObject;
                Orders.addRelationship('primaryContact', $rootScope.selectedContact, 'self');
                Devices.item.contact.item = angular.copy($rootScope.selectedContact);
                $scope.resetContactPicker();

        } else if($rootScope.selectedBillToAddress && $rootScope.returnPickerObjectAddressBillTo){
            configureSR(Orders);
            $scope.sr = $rootScope.returnPickerSRObjectAddressBillTo;
            Orders.addRelationship('billToAddress', $rootScope.selectedBillToAddress, 'self');
            Orders.tempSpace.billToAddress = angular.copy($rootScope.selectedBillToAddress);
            $scope.resetAddressBillToPicker();

        } else if($rootScope.selectedShipToAddress && $rootScope.returnPickerObjectAddressShipTo){
            configureSR(Orders);
            $scope.sr = $rootScope.returnPickerSRObjectAddressShipTo;
            Orders.addRelationship('shipToAddress', $rootScope.selectedShipToAddress, 'self');
            Orders.tempSpace.shipToAddress = angular.copy($rootScope.selectedShipToAddress);
            $scope.resetAddressShipToPicker();

        } else{
            if(!Orders.tempSpace){
                Orders.tempSpace = {};
            }
            $rootScope.device = Devices.item;
        }
        function intitilize(){
            $scope.setupSR(Orders, configureSR);
            Orders.addRelationship('shipToAddress', Devices.item, 'address');
            $scope.sr.shipToAddressPhysicalLocation = {
            		physicalLocation1 : Devices.item.physicalLocation1,
            		physicalLocation2 : Devices.item.physicalLocation2,
            		physicalLocation3 : Devices.item.physicalLocation3
            };
            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate );
        }
        if($rootScope.device){
            intitilize();
            $scope.setupShipBillToAndInstallAddresses(Orders);
            $scope.getRequestor(Orders, Contacts);
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
                if(!$scope.isLoading){
                   $scope.isLoading = true;
                   if(Orders.item.requestedDeliveryDate){
                        Orders.item.requestedDeliveryDate = FormatterService.formatDateForPost(Orders.item.requestedDeliveryDate);
                   }
                   Orders.addField('attachments', $scope.files_complete);
                   Orders.addField('orderItems', OrderItems.buildSrArray());
                   var deferred = Orders.post({
                         item:  $scope.sr
                    });

                    deferred.then(function(result){
                        if(Orders.item._links['tombstone']){
                            getSRNumber($location.url());
                        }
                    }, function(reason){
                        NREUM.noticeError('Failed to create SR because: ' + reason);
                    });
                }

            };
        }

        function configureReceiptTemplate(){
            $scope.configure.order.details.translate.action = undefined;
            $timeout(function(){
                OrderItems.columns = 'pruchaseSet';
                    $scope.$broadcast('OrderContentRefresh', {
                        'OrderItems': OrderItems // send whatever you want
                    });
            }, 50);
            var submitDate = $filter('date')(new Date(), 'yyyy-MM-ddTHH:mm:ss');
            $scope.configure.statusList = $scope.setStatusBar('SUBMITTED', submitDate.toString(), statusBarLevels);
            if($routeParams.queued ==='queued'){
                $scope.configure.header.translate.h1="QUEUE.RECEIPT.TXT_TITLE";
                    $scope.configure.header.translate.h1Values = {
                        'type': $translate.instant('SERVICE_REQUEST_COMMON.TYPES.' + Orders.item.type)
                    };
                    $scope.configure.header.translate.body = "QUEUE.RECEIPT.TXT_PARA";
                    $scope.configure.header.translate.bodyValues= {
                        'srHours': 24
                    };
                    $scope.configure.header.translate.readMore = undefined;
                    $scope.configure.header.translate.action="QUEUE.RECEIPT.TXT_ACTION";
                    $scope.configure.header.translate.actionValues = {
                        actionLink: Orders.route,
                        actionName: 'Manage Orders'
                    };
                    $scope.configure.receipt = {
                        translate:{
                            title:"ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_DETAIL_SUPPLIES",
                            titleValues: {'srNumber': $translate.instant('QUEUE.RECEIPT.TXT_GENERATING_REQUEST') }
                        }
                    };
                    $scope.configure.queued = true;
            }else{
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
                $scope.configure.queued = false;
            }
            $scope.configure.detail.attachments = 'ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_ATTACHMENTS';
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
                        shipTo:{
                                translate:{
                                     shipToAddress:'ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_SHIP_TO_ADDR',
                                    shipToAction:'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_SELECT_SHIP_TO_FOR',
                                    office:'ORDER_MAN.COMMON.TXT_OFFICE',
                                    building:'ORDER_MAN.COMMON.TXT_BUILDING',
                                    floor:'ORDER_MAN.COMMON.TXT_FLOOR',
                                    instructions:'ORDER_MAN.COMMON.TXT_ORDER_DELIVERY_INSTR',
                                    instructionsNote:'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_DELIVERY_NOTE',
                                    deliveryDate:'ORDER_MAN.COMMON.TXT_ORDER_REQ_DELIV_DATE',
                                    expedite:'ORDER_MAN.SUPPLY_ORDER_REVIEW.CTRL_ORDER_EXPEDITE'
                                }
                            },
                        details:{
                            translate:{
                                title:'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_DETAILS',
                                action:'ORDER_MAN.SUPPLY_ORDER_REVIEW.LNK_CHANGE'
                            },
                            actionLink: function(){
                                $location.search('tab', 'orderTab');
                                $location.search('orderState', 'manageCurrentOrder');
                                $location.path(Devices.route +'/' + Devices.item.id +'/review');
                                Orders.backFrom = 'change';
                            },
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
                        }
                    },
                    contact:{
                        translate: {
                            title: 'ORDER_MAN.COMMON.TXT_ORDER_CONTACTS',
                            requestedByTitle: 'ORDER_MAN.COMMON.TXT_ORDER_CREATED_BY',
                            primaryTitle: 'ORDER_MAN.COMMON.TXT_ORDER_CONTACT',
                            changePrimary: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_CHANGE_CONTACT'
                        },
                        show:{
                            primaryAction : true
                        },
                        pickerObject: $scope.device,
                        source: 'OrderPurchase'
                    },
                    detail:{
                        translate:{
                            title: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_ADDL_DETAILS',
                            referenceId: 'ORDER_MAN.COMMON.TXT_ORDER_CUST_REF_ID',
                            costCenter: 'ORDER_MAN.COMMON.TXT_COST_CENTER',
                            comments: 'ORDER_MAN.COMMON.TXT_ORDER_COMMENTS',
                            attachments: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_ATTACHMENTS_SIZE',
                            attachmentMessage: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_ATTACH_FILE_FORMATS',
                            validationMessage:'ATTACHMENTS.COMMON.VALIDATION',
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
                        source: 'OrderPurchase',
                        pickerObject: $scope.device
                    },
                    shipToPicker:{
                        translate:{
                            selectedAddressTitle:''
                        },
                        returnPath: Orders.route + '/' + '/review',
                        source: 'OrderPurchase',
                        pickerObject: $scope.device
                    },
                    attachments:{
                        maxItems:2
                    }
                };
            }
        }

        if (Devices.item && !BlankCheck.isNull(Devices.item['contact']['item'])){
                $scope.formattedPrimaryContact = FormatterService.formatContact(Devices.item['contact']['item']);
        }

        if (Orders.item && !BlankCheck.isNull(Orders.tempSpace.billToAddress)){
                    $scope.scratchSpace.billToAddresssSelected = true;
                $scope.formatedBillToAddress = FormatterService.formatAddress(Orders.tempSpace.billToAddress);
        }else if(Orders.item && BlankCheck.isNull(Orders.tempSpace.billToAddress)){
                $scope.scratchSpace.billToAddresssSelected = false;
            $scope.formatedBillToAddress = FormatterService.formatNoneIfEmpty(Orders.tempSpace.billToAddress);
            }else{
                $scope.scratchSpace.billToAddresssSelected = false;
        }

        if (Orders.item && !BlankCheck.isNull(Orders.tempSpace.shipToAddress)){
                    $scope.scratchSpace.shipToAddresssSelected = true;
                $scope.formatedShipToAddress = FormatterService.formatAddress(Orders.tempSpace.shipToAddress);
        }else if(Orders.item && BlankCheck.isNull(Orders.tempSpace.shipToAddress)){
                $scope.scratchSpace.shipToAddresssSelected = false;
            $scope.formatedShipToAddress = FormatterService.formatNoneIfEmpty(Orders.tempSpace.shipToAddress);
            }else{
                $scope.scratchSpace.shipToAddresssSelected = false;
        }

        if (Orders.item){
                $scope.formattedExpedite = FormatterService.formatYesNo(Orders.item.expediteOrder);
                $scope.formattedDeliveryDate = FormatterService.formatNoneIfEmpty(
                    FormatterService.formatDate(Orders.item.requestedDeliveryDate));
                $scope.formattedPONumber = FormatterService.formatNoneIfEmpty(Orders.item.purchaseOrderNumber);
                $scope.formattedInstructions = FormatterService.formatNoneIfEmpty(Orders.item.specialHandlingInstructions);
        }
        $scope.configure.cart = Orders.tempSpace.catalogCart;
    }
]);



angular.module('mps.orders')
.controller('OrderCatalogPurchaseController', [
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
    'ServiceRequestService',
    'UserService',
    'OrderControllerHelperService',
    'tombstoneWaitTimeout',
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
        ServiceReqeust,
        Users,
        OrderControllerHelper,
        tombstoneWaitTimeout) {
        $rootScope.currentRowList = [];
        SRHelper.addMethods(Orders, $scope, $rootScope);
        OrderControllerHelper.addMethods(Orders, $scope, $rootScope);

        var statusBarLevels = [
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED_SHORT'), value: 'SUBMITTED'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_IN_PROCESS'), value: 'INPROCESS'},
        { name: $translate.instant('DEVICE_MAN.COMMON.TXT_ORDER_SHIPPED'), value: 'SHIPPED'},
        { name: $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_ORDER_DELIVERED'), value: 'DELIVERED'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_COMPLETED'), value: 'COMPLETED'}];

        $scope.print = false;
        $scope.export = false;
        $scope.taxable = false;
        $scope.editable = false; //make order summary not actionable
        $scope.hideSubmitButton = true;
        $scope.isLoading = false;
            $scope.scratchSpace = Orders.tempSpace;
            if($scope.scratchSpace && ($scope.scratchSpace.lexmarkInstallQuestion === undefined ||
                    $scope.scratchSpace.lexmarkInstallQuestion === null)){
                $scope.scratchSpace.lexmarkInstallQuestion = false;
            }

        if($routeParams.type){
            $scope.type = $routeParams.type.toUpperCase();
        }

        var configureSR = function(Orders){
                if(Orders.item && !Orders.item.description){
                    Orders.addField('description', '');
                }
                if($rootScope.currentAccount){
                    Orders.item['_links']['account'] = {
                        href: $rootScope.currentAccount.href
                    };
                }
                if(BlankCheck.isNull($scope.sr.sourceAddressPhysicalLocation)){
                    $scope.sr.sourceAddressPhysicalLocation = {};
                }
                if(BlankCheck.isNull($scope.sr.shipToAddressPhysicalLocation)){
                    $scope.sr.shipToAddressPhysicalLocation = {};
                }
                if(BlankCheck.isNull($scope.sr.destinationAddressPhysicalLocation)){
                    $scope.sr.destinationAddressPhysicalLocation = {};
                }
                Orders.addField('paymentMethod','Purchase Order');
                if(Orders && Orders.tempSpace && Orders.tempSpace.catalogCart){
                    Orders.addField('agreementId',Orders.tempSpace.catalogCart.agreement.id);
                    Orders.addField('contractNumber',Orders.tempSpace.catalogCart.contract.id);
                }
                switch($scope.type){
                    case 'SUPPLIES':
                        Orders.addField('type', 'SUPPLIES_CATALOG_ORDER');
                     break;
                     case 'HARDWARE':
                        Orders.addField('type', 'HARDWARE_ORDER');
                     break;
                     case 'ACCESSORIES':
                        Orders.addField('type', 'HARDWARE_ORDER');
                     break;
                     default:
                     break;
                }
        };

        function intitilize(){
            $scope.setupSR(Orders, configureSR);
            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate );
        }

        function getSRNumber(existingUrl) {
            $timeout(function(){
                return Orders.getAdditional(Orders.item, Tombstone, 'tombstone', true).then(function(){
                    if (existingUrl === $location.url()) {
                        if(Tombstone.item && Tombstone.item.siebelId) {
                            Orders.item.requestNumber = Tombstone.item.siebelId;
                            ServiceReqeust.item = Orders.item;
                            $location.path(Orders.route + '/catalog/' + $routeParams.type + '/receipt/notqueued');
                        } else {
                            return getSRNumber($location.url());
                        }
                    }
                });
            }, tombstoneWaitTimeout);
        }

        intitilize();
        $scope.setupShipBillToAndInstallAddresses(Orders);

        $scope.formatAdditionalData = function() {
            if(!$scope.scratchSpace){
                $scope.scratchSpace = {};
            }
            if (Orders.tempSpace && !BlankCheck.isNull(Orders.tempSpace.requestedByContact)) {
                    $scope.requestedByContactFormatted = FormatterService.formatContact(Orders.tempSpace.requestedByContact);
            }

            if (Orders.tempSpace && !BlankCheck.isNull(Orders.tempSpace.primaryContact)){
                    $scope.formattedPrimaryContact = FormatterService.formatContact(Orders.tempSpace.primaryContact);
            }
                if (Orders.tempSpace && !BlankCheck.isNull(Orders.tempSpace.installAddress)){
                    $scope.scratchSpace.installAddresssSelected = true;
                    $scope.formatedInstallAddress = FormatterService.formatAddress(Orders.tempSpace.installAddress);
                }else if(Orders.tempSpace && BlankCheck.isNull(Orders.tempSpace.installAddress)){
                    $scope.scratchSpace.installAddresssSelected = false;
                    $scope.formatedInstallAddress = FormatterService.formatNoneIfEmpty(Orders.tempSpace.installAddress);
                }else{
                    $scope.scratchSpace.installAddresssSelected = false;
                }

            if (Orders.tempSpace && !BlankCheck.isNull(Orders.tempSpace.billToAddress)){
                        $scope.scratchSpace.billToAddresssSelected = true;
                    $scope.formatedBillToAddress = FormatterService.formatAddress(Orders.tempSpace.billToAddress);
            }else if(Orders.tempSpace && BlankCheck.isNull(Orders.tempSpace.billToAddress)){
                    $scope.scratchSpace.billToAddresssSelected = false;
                $scope.formatedBillToAddress = FormatterService.formatNoneIfEmpty(Orders.tempSpace.billToAddress);
                }else{
                    $scope.scratchSpace.billToAddresssSelected = false;
            }

            if (Orders.tempSpace && !BlankCheck.isNull(Orders.tempSpace.shipToAddress)){
                $scope.scratchSpace.shipToAddresssSelected = true;
                $scope.taxable = true;
                $scope.formatedShipToAddress = FormatterService.formatAddress(Orders.tempSpace.shipToAddress);
            }else if(Orders.tempSpace && BlankCheck.isNull(Orders.tempSpace.shipToAddress)){
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
            };

            $scope.getRequestor = function(Orders, Contacts) {
            Users.getLoggedInUserInfo().then(function() {
                Users.item.links.contact().then(function() {
                    Orders.tempSpace.requestedByContact = Users.item.contact.item;
                    Orders.addRelationship('requester', Orders.tempSpace.requestedByContact, 'self');
                    if(!Orders.tempSpace.primaryContact){
                        Orders.tempSpace.primaryContact = Orders.tempSpace.requestedByContact;
                        Orders.addRelationship('primaryContact', Orders.tempSpace.requestedByContact, 'self');
                    }
                    $scope.formatAdditionalData();
                });
            });
        };

        if($rootScope.selectedContact &&
            $rootScope.returnPickerObject){
                configureSR(Orders);
                Orders.item = $rootScope.returnPickerObject;
                $scope.sr = $rootScope.returnPickerSRObject;
                Orders.addRelationship('primaryContact', $rootScope.selectedContact, 'self');
                Orders.tempSpace.primaryContact= angular.copy($rootScope.selectedContact);
                $scope.resetContactPicker();
                $scope.formatAdditionalData();

        } else if($rootScope.selectedBillToAddress && $rootScope.returnPickerObjectAddressBillTo){
            configureSR(Orders);
            $scope.sr = $rootScope.returnPickerSRObjectAddressBillTo;
            Orders.addRelationship('billToAddress', $rootScope.selectedBillToAddress, 'self');
            Orders.tempSpace.billToAddress = angular.copy($rootScope.selectedBillToAddress);
            $scope.resetAddressBillToPicker();
            $scope.formatAdditionalData();

        } else if($rootScope.selectedShipToAddress && $rootScope.returnPickerObjectAddressShipTo){
            configureSR(Orders);
            $scope.sr = $rootScope.returnPickerSRObjectAddressShipTo;
            Orders.addRelationship('shipToAddress', $rootScope.selectedShipToAddress, 'self');
            Orders.tempSpace.shipToAddress = angular.copy($rootScope.selectedShipToAddress);
            $scope.resetAddressShipToPicker();
            $scope.formatAdditionalData();
            } else if($rootScope.selectedAddress && $rootScope.returnPickerObjectAddress){
                configureSR(Orders);
                $scope.sr = $rootScope.returnPickerSRObjectAddress;
                Orders.addRelationship('sourceAddress', $rootScope.selectedAddress, 'self');
                Orders.tempSpace.installAddress = angular.copy($rootScope.selectedAddress);
                $scope.resetAddressPicker();
                $scope.formatAdditionalData();
        } else{
            configureSR(Orders);
        }


        $scope.getRequestor(Orders, Contacts);

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
                  // for(var i = 0; i < Orders.tempSpace.catalogCart.billingModels.length; ++i){
                       Orders.addField('billingModel', Orders.tempSpace.catalogCart.billingModels[0]);
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
                    //}
                }

            };
        }
            function setupConfigurationHardware(){
                 $scope.configure.header.translate.h1 = "ORDER_MAN.HARDWARE_ORDER.TXT_REGISTER_DEVICE_SUBMITTED";
                        $scope.configure.header.translate.h1Values = {};
                        $scope.configure.header.translate.body = "ORDER_MAN.HARDWARE_ORDER.RECEIPT_BODY";
                        $scope.configure.header.translate.readMore = "ORDER_MAN.SUPPLY_ORDER_SUBMITTED.LNK_MANAGE_DEVICES";
                        $scope.configure.header.readMoreUrl = Devices.route;
                        $scope.configure.header.translate.bodyValues= {
                            'orderList': FormatterService.getFormattedSRNumber($scope.sr),
                            'srHours': 24,
                            'deviceManagementUrl': 'orders/',
                        };
                        $scope.configure.receipt = {
                            translate:{
                                title:"ORDER_MAN.HARDWARE_ORDER.TXT_DEVICE_ORDER_DETAILS",
                                titleValues: {}
                            }
                        };
                    $scope.configure.queued = false;
            }
            function setupConfigurationSupplies(){
                $scope.configure.header.translate.h1 = "ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_SUBMIT_SUPPLIES";
                    if ($scope.device) {
                        $scope.configure.header.translate.h1Values = {'productModel': $scope.device.productModel};
                    }
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
                    switch($scope.type){
                        case 'HARDWARE':
                            setupConfigurationHardware();
                        break;
                        case 'SUPPLIES':
                            setupConfigurationSupplies();
                        break;
                    }
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
        $scope.formatReceiptData($scope.formatAdditionalData);
        function configureTemplates(){
            var cart;
            if(Orders && Orders.tempSpace && Orders.tempSpace.catalogCart){
                cart = Orders.tempSpace.catalogCart;
            }
                 $scope.configure = {
                    cart: cart,
                    header: {
                        translate:{
                            h1: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_REVIEW_SUPPLIES',
                            h1Values:{ },
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
                            primaryTitle: 'SERVICE_REQUEST.PRIMARY_CONTACT',
                            changePrimary: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_CHANGE_CONTACT'
                        },
                        show:{
                            primaryAction : true
                        },
                        pickerObject: Orders.item,
                        source: 'OrderCatalogPurchase'
                    },
                    detail:{
                        translate:{
                            title: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_ADDL_DETAILS',
                            referenceId: 'SERVICE_REQUEST.INTERNAL_REFERENCE_ID',
                            costCenter: 'SERVICE_REQUEST.REQUEST_COST_CENTER',
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
                    billToPicker:{
                        translate:{
                            selectedAddressTitle:'ORDER_MAN.ORDER_SELECT_BILL_TO_ADDR.TXT_ORDER_SELECT_BILL_TO'
                        },
                        pickerObject: Orders.item,
                        source: 'OrderCatalogPurchase'
                    },
                    shipToPicker:{
                        translate:{
                            selectedAddressTitle:''
                        },
                        pickerObject: Orders.item,
                        source: 'OrderCatalogPurchase'
                    },
                    attachments:{
                        maxItems:2
                    }
                };
        }
    }
]);


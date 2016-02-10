define(['angular', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.orders')
    .controller('ReturnOrdersController', [
        'SRControllerHelperService',
        '$scope',
        '$rootScope',
        'OrderRequest',
        'Contacts',
        'UserService',
        'FormatterService',
        'BlankCheck',
        'OrderTypes',
        '$timeout',
        'TombstoneService',
        '$routeParams',
        '$location',
        '$translate',
        function(
            SRHelper,
            $scope,
            $rootScope,
            Orders,
            Contacts,
            Users,
            Formatter,
            BlankCheck,
            OrderTypes,
            $timeout,
            Tombstone,
            $routeParams,
            $location,
            $translate
        ){
        SRHelper.addMethods(Orders, $scope, $rootScope);

        var configureSR = function(Orders){
                    if(!Orders.item || !Orders.item.description){
                        Orders.addField('description', '');
                    }
                    Orders.addAccountRelationship();
                    Orders.addRelationship('primaryContact', $scope.order, 'contact');
            };
            function getRequestor(Order, Contacts) {
                Users.getLoggedInUserInfo().then(function() {
                    Users.item.links.contact().then(function() {
                        if(!Order.tempSpace){
                            Order.tempSpace = {};
                        }
                        Order.tempSpace.requestedByContact = Users.item.contact.item;
                        Order.addRelationship('requester', $rootScope.currentUser, 'contact');
                        Order.tempSpace.primaryContact = Order.tempSpace.requestedByContact;
                        Order.addRelationship('primaryContact', Order.tempSpace.requestedByContact, 'self');
                        $scope.requestedByContactFormatted = Formatter.formatContact(Order.tempSpace.requestedByContact);
                        $scope.formattedPrimaryContact = Formatter.formatContact(Order.tempSpace.primaryContact);
                    });
                });
            }
            if(Orders && !Orders.item){

                Orders.newMessage();
                configureSR(Orders);
                getRequestor(Orders, Contacts);
                $rootScope.order = Orders.item;

            }else if($rootScope.selectedAddress && $rootScope.returnPickerObjectAddress){

                configureSR(Orders);
                $scope.order = $rootScope.returnPickerSRObjectAddress;
                Orders.addRelationship('shipToAddress', $rootScope.selectedAddress, 'self');
                Orders.tempSpace.address = angular.copy($rootScope.selectedAddress);
                $scope.resetAddressPicker();

            } else if($rootScope.selectedContact &&
                $rootScope.returnPickerObject){

                    configureSR(Orders);
                    Orders.item = $rootScope.returnPickerObject;
                    $scope.order = $rootScope.returnPickerSRObject;
                    Orders.addRelationship('primaryContact', $rootScope.selectedContact, 'self');
                    Orders.tempSpace.primaryContact = angular.copy($rootScope.selectedContact);
                    $scope.resetContactPicker();

            }else{
                $rootScope.order = Orders.item;
                getRequestor(Orders, Contacts);
            }
            $scope.setupSR(Orders, configureSR);

            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate );
            function configureReviewTemplate(){
                configureTemplates();
                var options = {
                    params:{
                        category:'RETURN_SUPPLY'
                    }
                };
                OrderTypes.get(options).then(function(){
                        $scope.configure.order.returnSupplies.typeList = OrderTypes.getTranslated();
                });
                $scope.configure.actions.translate.submit = 'ORDER_MAN.SUPPLY_ORDER_REVIEW.BTN_ORDER_SUBMINT_SUPPLIES';
                $scope.configure.actions.submit = function(){
                    if(!$scope.isLoading){
                       $scope.isLoading = true;

                       var deferred = Orders.post({
                             item:  $scope.order
                        });

                        deferred.then(function(result){
                            if(Orders.item._links['tombstone']){
                                $timeout(function(){
                                        Orders.getAdditional(Orders.item, Tombstone, 'tombstone', true).then(function(){
                                            if(Tombstone.item && Tombstone.item.siebelId){
                                                $location.search('tab',null);
                                                Orders.item.requestNumber = Tombstone.item.siebelId;
                                                ServiceReqeust.item = Orders.item;
                                                //$location.path(Orders.route + '/return/receipt/notqueued');
                                                console.log('not queued');
                                            }else{
                                                $location.search('tab',null);
                                               // $location.path(Orders.route + '/return/receipt/queued');
                                               console.log('queued');
                                            }
                                        });
                                    },6000);
                            }
                        }, function(reason){
                            NREUM.noticeError('Failed to create Order SR because: ' + reason);
                        });
                    }

                };
            }
            function configureReceiptTemplate(){
                if($routeParams.queued ==='queued'){
                    $scope.configure.header.translate.h1="QUEUE.RECEIPT.TXT_TITLE";
                        $scope.configure.header.translate.h1Values = {
                            'type': $translate.instant('ORDER_MAN.TYPES.' + Orders.item.type),
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
                                title:"ORDER_MAN.ORDER_SUPPLY_RETURN_RECEIPT.TXT_ORDER_DETAIL_RETURNS",
                                titleValues: {'srNumber': $translate.instant('QUEUE.RECEIPT.TXT_GENERATING_REQUEST') }
                            }
                        };
                        $scope.configure.queued = true;
                }else{
                        $scope.configure.header.translate.h1 = "ORDER_MAN.ORDER_SUPPLY_RETURN_RECEIPT.TXT_TITLE";
                        $scope.configure.header.translate.h1Values = {};
                        $scope.configure.header.translate.body = "ORDER_MAN.ORDER_SUPPLY_RETURN_RECEIPT.TXT_PARA";
                        $scope.configure.header.translate.readMore = undefined;
                        $scope.configure.header.readMoreUrl = undefined;
                        $scope.configure.header.translate.bodyValues= {
                            'srNumber': FormatterService.getFormattedSRNumber($scope.order),
                            'srHours': 24,
                            'orderUrl': Orders.route,
                        };
                        $scope.configure.receipt = {
                            translate:{
                                title:"ORDER_MAN.ORDER_SUPPLY_RETURN_RECEIPT.TXT_ORDER_DETAIL_RETURNS",
                                titleValues: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) }
                            }
                        };
                    $scope.configure.queued = false;
                }
                $scope.configure.detail.attachments = 'ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_ATTACHMENTS';
                $scope.configure.contact.show.primaryAction = false;

            }

            function configureTemplates(){
                 $scope.configure = {
                    header: {
                        translate:{
                            h1: 'ORDER_MAN.ORDER_SUPPLY_RETURN_REVIEW.TXT_TITLE',
                            h1Values: {},
                            body: 'ORDER_MAN.ORDER_SUPPLY_RETURN_REVIEW.TXT_ORDER_PAR',
                            bodyValues: '',
                            readMore: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.LNK_LEARN_MORE'
                        },
                        readMoreUrl: '#',
                        showCancelBtn: false,
                        subHeader:{
                            translate:{
                                title: 'ORDER_MAN.ORDER_SUPPLY_RETURN_REVIEW.TXT_SUB_TITLE'
                            }
                        }
                    },
                    order:{
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
                        pickerObject: $scope.order,
                        source: 'ReturnOrders'
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
                            //do nothing
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
                    }
                };
            }

            if(Orders.tempSpace && !BlankCheck.isNull(Orders.tempSpace.requestedByContact)){
                $scope.requestedByContactFormatted = Formatter.formatContact(Orders.tempSpace.requestedByContact);
            }
            if (Orders.tempSpace && !BlankCheck.isNull(Orders.tempSpace.primaryContact)){
                    $scope.formattedPrimaryContact = Formatter.formatContact(Orders.tempSpace.primaryContact);
            }
            if (Orders.tempSpace && !BlankCheck.isNull(Orders.tempSpace.address)){
                    $scope.formattedAddress = Formatter.formatAddress(Orders.tempSpace.address);
            }else if(Orders.tempSpace && BlankCheck.isNull(Orders.tempSpace.address)){
                $scope.formattedAddress = Formatter.formatNoneIfEmpty(Orders.tempSpace.address);
            }else{
                $scope.formattedAddress  = Formatter.formatNoneIfEmpty('');
            }

            $scope.formatReceiptData(function(){
                if(Orders.item){
                    $scope.formattedReason = Formatter.formatNoneIfEmpty(OrderTypes.getDisplay(Orders.item.type));
                    $scope.formattedNotes = Formatter.formatNoneIfEmpty(Orders.item.description);
                }
            });
    }]);
});

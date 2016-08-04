

angular.module('mps.orders')
.controller('ReturnOrdersController', [
    'SRControllerHelperService',
    '$scope',
    '$rootScope',
    '$filter',
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
    'SecurityHelper',
    'ServiceRequestService',
    'tombstoneWaitTimeout','$interval','tombstoneCheckCount',
    function(
        SRHelper,
        $scope,
        $rootScope,
        $filter,
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
        $translate,
        SecurityHelper,
        ServiceReqeust,
        tombstoneWaitTimeout,$interval,tombstoneCheckCount
    ){
    SRHelper.addMethods(Orders, $scope, $rootScope);
    if (Orders.item === null){
    	$location.path(Orders.route).search({tab:'orderAllTab'});
    }
    $scope.setTransactionAccount('ReturnOrders', Orders);
    new SecurityHelper($rootScope).redirectCheck($rootScope.createSuppliesReturn);

    var statusBarLevels = [
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED_SHORT'), value: 'SUBMITTED'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_IN_PROCESS'), value: 'INPROCESS'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_COMPLETED'), value: 'COMPLETED'}];

    function getSRNumber(existingUrl) {
       var intervalPromise = $interval(function(){        		
    		Orders.getAdditional(Orders.item, Tombstone, 'tombstone', true).then(function(){
    			
                if (existingUrl === $location.url()) {
                    if(Tombstone.item && Tombstone.item.siebelId) {
                        Orders.item.requestNumber = Tombstone.item.siebelId;
						ServiceReqeust.item = Orders.item;
                        $location.path(Orders.route + '/return/receipt/notqueued');
                        $interval.cancel(intervalPromise);
                    }else if(Tombstone.item.status && Tombstone.item.status.toLowerCase() === 'fail'){
                    	$location.path(Orders.route + '/return/receipt/queued');
                		$interval.cancel(intervalPromise);
                    }
                }
            });
    	}, tombstoneWaitTimeout, tombstoneCheckCount);
    	
    	intervalPromise.then(function(){
    		$location.path(Orders.route + '/return/receipt/queued');
    		$interval.cancel(intervalPromise);
    	});
    }

    function configureReviewTemplate(){
                configureTemplates();
                var options = {
                    params:{
                        category:'RETURN_SUPPLY'
                    }
                };
                OrderTypes.get(options).then(function(){
                        $scope.configure.order.returnSupplies.typeList = OrderTypes.getTranslated().filter(function(item) {
                           return item.value !== 'RETURN_SUPPLIES_ALL';
                       });
                });
                $scope.configure.actions.translate.submit = 'ORDER_MAN.SUPPLY_ORDER_REVIEW.BTN_ORDER_SUBMINT_SUPPLIES';
                $scope.configure.actions.submit = function(){
                    if(!$scope.isLoading){
                       $scope.isLoading = true;
                       Orders.addField('attachments', $scope.files_complete);
                       var deferred = Orders.post({
                             item:  $scope.order
                        });

                        deferred.then(function(result){
                            if(Orders.item._links['tombstone']){
                                getSRNumber($location.url());
                            }
                        }, function(reason){
                            NREUM.noticeError('Failed to create Order SR because: ' + reason);
                        });
                    }

                };
            }
            function configureReceiptTemplate(){
                var submitDate = $filter('date')(new Date(), 'yyyy-MM-ddTHH:mm:ss');
                $scope.configure.statusList = $scope.setStatusBar('SUBMITTED', submitDate.toString(), statusBarLevels);
                
                
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
                            'srNumber': Formatter.getFormattedSRNumber($scope.order),
                            'srHours': 24,
                            'orderUrl': Orders.route,
                        };
                        $scope.configure.receipt = {
                            translate:{
                                title:"ORDER_MAN.ORDER_SUPPLY_RETURN_RECEIPT.TXT_ORDER_DETAIL_RETURNS",
                                titleValues: {'srNumber': Formatter.getFormattedSRNumber($scope.sr) }
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
                        },
                        type: 'RETURN_SUPPLIES'
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
                        pickerObject: $scope.order,
                        source: 'ReturnOrders'
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
                    },
                    attachments:{
                        maxItems:2
                    }
                };

                $rootScope.preBreadcrumb = {
                    href: "/orders",
                    value: "ORDER_MAN.MANAGE_ORDERS.TXT_MANAGE_ORDERS"
                };
                $scope.configure.breadcrumbs = {
                    1: $rootScope.preBreadcrumb,
                    2: {
                        value: "ORDER_MAN.ORDER_SUPPLY_RETURN_REVIEW.TXT_TITLE"
                    }
                };
                
            }

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

    if($scope.inTransactionalAccountContext()){
        var configureSR = function(Orders){
                    if(!Orders.item || !Orders.item.description){
                        Orders.addField('description', '');
                    }
                    Orders.addAccountRelationship();
                    Orders.addRelationship('primaryContact', $scope.order, 'contact');
            };

            if(Orders && !Orders.item){

                Orders.newMessage();
                configureSR(Orders);
                getRequestor(Orders, Contacts);
                $rootScope.order = Orders.item;

            }else if($rootScope.selectedAddress && $rootScope.returnPickerObjectAddress){

                configureSR(Orders);
                $scope.order = $rootScope.returnPickerSRObjectAddress;
                //Orders.addRelationship('shipToAddress', $rootScope.selectedAddress, 'self');
                $scope.order.shipToAddress = {
                    id: $rootScope.selectedAddress.id,
                    name: $rootScope.selectedAddress.name,
                    storeFrontName: $rootScope.selectedAddress.storeFrontName,
                    addressLine1: $rootScope.selectedAddress.addressLine1,
                    state: $rootScope.selectedAddress.state,
                    stateFullName: $rootScope.selectedAddress.stateFullName,
                    region: $rootScope.selectedAddress.region,
                    county: $rootScope.selectedAddress.county,
                    countryCode: $rootScope.selectedAddress.countryCode,
                    country: $rootScope.selectedAddress.country,
                    postalCode: $rootScope.selectedAddress.postalCode
                };
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
                    if(Orders.item.attachments){
                        $scope.files_complete = Orders.item.attachments
                    }

            }else{
            	
                $rootScope.order = Orders.item;
                if(Orders.item.attachments){
                    $scope.files_complete = Orders.item.attachments
                }
                
                if ($routeParams.queued !=='queued' && $routeParams.queued !=='notqueued'){
                	getRequestor(Orders, Contacts);
                }
                	
            }
            $scope.setupSR(Orders, configureSR);

            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate );

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
                    $scope.formattedDescription = Formatter.formatNoneIfEmpty(Orders.item.description);
                    $scope.formattedAddress = Formatter.formatAddress(Orders.tempSpace.address);
                }
            });
        }

        $scope.$on('attachedFileSuccess', function(e, files) {
            Orders.addField('attachments', files);
        });
}]);


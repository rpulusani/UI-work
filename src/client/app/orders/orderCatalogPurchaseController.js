

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
    'TaxService',
    '$window',
    '$q',
    'HATEAOSConfig',
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
        tombstoneWaitTimeout,
        taxService,
        $window,
        $q,
        HATEAOSConfig) {
        if (Orders.item === null){
            $location.path(Orders.route).search({tab:'orderAllTab'});
        }
        $rootScope.currentRowList = [];
        SRHelper.addMethods(Orders, $scope, $rootScope);
        OrderControllerHelper.addMethods(Orders, $scope, $rootScope);
        $scope.calculatingTax = false;
        var statusBarLevels = [
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED_SHORT'), value: 'SUBMITTED'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_IN_PROCESS'), value: 'INPROCESS'},
        { name: $translate.instant('DEVICE_MAN.COMMON.TXT_ORDER_SHIPPED'), value: 'SHIPPED'},
        { name: $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_ORDER_DELIVERED'), value: 'DELIVERED'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_COMPLETED'), value: 'COMPLETED'}];
        
        if($routeParams.type){
            $scope.type = $routeParams.type.toUpperCase();
        }

        $scope.srNums = "download";
        switch($scope.type){
            case 'SUPPLIES':
                var srNumber = getNumberForMultiple();
                $scope.srNums = BlankCheck.isNullOrWhiteSpace(srNumber)? Orders.item.requestNumber : srNumber;
                break;
            case 'HARDWARE':
                $scope.srNums = getNumberForMultiple();
                break;
            case 'ACCESSORIES':
                break;
            default:
                break;
        }
        function generateCsvRows() {
            var rows = [];

            if ($scope.srNums) {
                rows.push($scope.srNums);
            } else {
                rows.push('none');
            }
           
            if ($scope.formattedPrimaryContact) {
                rows.push($scope.formattedPrimaryContact.replace(/<br\/>/g, ', '));
            } else {
                rows.push('none');
            }

            if ($scope.requestedByContactFormatted) {
                rows.push($scope.requestedByContactFormatted.replace(/<br\/>/g, ', '));
            } else {
                rows.push('none');
            }

            if ($scope.formattedReferenceId) {
                rows.push($scope.formattedReferenceId);
            } else {
                rows.push('none');
            }

            if ($scope.formattedCostCenter) {
                rows.push($scope.formattedCostCenter);
            } else {
                rows.push('none');
            }

            if ($scope.formattedNotes) {
                rows.push($scope.formattedNotes);
            } else {
                rows.push('none');
            }

            var submitDate = $filter('date')(new Date(), 'yyyy-MM-ddTHH:mm:ss');
            rows.push(submitDate.toString());
            
            if ($scope.formatedShipToAddress) {
                rows.push($scope.formatedShipToAddress.replace(/<br\/>/g, ', '));
            } else {
                rows.push('none');
            }

            if ($scope.type === "SUPPLIES" && $scope.device && $scope.device.serialNumber) {
                rows.push($scope.device.serialNumber);
                
                if ($scope.device.productModel) {
                    rows.push($scope.device.productModel);
                } else {
                    rows.push('none');
                }

                if ($scope.device.ipAddress) {
                    rows.push($scope.device.ipAddress);
                } else {
                    rows.push('none');
                }

                if ($scope.device.partNumber) {
                    rows.push($scope.device.partNumber);
                } else {
                    rows.push('none');
                }                  
            }                       
                
            if ($scope.formattedInstructions) {
                rows.push($scope.formattedInstructions.replace(/<br\/>/g, ', '));
            } else {
                rows.push('');
            }
            if ($scope.formattedDeliveryDate) {
                rows.push($scope.formattedDeliveryDate);
            } else {
                rows.push('');
            }
                
            if ($scope.formattedPONumber) {
                rows.push($scope.formattedPONumber);
            } else {
                rows.push('');
            }                       

            return rows;
        }
        function buildOrderTableBody(headers) {
            var body = [],
            headersLen = headers.length,
            headersInd = 0,
            pdfHeaders = [];
            
            for (headersInd; headersInd < headersLen; headersInd += 1) {
               pdfHeaders.push({text: headers[headersInd], fontSize: 8});
            }
            body.push(pdfHeaders);

            if(OrderItems.data && OrderItems.data !== null
                && OrderItems.data.length > 0) {
                var orderLen = OrderItems.data.length,
                orderItem = [],
                orderInd = 0;

                for(orderInd; orderInd<orderLen; orderInd++) {
                    var dataRow = [],
                    orderHeaderInd = 0;
                    orderItem = OrderItems.data[orderInd];
                    orderPrice = priceCurrencyFormat(orderItem);
                    orderSubTotal = itemSubTotal(orderItem);

                    for (orderHeaderInd; orderHeaderInd < headersLen; orderHeaderInd += 1) {                        
                        switch(headers[orderHeaderInd]) {
                            case 'Supply Type':
                                if (orderItem.type) {
                                    dataRow.push({text: orderItem.type, fontSize: 8});
                                } else {
                                    dataRow.push({text: '', fontSize: 8});
                                }
                            break;
                            case 'Part Number':
                                if (orderItem.displayItemNumber) {
                                    dataRow.push({text: orderItem.displayItemNumber, fontSize: 8});
                                } else {
                                    dataRow.push({text: '', fontSize: 8});
                                }
                            break;
                            case 'Price':
                                if (orderPrice) {
                                    dataRow.push({text: orderPrice, fontSize: 8});
                                } else {
                                    dataRow.push({text: '', fontSize: 8});
                                }
                            break;
                            case 'Quantity':
                                if (orderItem.quantity) {
                                    dataRow.push({text: orderItem.quantity.toString(), fontSize: 8});
                                } else {
                                    dataRow.push({text: '', fontSize: 8});
                                }
                            break;
                            case 'Subtotal':
                                if (orderSubTotal) {
                                    dataRow.push({text: orderSubTotal, fontSize: 8});
                                } else {
                                    dataRow.push({text: '', fontSize: 8});
                                }
                            break;
                        }
                    }
                    body.push(dataRow);
                }
            }
            return body;
        }
        function generateCsvOrderDetails(headers) {
            var orderDetails = '';
            if(OrderItems.data && OrderItems.data !== null
                && OrderItems.data.length > 0) {
                var orderLen = OrderItems.data.length,
                orderItem = [],
                orderInd = 0,
                headersLen = headers.length;                

                for(orderInd; orderInd<orderLen; orderInd++) {
                    var orderHeaderInd = 0;
                    orderItem = OrderItems.data[orderInd];
                    orderPrice = priceCurrencyFormat(orderItem);
                    orderSubTotal = itemSubTotal(orderItem);

                    for (orderHeaderInd; orderHeaderInd < headersLen; orderHeaderInd += 1) {
                        switch(headers[orderHeaderInd]) {
                            case 'Supply Type':
                                orderDetails = orderDetails + 'Supply Type: ';                                
                                if (orderItem.type) {
                                    orderDetails = orderDetails + orderItem.type + ', ';
                                } else {
                                    orderDetails = orderDetails + ', ';
                                }
                            break;
                            case 'Part Number':
                                orderDetails = orderDetails + 'Part Number: ';
                                if (orderItem.displayItemNumber) {
                                    orderDetails = orderDetails + orderItem.displayItemNumber + ', ';
                                } else {
                                    orderDetails = orderDetails + ', ';
                                }
                            break;
                            case 'Price':
                                orderDetails = orderDetails + 'Price: ';
                                if (orderPrice) {
                                    orderDetails = orderDetails + orderPrice + ', ';
                                } else {
                                    orderDetails = orderDetails + ', ';
                                }
                            break;
                            case 'Quantity':
                                orderDetails = orderDetails + 'Quantity: ';
                                if (orderItem.quantity) {
                                    orderDetails = orderDetails + orderItem.quantity.toString() + ', ';
                                } else {
                                    orderDetails = orderDetails + ', ';
                                }
                            break;
                            case 'Subtotal':
                                orderDetails = orderDetails + 'Subtotal: ';
                                if (orderSubTotal) {
                                    orderDetails = orderDetails + orderSubTotal + ', ';
                                } else {
                                    orderDetails = orderDetails + ', ';
                                }
                            break;
                        }
                    }
                    orderDetails = orderDetails + '\r\n';
                }
            }
            return orderDetails;
        }
        function priceCurrencyFormat(orderItem) {
            if (orderItem.billingModel === 'USAGE_BASED_BILLING'){
                return $translate.instant('ORDER_MAN.COMMON.TEXT_INCLUDED_IN_LEASE');
            } else {
                return FormatterService.formatCurrency(orderItem.price);
            }
        }
        function itemSubTotal(orderItem) {
            if (orderItem.billingModel === 'USAGE_BASED_BILLING'){
                return '-';
            } else {
                var subTotal = FormatterService.itemSubTotal(orderItem.price, orderItem.quantity);
                return FormatterService.formatCurrency(subTotal);  
            }
        }
        function showOrderDetailsText() {
            var orderText = '\r\nOrder Details';
            return orderText;
        }

        function setCsvDefinition() {
            var headers = [
                'Request Numbers',
                'Primary Contact',
                'Requested By Contact',
                'Internal Reference ID',
                'CostCenter',
                'Comments',
                'Created',
                'Ship To Address'
            ],
            rows = generateCsvRows(),            
            orderHeaders = [
                'Supply Type',
                'Part Number',
                'Price',
                'Quantity',
                'Subtotal'
            ],
            csvHeaders = [],
            csvRows = [],
            i = 0;

            csvRows = rows;            

            if ($scope.type === "SUPPLIES" && $scope.device && $scope.device.serialNumber) {
                headers.push('Serial Number');
                headers.push('Product Model');
                headers.push('IpAddress');
                headers.push('PartNumber');
            }
            
            headers.push('Delivery Instructions');
            headers.push('Requested Delivery Date');                
            headers.push('Purchase Order Number');     
                     

            var pdfHeaders1 = [],
            pdfRows1 = [],
            pdfHeaders2 = [],
            pdfRows2 = [];
            var pdfFirstHeaderColumnsCnt = 8;
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
                },
                {text: showOrderDetailsText()},
                {
                  table: {
                    headerRows: 1,
                    body: buildOrderTableBody(orderHeaders)
                  }
                }
              ]
            };

            headers.push('Order Details');
            csvRows.push(generateCsvOrderDetails(orderHeaders));
                         
            $scope.csvModel = {
                filename: $scope.srNums + '.csv',
                headers: headers,
                // rows are just property names found on the dataObj
                rows: csvRows
            };
        }

        $scope.print = false;
        $scope.export = false;
        $scope.taxable = false;
        $scope.editable = false; //make order summary not actionable
        $scope.errorAddress = false; // showing shiptoaddress error & billtoAddress error
        $scope.hideSubmitButton = true;
        $scope.isLoading = false;
        
        
        $scope.min = FormatterService.formatLocalDateForRome(new Date());//This is used in date Picker

        if(Orders.tempSpace === undefined){
        	// If the page is refreshed.
        	$location.path('/orders');
            $location.search('tab', 'orderAllTab');
            return;
        }
            $scope.scratchSpace = Orders.tempSpace;
            if($scope.scratchSpace && ($scope.scratchSpace.lexmarkInstallQuestion === undefined ||
                    $scope.scratchSpace.lexmarkInstallQuestion === null)){
                $scope.scratchSpace.lexmarkInstallQuestion = false;
            }
        
        var configureSR = function(Orders){
                if(Orders.item && !Orders.item.description){
                    Orders.addField('description', '');
                }
                if($rootScope.currentAccount){
                    Orders.item['_links']['account'] = {
                        href: $rootScope.currentAccount.href
                    };
                    $scope.sr.soldToNumber = Orders.tempSpace.catalogCart.contract.soldToNumber;
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
                if(Orders && Orders.tempSpace && Orders.tempSpace.catalogCart && Orders.tempSpace.catalogCart.agreement){
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
            	
            	 for (var i=0; i < $scope.savedSR.length; i++){
            		 if (!$scope.savedSR[i].saved){
            			 return Orders.getAdditional($scope.savedSR[i], Tombstone, 'tombstone', true).then(function(){
                             if (existingUrl === $location.url()) {
                                 if(Tombstone.item && Tombstone.item.siebelId) {
                                     //Orders.item.requestNumber = Tombstone.item.siebelId;
                                     $scope.savedSR[i].saved = true;
                                     
                                     Orders.confirmedSavedSR.push(Tombstone.item);
                                    // ServiceReqeust.item = Orders.item;
                                    // $location.path(Orders.route + '/catalog/' + $routeParams.type + '/receipt/notqueued');
                                     
                                     if ( Orders.confirmedSavedSR.length === $scope.savedSR.length) {
                                         $location.path(Orders.route + '/catalog/' + $routeParams.type + '/receipt/notqueued');
                                     } else {
                                         return getSRNumber($location.url());
                                     }
                                     
                                     
                                 } else {
                                     return getSRNumber($location.url());
                                 }
                             }
                         });
            		 }
            	 }
            	
                
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
            if (Devices.item && Devices.item.contact && !BlankCheck.isNull(Devices.item['contact']['item'] === undefined ? Devices.item['contact'] : Devices.item['contact']['item'])){
                $scope.formattedPrimaryContact = FormatterService.formatContact(Devices.item['contact']['item'] === undefined ? Devices.item['contact'] : Devices.item['contact']['item']);
            }
            if($scope.type === 'SUPPLIES' || ($scope.type === 'HARDWARE' && $rootScope.orderInstall) ){
            	
            	if (Orders.tempSpace && !BlankCheck.isNull(Orders.tempSpace.installAddress)){
            		
                    $scope.scratchSpace.installAddresssSelected = true;
                    $scope.formatedInstallAddress = FormatterService.formatAddress(Orders.tempSpace.installAddress);
                }else if(Orders.tempSpace && BlankCheck.isNull(Orders.tempSpace.installAddress)){
                    $scope.scratchSpace.installAddresssSelected = false;
                    //$scope.formatedInstallAddress = FormatterService.formatNoneIfEmpty(Orders.tempSpace.installAddress);
                }else{
                    $scope.scratchSpace.installAddresssSelected = false;
                }
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
                if($scope.sr.shipToAddressPhysicalLocation !== undefined){
                	$scope.formatedShipToAddress +=  FormatterService.addBuildingFloorOffice($scope.sr.shipToAddressPhysicalLocation);
                }
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
                taxService.addRelationship('primaryContact', $rootScope.selectedContact, 'self');
                Orders.tempSpace.primaryContact= angular.copy($rootScope.selectedContact);
                $scope.resetContactPicker();
                $scope.formatAdditionalData();
                if(OrderItems.taxAmount){
                    $rootScope.taxAvailableOnReturnChangeContact = OrderItems.taxAmount;
                }
                if(Orders.item.attachments){
                    $scope.files_complete = Orders.item.attachments
                }

        } else if($rootScope.selectedBillToAddress && $rootScope.returnPickerObjectAddressBillTo){
            configureSR(Orders);
            $scope.sr = $rootScope.returnPickerSRObjectAddressBillTo;
            Orders.addRelationship('billToAddress', $rootScope.selectedBillToAddress, 'self');
            
            
            Orders.tempSpace.billToAddress = angular.copy($rootScope.selectedBillToAddress);
            Orders.addField('billToNumber', Orders.tempSpace.billToAddress.billToNumber);
            callTax();
            $scope.resetAddressBillToPicker();
            $scope.formatAdditionalData();

        } else if($rootScope.selectedShipToAddress && $rootScope.returnPickerObjectAddressShipTo){
            configureSR(Orders);
            $scope.sr = $rootScope.returnPickerSRObjectAddressShipTo;
            Orders.addRelationship('shipToAddress', $rootScope.selectedShipToAddress, 'self');
            
            
            Orders.tempSpace.shipToAddress = angular.copy($rootScope.selectedShipToAddress);
            callTax();
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
            if(Orders.item.attachments){
                $scope.files_complete = Orders.item.attachments
            }
            if(Orders.item._links.shipToAddress && Orders.item.billToNumber){
                callTax();
            }
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

            $scope.configure.actions.translate.submit = ($scope.type === "HARDWARE"? 'ORDER_MAN.SUPPLY_ORDER_REVIEW.BTN_ORDER_SUBMINT_HARDWARE' : 'ORDER_MAN.SUPPLY_ORDER_REVIEW.BTN_ORDER_SUBMINT_SUPPLIES');
            $scope.configure.actions.submit = function(){
            	if(!$scope.scratchSpace.shipToAddresssSelected){
            		$scope.errorAddress = true;
            		$scope.errorMessage = $translate.instant('ORDER_MAN.ERROR.SELECT_SHIPTO');
                    $('.site-content').scrollTop($('.page-header').height());
            		return;
            	} 
            	if( ($scope.paymentMethod === 'payNow' || $scope.paymentMethod === 'SHIP_AND_BILL')  && !$scope.scratchSpace.billToAddresssSelected){
            		$scope.errorAddress = true;
            		$scope.errorMessage = $translate.instant('ORDER_MAN.ERROR.SELECT_BILLTO');
                    $('.site-content').scrollTop($('.page-header').height());
            		return;
            	}
            	if($scope.calculatingTax){
            		return;
            	}
            	
                if(!$scope.isLoading){ 
                   $scope.isLoading = true;
                   var deffereds = [];
                   $scope.savedSR = [];
                   var partsGroupedByBiling = OrderItems.groupPartsByBillingModel(),billingModel;
                   
                   for (billingModel in partsGroupedByBiling){     
                	   
                	   
                	   Orders.addField('billingModel', billingModel);
                       if(Orders.item.requestedDeliveryDate){
                            Orders.item.requestedDeliveryDate = FormatterService.formatDateForPost(Orders.item.requestedDeliveryDate);
                       }
                       Orders.addField('attachments', $scope.files_complete);
                       Orders.addField('orderItems', OrderItems.buildGroupedSrArray(partsGroupedByBiling[billingModel],Orders.tempSpace.catalogCart.catalog));
                        

                       deffereds.push(Orders.post({
                             item:  JSON.parse(JSON.stringify($scope.sr))
                       }).then(function(res){
                        	$scope.savedSR.push(res.data);
                       }));
                       
                      

                   }
                   
                   $q.all(deffereds).then(function(result) {
                	   if(Orders.item._links['tombstone']){
                		   Orders.confirmedSavedSR = [];
                           getSRNumber($location.url());
                       }
                   }, function(reason){
                           NREUM.noticeError('Failed to create SR because: ' + reason);
                   });
               }

            };
        }
        
        
            function setupConfigurationHardware(){
                 $scope.configure.header.translate.h1 = "ORDER_MAN.HARDWARE_ORDER.TXT_REGISTER_DEVICE_SUBMITTED";
                        $scope.configure.header.translate.h1Values = {};
                        $scope.configure.header.translate.body = "ORDER_MAN.HARDWARE_ORDER.RECEIPT_BODY";
                        $scope.configure.header.translate.readMore = "ORDER_MAN.COMMON.LNK_MANAGE_ORDERS";
                        $scope.configure.header.readMoreUrl = Orders.route;
                        $scope.configure.header.translate.bodyValues= {
                            'orderList': getNumberForMultiple(),
                            'srHours': 24,
                            'deviceManagementUrl': 'orders/',
                        };
                        $scope.configure.receipt = {
                            translate:{
                                title:"ORDER_MAN.HARDWARE_ORDER.TXT_DEVICE_ORDER_DETAILS",
                                titleValues: {'srNumber': getNumberForMultiple()}
                            }
                        };
                    $scope.configure.queued = false;
                    $scope.configure.breadcrumbs = {
                        1: $rootScope.preBreadcrumb,
                        2: {
                            value: "ORDER_MAN.HARDWARE_ORDER.TXT_REGISTER_DEVICE_SUBMITTED"
                        }
                    };
            }
            function setupConfigurationSupplies(){
            	
            	var srNum = getNumberForMultiple();
            	srNum= BlankCheck.isNullOrWhiteSpace(srNum)? Orders.item.requestNumber : srNum;
                $scope.configure.header.translate.h1 = "ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_SUBMIT_SUPPLIES";
                    if ($scope.device) {
                        $scope.configure.header.translate.h1Values = {'productModel': $scope.device.productModel};
                    }
                    $scope.configure.header.translate.body = "ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_SUBMITTED_PAR";
                    $scope.configure.header.translate.readMore = "ORDER_MAN.SUPPLY_ORDER_SUBMITTED.LNK_MANAGE_DEVICES";
                    $scope.configure.header.readMoreUrl = Devices.route;
                    $scope.configure.header.translate.bodyValues= {
                        'order': srNum,
                        'srHours': 24,
                        'deviceManagementUrl': 'device_management/',
                    };
                    $scope.configure.receipt = {
                        translate:{
                            title:"ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_DETAIL_SUPPLIES",
                            titleValues: {'srNumber': srNum }
                        }
                    };
                $scope.configure.queued = false;
                $scope.ordernbr = srNum;
            }

        function configureReceiptTemplate(){
            $scope.configure.order.details.translate.action = undefined;
            $timeout(function(){
                switch($scope.type){
                        case 'HARDWARE':
                            OrderItems.columns = 'pruchaseSet';
                        break;
                        case 'SUPPLIES':
                            OrderItems.columns = 'pruchaseSubmitSet';
                        break;
                    }
                
                   /* $scope.$broadcast('OrderContentRefresh', {
                        'OrderItems': OrderItems // send whatever you want
                    });*/
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
            
            $scope.configure.orderItems = {
            		multipleSr : OrderItems.groupPartsByBillingModel()	
            };
            $scope.configure.orderItems.srMap = getBillingModelSRMap();
            $scope.configure.orderItems.taxAmount = OrderItems.taxAmount;
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
                            h1: ($scope.type === "HARDWARE"? 'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_REVIEW_HARDWARE' : 'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_REVIEW_SUPPLIES'),
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
                            	if ($scope.type === "HARDWARE"){
                            		 $location.path(Orders.route + '/catalog/hardware/cart');
                            	} else if ($scope.type === "SUPPLIES"){
                            		 $location.path(Orders.route + '/catalog/supplies/cart');                            		
                            	} else {
                            		$location.search('tab', 'orderTab');
                                    $location.search('orderState', 'manageCurrentOrder');
                                    $location.path(Devices.route +'/' + Devices.item.id +'/review');
                            	}
                                
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
                            submit: ($scope.type === "HARDWARE"? 'ORDER_MAN.SUPPLY_ORDER_REVIEW.BTN_ORDER_SUBMINT_HARDWARE' : 'ORDER_MAN.SUPPLY_ORDER_REVIEW.BTN_ORDER_SUBMINT_SUPPLIES')
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
                        returnPath: (Orders.sourcePage.indexOf('device_management') !== -1?Orders.sourcePage : Orders.route + '/')
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
                    installPicker:{
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
                $rootScope.preBreadcrumb = {
                    href: "/orders",
                    value: "ORDER_MAN.MANAGE_ORDERS.TXT_MANAGE_ORDERS"
                };
                if($scope.type === 'SUPPLIES'){
                    $scope.configure.breadcrumbs = {
                        1: $rootScope.preBreadcrumb,
                        2: {
                            value: "ORDER_CATALOGS.SUPPLIES_CATALOG.TXT_SUPPLIES_CATALOG_ORDER"
                        }
                    };
                }
                if($scope.type === 'HARDWARE'){
                    $scope.configure.breadcrumbs = {
                        1: $rootScope.preBreadcrumb,
                        2: {
                            value: "ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_REVIEW_HARDWARE"
                        }
                    };
                }
        }
        function callTax(){
        	
        	
        	taxService.addRelationship('shipToAddress', Orders.tempSpace.shipToAddress, 'self');
        	taxService.addRelationship('billToAddress', Orders.tempSpace.billToAddress, 'self');
        	
        	if (taxService.getRelationship('shipToAddress',taxService.item) !== undefined 
        			&& taxService.getRelationship('billToAddress',taxService.item) !== undefined){
        		var i = 0,j = 0,hasShipBill = false,itemNumber;
            	for(;i<Orders.tempSpace.catalogCart.billingModels.length;i++){
            		if(Orders.tempSpace.catalogCart.billingModels[i] === 'SHIP_AND_BILL'){
            			hasShipBill = true;
            			break;
            		}
            	}
            	if(hasShipBill){
            		
            		taxService.addAccountRelationship();            	
                	taxService.addField('agreementId',Orders.tempSpace.catalogCart.agreement.id);
                	taxService.addField('contractNumber',Orders.tempSpace.catalogCart.contract.id);
                	taxService.addField('salesOrganization', Orders.tempSpace.catalogCart.contract.salesOrganization);
                	taxService.addField('billingModel', 'SHIP_AND_BILL');
                	var taxItems = [];
                	for(i = 0; i < OrderItems.data.length; ++i){
                        var lineTotal = FormatterService.itemSubTotal(OrderItems.data[i].price, OrderItems.data[i].quantity);
                        
                        if (lineTotal !== 0){
                        	itemNumber = OrderItems.data[i].displayItemNumber;
                        	if($scope.type === 'HARDWARE' && OrderItems.data[i].childItems && OrderItems.data[i].childItems[0]){
                        		itemNumber = OrderItems.data[i].childItems[0].displayItemNumber;                        		
                        	}
                        	taxItems.push({
                            	itemNumber : itemNumber,
                            	price : lineTotal
                            });
                        }
                        
                    }
                	taxService.addField('orderItems',taxItems);
                	$scope.calculatingTax = true;
                    taxService.post(taxService).then(function(response){
                    	$scope.calculatingTax = false;
                    	var total = 0.0,taxAmount = null;
                    	if(response.data.orderItems){
                    		
                        	for(i=0;i<response.data.orderItems.length;i++){
                        		for(j=0;j<OrderItems.data.length;j++){
                        			if($scope.type === 'HARDWARE' && OrderItems.data[j].childItems){
                        				itemNumber = OrderItems.data[j].childItems[0].displayItemNumber; 
                        			}
                        			if(itemNumber === response.data.orderItems[i].itemNumber){
                        				OrderItems.data[j].tax = response.data.orderItems[i].tax;
                        				break;
                        			}
                        		}
                        		total += response.data.orderItems[i].tax;
                        	}
                        	taxAmount = total;
                        	OrderItems.taxAmount = taxAmount;
                    	}
                    	
                    	$scope.$broadcast('TaxDataAvaialable', {'tax':taxAmount});
                    	taxService.newMessage();
                    	
                    });
                	
            	}
        	}else{
        		OrderItems.taxAmount = null;
        	}

        }; 
        
        
        //// Below section is for multiple sr's receipt.. 
        function getNumberForMultiple(){
        	var srNums = [];
        	if (Orders.confirmedSavedSR && angular.isArray(Orders.confirmedSavedSR) && Orders.confirmedSavedSR.length > 0) {
           	 for (var i=0; i < Orders.confirmedSavedSR.length; i++) {
           		srNums.push(Orders.confirmedSavedSR[i].siebelId);            		 
                }
           }
        	return srNums.join(","); 
        }
        
        function getBillingModelSRMap(){
        	var objBillingSr = {},i,billngModel;
        	if (Orders.confirmedSavedSR && angular.isArray(Orders.confirmedSavedSR) && Orders.confirmedSavedSR.length > 0) {
           	 for (i=0; i < Orders.confirmedSavedSR.length; i++) {
           		 // Below we will map 'billingmodel' : 'srNumber'
           		billngModel = Orders.confirmedSavedSR[i].tombstonePayload.billingModel;
           		 objBillingSr[billngModel] ={
           				 message : 'ORDER_MAN.MANAGE_ORDERS.'+billngModel,
           				 siebelId :Orders.confirmedSavedSR[i].siebelId 
           		 }; 
           		 
                }
           }
        	return objBillingSr;
        }
        
        setCsvDefinition();
        $scope.$on('attachedFileSuccess', function(e, files) {
            Orders.addField('attachments', files);
        });
     }
]);


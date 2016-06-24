angular.module('mps.serviceRequests')
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

        if(!Orders.item && !ServiceRequest.item){
            
            if($location.path().indexOf('/orders')>=0){
                $location.path(Orders.route).search({tab:'orderAllTab'});   
            }
            else if($location.path().indexOf('/service_requests')>=0){
                $location.path(ServiceRequest.route).search({tab:'serviceRequestsAllTab'});
            }
            return;
        }
        $('.site-content').scrollTop(0,0);
        var statusBarLevels = [
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED_SHORT'), value: 'SUBMITTED'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_IN_PROCESS'), value: 'INPROCESS'},
        { name: $translate.instant('DEVICE_MAN.COMMON.TXT_ORDER_SHIPPED'), value: 'SHIPPED'},
        { name: $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_ORDER_DELIVERED'), value: 'DELIVERED'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_COMPLETED'), value: 'COMPLETED'}],

        statusBarLevelsShort = [
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED_SHORT'), value: 'SUBMITTED'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_IN_PROCESS'), value: 'INPROCESS'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_COMPLETED'), value: 'COMPLETED'}];
        var generateCsvRows = function() {
            var rows = [];

            if ($scope.sr.requestNumber) {
                rows.push($scope.sr.requestNumber);
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

            if ($scope.sr.createDate) {
                rows.push($scope.sr.createDate);
            } else {
                rows.push('none');
            }

            if ($scope.sr.type !== 'DATA_CONTACT_CHANGE') {
                if ($scope.formattedAddress) {
                    rows.push($scope.formattedAddress.replace(/<br\/>/g, ', '));
                } else {
                    rows.push('');
                }                
            } else {
                if ($scope.formattedPrimaryContactAddress) {
                    rows.push($scope.formattedPrimaryContactAddress.replace(/<br\/>/g, ', '));
                } else {
                    rows.push('');
                }                
            }

            if ($scope.device.serialNumber) {
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
                
                if ($scope.sr.type.indexOf("BREAK_FIX") >= 0) {                    
                    if ($scope.formattedDescription) {
                        rows.push($scope.formattedDescription);
                    } else {
                        rows.push('none');
                    }
                }                    
            }

            if ($scope.sr.type === 'DATA_ASSET_CHANGE' || $scope.sr.type === 'MADC_DECOMMISSION'
                || $scope.sr.type === 'DATA_ASSET_DEREGISTER') {
                if ($scope.sr.type === 'DATA_ASSET_CHANGE') {
                    if ($scope.formattedMoveDevice) {
                        rows.push($scope.formattedMoveDevice);
                    } else {
                        rows.push('');
                    }
                } else {
                    if($scope.sr.type === 'MADC_DECOMMISSION') {
                        if ($scope.formattedPickupDevice) {
                            rows.push($scope.formattedPickupDevice);
                        } else {
                            rows.push('');
                        }
                    }
                     
                    if ($scope.meterReadsForCsv && $scope.meterReadsForCsv.length > 0) {
                        rows.push($scope.meterReadsForCsv);                        
                    } else {
                        rows.push('none');
                    }
                }
            }

            if ($scope.formattedDeviceMoveAddress) {
                rows.push($scope.formattedDeviceMoveAddress.replace(/<br\/>/g, ', '));
            }           

            if($scope.sr.type === 'SUPPLIES_CATALOG_ORDER' ||
              $scope.sr.type === 'HARDWARE_ORDER' ||
              $scope.sr.type === 'SVC_CATALOG_ORDER') {
                
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
            }           

            return rows;
        },
        buildOrderTableBody = function(headers) {
            var body = [],
            headersLen = headers.length,
            headersInd = 0,
            pdfHeaders = [];
            
            if($scope.sr.type !== 'SUPPLIES_CATALOG_ORDER' &&
              $scope.sr.type !== 'HARDWARE_ORDER' &&
              $scope.sr.type !== 'SVC_CATALOG_ORDER') {
               body = [[],[]];
               return body;
            }
            for (headersInd; headersInd < headersLen; headersInd += 1) {
               pdfHeaders.push({text: headers[headersInd], fontSize: 8});
            }
            body.push(pdfHeaders);

            if($scope.sr.item.orderItems && $scope.sr.item.orderItems !== null
                && $scope.sr.item.orderItems.length > 0) {
                var orderLen = $scope.sr.item.orderItems.length,
                orderItem = [],
                orderInd = 0;

                for(orderInd; orderInd<orderLen; orderInd++) {
                    var dataRow = [],
                    orderHeaderInd = 0;
                    orderItem = $scope.sr.item.orderItems[orderInd];
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
        },
        generateCsvOrderDetails = function(headers) {
            var orderDetails = '';
            if($scope.sr.item.orderItems && $scope.sr.item.orderItems !== null
                && $scope.sr.item.orderItems.length > 0) {
                var orderLen = $scope.sr.item.orderItems.length,
                orderItem = [],
                orderInd = 0,
                headersLen = headers.length;                

                for(orderInd; orderInd<orderLen; orderInd++) {
                    var orderHeaderInd = 0;
                    orderItem = $scope.sr.item.orderItems[orderInd];
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
        },
        priceCurrencyFormat = function(orderItem) {
            if (orderItem.billingModel === 'USAGE_BASED_BILLING'){
                return $translate.instant('ORDER_MAN.COMMON.TEXT_INCLUDED_IN_LEASE');
            } else {
                return FormatterService.formatCurrency(orderItem.price);
            }
        },
        itemSubTotal = function(orderItem) {
            if (orderItem.billingModel === 'USAGE_BASED_BILLING'){
                return '-';
            } else {
                var subTotal = FormatterService.itemSubTotal(orderItem.price, orderItem.quantity);
                return FormatterService.formatCurrency(subTotal);  
            }
        },
        showOrderDetailsText = function() {
            var orderText = '';
            if($scope.sr.type === 'SUPPLIES_CATALOG_ORDER' ||
              $scope.sr.type === 'HARDWARE_ORDER' ||
              $scope.sr.type === 'SVC_CATALOG_ORDER') {
                orderText = '\r\nOrder Details';
            }
            return orderText;
        }
        setCsvDefinition = function() {
            var headers = [
                'Request Number',
                'Primary Contact',
                'Requested By Contact',
                'Customer ReferenceId',
                'CostCenter',
                'Comments',
                'Created'
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

            if ($scope.sr.type !== 'DATA_CONTACT_CHANGE') {
                if($scope.sr.type === 'SUPPLIES_CATALOG_ORDER' ||                  
                  $scope.sr.type === 'SVC_CATALOG_ORDER' ||
                  $scope.sr.type === 'HARDWARE_ORDER') {
                    headers.push('Ship To Address');
                }
                else {
                    headers.push('Address');
                }
            } else {
                headers.push('Primary Contact Address');                
            }

            if ($scope.device.serialNumber) {
                headers.push('Serial Number');
                headers.push('Product Model');
                headers.push('IpAddress');
                headers.push('PartNumber');

                if ($scope.sr.type.indexOf("BREAK_FIX") >= 0) {
                    headers.push('Problem Description');
                }                    
            }

            if ($scope.sr.type === 'DATA_ASSET_CHANGE' || $scope.sr.type === 'MADC_DECOMMISSION'
                || $scope.sr.type === 'DATA_ASSET_DEREGISTER') {
                if ($scope.sr.type === 'DATA_ASSET_CHANGE') {
                    headers.push('Lexmark To Move');
                } else {
                    if($scope.sr.type === 'MADC_DECOMMISSION') {
                        headers.push('Lexmark To Pickup');
                    }                        
                    headers.push('PageCounts');                    
                }
            }            

            if ($scope.formattedDeviceMoveAddress) {
                headers.push('Move Address');  
            }

            if($scope.sr.type === 'SUPPLIES_CATALOG_ORDER' ||
              $scope.sr.type === 'HARDWARE_ORDER' ||
              $scope.sr.type === 'SVC_CATALOG_ORDER') {                
                headers.push('Delivery Instructions');
                headers.push('Requested Delivery Date');                
                headers.push('Purchase Order Number');                
            }          

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

            if($scope.sr.type === 'SUPPLIES_CATALOG_ORDER' ||
              $scope.sr.type === 'HARDWARE_ORDER' ||
              $scope.sr.type === 'SVC_CATALOG_ORDER') {
                headers.push('Order Details');
                csvRows.push(generateCsvOrderDetails(orderHeaders));
            }
                        
            $scope.csvModel = {
                filename: $scope.sr.id + '.csv',
                headers: headers,
                // rows are just property names found on the dataObj
                rows: csvRows
            };
        };

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
                        title: 'REQUEST_MAN.COMMON.TXT_REQUEST_CONTACTS',
                        requestedByTitle: 'REQUEST_MAN.COMMON.TXT_REQUEST_CREATED_BY',
                        primaryTitle: 'REQUEST_MAN.COMMON.TXT_REQUEST_CONTACT',
                        changePrimary: 'REQUEST_MAN.REQUEST_DEVICE_UPDATE.LNK_CHANGE_REQUEST_CONTACT'
                },
                show:{
                    primaryAction : false
                },
                source: 'DeviceServiceRequestDevice'
            },
            detail:{
                translate:{
                        title: 'REQUEST_MAN.COMMON.TXT_REQUEST_ADDL_DETAILS',
                        referenceId: 'REQUEST_MAN.COMMON.TXT_REQUEST_CUST_REF_ID',
                        costCenter: 'REQUEST_MAN.COMMON.TXT_REQUEST_COST_CENTER',
                        comments: 'REQUEST_MAN.COMMON.TXT_REQUEST_COMMENTS',
                        attachments: 'REQUEST_MAN.COMMON.TXT_REQUEST_ATTACHMENTS',
                        attachmentMessage: 'REQUEST_MAN.COMMON.TXT_REQUEST_ATTACHMENTS_SIZE',
                        validationMessage:'ATTACHMENTS.COMMON.VALIDATION',
                    fileList: ['.csv', '.xls', '.xlsx', '.vsd', '.doc', '.docx', '.ppt', '.pptx', '.pdf', '.zip'].join(', ')
                },
                show:{
                    referenceId: true,
                    costCenter: true,
                    comments : true,
                    attachements : true
                }
            },
            attachments:{
                maxItems:2
            },
            statusList: $scope.setStatusBar($scope.sr.status, $scope.sr.statusDate, statusBarLevelsShort)
        };

        if ($scope.sr.type === 'SUPPLIES_PROACTIVE_ORDER') {
             $scope.configure.breadcrumbs = {
                1: {
                    href: '/orders',
                    value: 'SERVICE_REQUEST.ORDERS'
                },
                2: {
                    value: $scope.sr.requestNumber
                }
            };
        } else {
             $scope.configure.breadcrumbs = {
                1: {
                    href: '/service_requests',
                    value: 'REQUEST_MAN.MANAGE_REQUESTS.TXT_MANAGE_REQUESTS'
                },
                2: {
                    value: $scope.sr.requestNumber
                }
            };
        }

        function addDeviceInformation(){
            $scope.configure.device = {
                information:{
                        translate: {
                                title: 'REQUEST_MAN.COMMON.TXT_DEVICE_INFO',
                                serialNumber: 'REQUEST_MAN.COMMON.TXT_SERIAL_NUMBER',
                                partNumber: 'REQUEST_MAN.COMMON.TXT_PART_NUMBER',
                                product: 'REQUEST_MAN.COMMON.TXT_PRODUCT_MODEL',
                                ipAddress: 'REQUEST_MAN.COMMON.TXT_IP_ADDR',
                                installAddress: 'REQUEST_MAN.COMMON.TXT_INSTALL_ADDRESS',
                                contact : 'DEVICE_SERVICE_REQUEST.DEVICE_CONTACT'
                        }
                }

            };
        }
        function addDeviceMove(){
            $scope.configure.device = {
                information:{
                    translate:{
                            title:'REQUEST_MAN.COMMON.TXT_REQUESTED_UPDATES',
                            move: 'REQUEST_MAN.COMMON.TXT_INSTALL_LXK_TO_MOVE',
                            installAddress: 'REQUEST_MAN.COMMON.TXT_INSTALL_ADDRESS',
                            serialNumber: 'REQUEST_MAN.COMMON.TXT_SERIAL_NUMBER',
                            partNumber: 'REQUEST_MAN.COMMON.TXT_PART_NUMBER',
                            product: 'REQUEST_MAN.COMMON.TXT_PRODUCT_MODEL',
                            ipAddress: 'REQUEST_MAN.COMMON.TXT_IP_ADDR',
                            moveAddress:'REQUEST_MAN.COMMON.TXT_MOVE_ADDRESS'
                    }
                }
            };
                $scope.configure.receipt.translate.title = 'REQUEST_MAN.COMMON.TXT_UPDATE_DEVICE_DETAILS';
                $scope.configure.header.translate.h1 = 'REQUEST_MAN.REQUEST_DEVICE_UPDATE.TXT_DEVICE_REQUEST_NUMBER';
        }
        function addReturnOrderInfo(){
                        
            $scope.configure.header.translate.h1 = "ORDER_MAN.COMMON.TXT_ORDER_NUMBER";
            $scope.configure.contact.translate.title = "ORDER_MAN.COMMON.TXT_ORDER_CONTACTS";
            $scope.configure.contact.translate.requestedByTitle = "ORDER_MAN.COMMON.TXT_ORDER_CREATED_BY";
            $scope.configure.detail.translate.title = "ORDER_MAN.COMMON.TXT_ORDER_ADDITIONAL_DETAILS";
            $scope.configure.detail.translate.costCenter = "ORDER_MAN.COMMON.TXT_ORDER_COST_CENTER";
            $scope.configure.contact.translate.primaryTitle = "ORDER_MAN.COMMON.TXT_ORDER_CONTACT";
            
            $scope.configure.receipt = {
                        translate:{
                            title:"ORDER_MAN.COMMON.TXT_ORDER_NUMBER_SUBMITTED_HEADER",
                            titleValues: {'orderNumber': FormatterService.getFormattedSRNumber($scope.sr) }
                        }
                    };
            $scope.configure.breadcrumbs = {
                1: {
                    href: '/orders',
                    value: 'SERVICE_REQUEST.ORDERS'
                },
                2: {
                    value: $scope.sr.requestNumber
                }
            };

            $scope.configure.header.translate.readMore = "ORDER_MAN.COMMON.LNK_MANAGE_ORDERS";
            $scope.configure.header.readMoreUrl = Orders.route;
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
                    },
                    type : 'RETURN_SUPPLIES'
                };
        }
        function addDeviceOrderInfo(){
        	var tax = calculateTax();
        	$scope.taxable = tax === 0? false:true;
            $timeout(function(){
                OrderItems.columns = 'pruchaseSet';
                    $scope.$broadcast('OrderContentRefresh', {
                        'OrderItems': $scope.sr.item.orderItems // send whatever you want
                    });
                    if($scope.taxable){
                    	$scope.$broadcast('TaxDataAvaialable', {'tax':tax});
                    }
                    
            }, 2000);
            $scope.configure.header.translate.h1 = "ORDER_MAN.COMMON.TXT_ORDER_NUMBER";
            $scope.configure.contact.translate.title = "ORDER_MAN.COMMON.TXT_ORDER_CONTACTS";
            $scope.configure.contact.translate.requestedByTitle = "ORDER_MAN.COMMON.TXT_ORDER_CREATED_BY";
            $scope.configure.detail.translate.title = "ORDER_MAN.COMMON.TXT_ORDER_ADDITIONAL_DETAILS";
            $scope.configure.detail.translate.costCenter = "ORDER_MAN.COMMON.TXT_ORDER_COST_CENTER";
            $scope.configure.contact.translate.primaryTitle = "ORDER_MAN.COMMON.TXT_ORDER_CONTACT";
          
            $scope.configure.breadcrumbs = {
                1: {
                    href: '/orders',
                    value: 'SERVICE_REQUEST.ORDERS'
                },
                2: {
                    value: $scope.sr.requestNumber
                }
            };

         


                    $scope.configure.header.translate.h1Values = {'srNumber': FormatterService.getFormattedSRNumber($scope.sr)};
                    
                    $scope.configure.header.translate.readMore = "ORDER_MAN.COMMON.LNK_MANAGE_ORDERS";
                    $scope.configure.header.readMoreUrl = Orders.route;
                   
                    $scope.configure.receipt = {
                        translate:{
                            title:"ORDER_MAN.COMMON.TXT_ORDER_NUMBER_SUBMITTED_HEADER",
                            titleValues: {'orderNumber': FormatterService.getFormattedSRNumber($scope.sr) }
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
            $scope.configure.order.shipTo = {
            		translate : {
            			shipToAddress: 'ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_SHIP_TO_ADDR',
            			instructions:'ORDER_MAN.COMMON.TXT_ORDER_DELIVERY_INSTR',
            			deliveryDate:'ORDER_MAN.COMMON.TXT_ORDER_REQ_DELIV_DATE',
                        expedite:'ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_DELIVERY_EXPEDITE'
            		}
            }
            $scope.configure.order.po = {
                translate:{
                    label: 'ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_PURCHASE_ORDER',
                    title:'ORDER_MAN.COMMON.TXT_ORDER_PO_DETAILS',
                }
            };
            $scope.configure.contact.show.primaryAction = false;
        }

        function addSupplyOrderInfo(){
        	var tax = calculateTax();
        	$scope.taxable = tax === 0 ? false : true;
            $timeout(function(){
                OrderItems.columns = 'pruchaseSet';
                    $scope.$broadcast('OrderContentRefresh', {
                        'OrderItems': $scope.sr.item.orderItems // send whatever you want
                    });
                    if($scope.taxable)
                    	$scope.$broadcast('TaxDataAvaialable', {'tax':tax});
            }, 2000);
             $scope.configure.header.translate.h1 = "ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_DETAIL_SUPPLIES";
             $scope.configure.contact.translate.title = "ORDER_MAN.COMMON.TXT_ORDER_CONTACTS";
             $scope.configure.contact.translate.requestedByTitle = "ORDER_MAN.COMMON.TXT_ORDER_CREATED_BY";
             $scope.configure.detail.translate.title = "ORDER_MAN.COMMON.TXT_ORDER_ADDITIONAL_DETAILS";
             $scope.configure.detail.translate.costCenter = "ORDER_MAN.COMMON.TXT_ORDER_COST_CENTER";
             $scope.configure.contact.translate.primaryTitle = "ORDER_MAN.COMMON.TXT_ORDER_CONTACT";
             $scope.configure.breadcrumbs = {
                1: {
                    href: '/orders',
                    value: 'SERVICE_REQUEST.ORDERS'
                },
                2: {
                    value: $scope.sr.requestNumber
                }
            };
         
                    $scope.configure.header.translate.h1Values = {'srNumber': FormatterService.getFormattedSRNumber($scope.sr)};
                                       
                    
                    $scope.configure.header.translate.readMore = "ORDER_MAN.COMMON.LNK_MANAGE_ORDERS";
                    $scope.configure.header.readMoreUrl = Orders.route;
                    
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
            
            $scope.configure.order.shipTo = {
            		translate : {
            			shipToAddress: 'ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_SHIP_TO_ADDR',
            			instructions:'ORDER_MAN.COMMON.TXT_ORDER_DELIVERY_INSTR',
            			deliveryDate:'ORDER_MAN.COMMON.TXT_ORDER_REQ_DELIV_DATE',
                        expedite:'ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_DELIVERY_EXPEDITE'
            		}
            }
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
                            title: 'REQUEST_MAN.COMMON.TXT_DECOM_OPTIONS',
                                pickup: 'REQUEST_MAN.COMMON.TXT_LXK_PICK_UP_QUERY',
                                pageCount: 'REQUEST_MAN.COMMON.TXT_PAGE_COUNTS'
                        }
                };
             $scope.device.meterReads =$scope.sr.item.meterReads;
             groupPageCounts($scope.device);
        }
        function configureReceiptTemplate(){
            $scope.configure.header.translate.h1 = 'DEVICE_MAN.DEVICE_SERVICE_HISTORY.TXT_SERVICE_REQUEST_NUMBER';
            $scope.configure.header.translate.h1Values = {
                'srNumber': FormatterService.getFormattedSRNumber($scope.sr)
            };
                
            $scope.configure.receipt = {
                translate:{
                    title:'REQUEST_MAN.MANAGE_REQUESTS.TXT_DEVICE_SERVICE_REQUEST_DETAILS',
                    titleValues: {
                        'srNumber': FormatterService.getFormattedSRNumber($scope.sr)
                    },
                        subtitle: 'REQUEST_MAN.COMMON.TXT_REQUEST_STATUS'
                },
                print: true
            };
        }

        $scope.goToServiceCancel = function(requestNumber, type){
            ServiceRequest.tempSpace = {};
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
            case 'SVC_ASSET_ORDER':
            case 'SVC_CATALOG_ORDER':
            case 'MIXED_PARTS_ASSET_ORDER':
            case 'MIXED_PARTS_CATALOG_ORDER':
            case 'SUPPLIES_PROACTIVE_ORDER':
            case 'SUPPLIES_ASSET_ORDER':
            case 'SUPPLIES_CATALOG_ORDER':
                addSupplyOrderInfo();
                $scope.configure.header.showUpdateBtn = false;
                $scope.configure.header.showCancelBtn = false;
                $scope.configure.statusList = $scope.setStatusBar($scope.sr.status, $scope.sr.statusDate, statusBarLevels);
                addTabsForBreakFix();
            break;
            case 'UPDATE_HARDWARE_REQUEST':
            case 'HARDWARE_ORDER':
                addDeviceOrderInfo();
                $scope.configure.header.showUpdateBtn = false;
                $scope.configure.header.showCancelBtn = false;
                $scope.configure.statusList = $scope.setStatusBar($scope.sr.status, $scope.sr.statusDate, statusBarLevels);
                addTabsForBreakFix();
            break;
            case 'DATA_ADDRESS_ADD':
                addAddressInfo('ADDRESS_MAN.ADD_ADDRESS.TXT_ADDRESS_ADDED');
                
                $scope.configure.receipt.translate.title = 'ADDRESS_MAN.ADD_ADDRESS.TXT_ADD_ADDRESS_DETAILS';
                $scope.configure.header.translate.h1 = 'ADDRESS_MAN.ADD_ADDRESS.TXT_ADD_ADDRESS_DETAILS';
                $scope.configure.detail.show.costCenter = false;
                $scope.configure.detail.show.comments = false;
                $scope.configure.detail.show.attachements = false;
            break;
            case 'DATA_ADDRESS_CHANGE':
                addAddressInfo('ADDRESS_MAN.UPDATE_ADDRESS.TXT_ADDRESS_UPDATED');
                
                $scope.configure.receipt.translate.title = 'ADDRESS_MAN.UPDATE_ADDRESS.TXT_UPDATE_ADDRESS_DETAILS';
                $scope.configure.header.translate.h1 = 'ADDRESS_MAN.UPDATE_ADDRESS.TXT_UPDATE_ADDRESS_DETAILS';
                $scope.configure.detail.show.costCenter = false;
                $scope.configure.detail.show.comments = false;
                $scope.configure.detail.show.attachements = false;
            break;
            case 'DATA_ADDRESS_REMOVE':
                addAddressInfo('ADDRESS_SERVICE_REQUEST.DATA_ADDRESS_REMOVE');
                
                $scope.configure.receipt.translate.title = 'ADDRESS_MAN.DELETE_ADDRESS.TXT_DELETE_ADDRESS_DETAILS';
                $scope.configure.header.translate.h1 = 'ADDRESS_MAN.DELETE_ADDRESS.TXT_DELETE_ADDRESS_DETAILS';
                $scope.configure.detail.show.costCenter = false;
                $scope.configure.detail.show.comments = false;
                $scope.configure.detail.show.attachements = false;
            break;
            case 'DATA_CONTACT_REMOVE':
                addContactInfo('CONTACT_SERVICE_REQUEST.DATA_CONTACT_REMOVE_TITLE');
                $scope.configure.receipt.translate.title = 'DEVICE_SERVICE_REQUEST.DELETE_CONTACT_DETAIL';
                $scope.configure.header.translate.h1 = 'DEVICE_SERVICE_REQUEST.DELETE_CONTACT_REQUEST_NUMBER';
            break;
            case 'DATA_CONTACT_CHANGE':
                addContactInfo('CONTACT_SERVICE_REQUEST.DATA_CONTACT_CHANGE');
                addAddressInfo('ADDRESS_MAN.UPDATE_ADDRESS.TXT_ADDRESS_UPDATED');
                $scope.configure.receipt.translate.title = 'DEVICE_SERVICE_REQUEST.UPDATE_CONTACT_DETAIL';
                $scope.configure.header.translate.h1 = 'DEVICE_SERVICE_REQUEST.UPDATE_CONTACT_REQUEST_NUMBER';
            break;
            case 'MADC_MOVE':
                addDeviceMove();
                $scope.formattedMoveDevice = 'Yes';
                $scope.configure.header.showCancelBtn = true;
                $scope.configure.header.showUpdateBtn = true;
                addTabsForMADC();
            break;
            case 'DATA_ASSET_CHANGE':
                addDeviceMove();
                $scope.formattedMoveDevice = 'No';
                addTabsForMADC();
            break;
            case 'MADC_INSTALL':
            case 'MADC_INSTALL_AND_DECOMMISSION':
                addDeviceInformation();
                $scope.configure.receipt.translate.title = 'REQUEST_MAN.REQUEST_DEVICE_REGISTER_SUBMITTED.TXT_REGISTER_DEVICE_DETAILS';
                $scope.configure.header.translate.h1 = 'DEVICE_SERVICE_REQUEST.ADD_DEVICE_REQUEST_NUMBER';
                $scope.configure.header.showCancelBtn = true;
                $scope.configure.header.showUpdateBtn = true;
                addTabsForMADC();
            break;
            case 'MADC_DECOMMISSION':
                addDeviceInformation();
                addDecommissionInfo();
                $scope.device.lexmarkPickupDevice = 'true';
                $scope.formattedPickupDevice = FormatterService.formatYesNo($scope.device.lexmarkPickupDevice);
                $scope.configure.receipt.translate.title = 'REQUEST_MAN.REQUEST_DEVICE_DECOM_SUBMITTED.TXT_DECOM_DEVICE_DETAILS';
                $scope.configure.header.translate.h1 = 'DEVICE_SERVICE_REQUEST.DECOMMISSION_DEVICE_REQUEST_NUMBER';
                $scope.configure.header.showCancelBtn = true;
                $scope.configure.header.showUpdateBtn = true;
                addTabsForMADC();
            break;
            case 'DATA_ASSET_DEREGISTER':
                addDeviceInformation();
                addDecommissionInfo();
                $scope.device.lexmarkPickupDevice = 'false';
                $scope.formattedPickupDevice = FormatterService.formatYesNo($scope.device.lexmarkPickupDevice);
                $scope.configure.receipt.translate.title = 'REQUEST_MAN.REQUEST_DEVICE_DECOM_SUBMITTED.TXT_DECOM_DEVICE_DETAILS';
                $scope.configure.header.translate.h1 = 'DEVICE_SERVICE_REQUEST.DECOMMISSION_DEVICE_REQUEST_NUMBER';
                addTabsForMADC();
            break;
            case 'DATA_ASSET_REGISTER':
                addDeviceInformation(); 
                $scope.configure.header.translate.h1 = 'DEVICE_SERVICE_REQUEST.ADD_DEVICE_REQUEST_NUMBER';
                $scope.configure.receipt.translate.title = 'DEVICE_SERVICE_REQUEST.ADD_DEVICE_DETAIL'; 
                addTabsForMADC();
            break;
            case 'BREAK_FIX':
            case 'BREAK_FIX_ONSITE_REPAIR' :
            case 'BREAK_FIX_EXCHANGE':
            case 'BREAK_FIX_OPTION_EXCHANGE':
            case 'BREAK_FIX_REPLACEMENT':
            case 'BREAK_FIX_CONSUMABLE_SUPPLY_INSTALL':
            case 'BREAK_FIX_CONSUMABLE_PART_INSTALL':
            case 'BREAK_FIX_ONSITE_EXCHANGE':
            case 'BREAK_FIX_OTHER':
            addDeviceInformation();
            $scope.configure.device.service ={
                    translate:{
                        title:'DEVICE_MAN.DEVICE_SERVICE_HISTORY.TXT_SERVICE_SUMMARY',
                        description:'DEVICE_MAN.DEVICE_SERVICE_HISTORY.TXT_PROBLEM_DESC'
                    }
                };
            $scope.configure.device.information.translate.installAddress = 'REPORTING.SERVICE_ADDRESS';
            $scope.configure.detail.show.comments = false;
            addTabsForBreakFix();
            break;
            case 'SUPPLIES_CATALOG_ORDER':
            case 'HARDWARE_ORDER':
            case 'HARDWARE_ORDER_INSTALL':
                $scope.configure.header.showUpdateBtn = true;
                $scope.configure.statusList = $scope.setStatusBar($scope.sr.status, $scope.sr.statusDate, statusBarLevels);
                addTabsForBreakFix();
            break;
            default:
            break;
        }
    }

    $scope.goToServiceUpdate = function(requestNumber, type){
        ServiceRequest.tempSpace = {};
        switch(type){
            case 'MADC_DECOMMISSION':
                $location.path('/service_requests/' + requestNumber + '/update/UPDATE_DECOMMISSION');
            break;
            case 'MADC_INSTALL':
                $location.path('/service_requests/' + requestNumber + '/update/UPDATE_INSTALL');
            break;
            case 'MADC_MOVE':
                $location.path('/service_requests/' + requestNumber + '/update/UPDATE_MOVE');
            break;
            case 'SUPPLIES_CATALOG_ORDER':
            case 'SUPPLIES_ASSET_ORDER':
                $location.path('/service_requests/' + requestNumber + '/update/UPDATE_CONSUMABLES_ORDER');
            break;
            case 'BREAK_FIX':
                $location.path('/service_requests/' + requestNumber + '/update/UPDATE_HARDWARE_REQUEST');
            break;
            case 'HARDWARE_ORDER':
                $location.path('/service_requests/' + requestNumber + '/update/UPDATE_HARDWARE_ORDER');
            break;
            case 'HARDWARE_ORDER_INSTALL':
                $location.path('/service_requests/' + requestNumber + '/update/UPDATE_HARDWARE_INSTALL');
            break;
            default:
            $scope.redirectToList();
        }
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
    if (!BlankCheck.isNull($scope.sr.item.sourceAddress) && !BlankCheck.isNull($scope.sr.item.sourceAddress.addressLine1) ) {
    	$scope.formattedAddress = FormatterService.formatAddress($scope.sr.item.sourceAddress);
    	$scope.formattedAddress += FormatterService.addBuildingFloorOffice($scope.sr.item.sourceAddressPhysicalLocation);
    	$scope.formatedShipToAddress = $scope.formattedAddress;
    }
    if (!BlankCheck.isNull($scope.sr.destinationAddress) && !BlankCheck.isNull($scope.sr.destinationAddress.item)) {
            $scope.formattedDeviceMoveAddress = FormatterService.formatAddress($scope.sr.destinationAddress.item);
            if(!BlankCheck.isNull($scope.sr.destinationAddressPhysicalLocation)){
            	 $scope.formattedDeviceMoveAddress += FormatterService.addBuildingFloorOffice($scope.sr.destinationAddressPhysicalLocation);
            }
            
    }
    if (!BlankCheck.isNull($scope.sr.item._embedded.secondaryContact)) {
    	$scope.formattedContact = FormatterService.formatContact($scope.sr.item._embedded.secondaryContact);  
    	 if (!BlankCheck.isNull($scope.sr.item._embedded.secondaryContact.address) 
    			 && !BlankCheck.isNull($scope.sr.item._embedded.secondaryContact.address)
    	    		&& !BlankCheck.isNull($scope.sr.item._embedded.secondaryContact.address.addressLine1) ) {
    	    	$scope.formattedAddress = FormatterService.formatAddress($scope.sr.item._embedded.secondaryContact.address);
    	    	$scope.formattedAddress += FormatterService.addBuildingFloorOffice($scope.sr.item._embedded.secondaryContact.address);
    	        
    	    }
    }
    if ($scope.sr.item._embedded && !BlankCheck.isNull($scope.sr.item._embedded.secondaryContact)) {
            $scope.formattedDeviceContact = FormatterService.formatContact($scope.sr.item._embedded.secondaryContact);
    }

    if (!BlankCheck.isNull($scope.sr) && !BlankCheck.isNull($scope.sr.primaryContact) &&
        !BlankCheck.isNull($scope.sr.primaryContact.item)){
                $scope.formattedPrimaryContact = FormatterService.formatContact($scope.sr.primaryContact.item);

    }
    if(!BlankCheck.isNull($scope.sr) && !BlankCheck.isNull($scope.sr.requester) &&
        !BlankCheck.isNull($scope.sr.requester.item)){
        $scope.requestedByContactFormatted = FormatterService.formatContact($scope.sr.requester.item);
    }
    if ($scope.sr.billToAddress && !BlankCheck.isNull($scope.sr.billToAddress.item) 
    		&& !BlankCheck.isNull($scope.sr.billToAddress.item.addressLine1)){
    	 	$scope.scratchSpace = {
    	 			billToAddresssSelected : true	
    	 	};
            $scope.formatedBillToAddress = FormatterService.formatAddress($scope.sr.billToAddress.item);
    }else {
            $scope.formatedBillToAddress = FormatterService.formatNoneIfEmpty($scope.sr.billToAddress);
    }

    /*if ($scope.sr.shipToAddress && !BlankCheck.isNull($scope.sr.shipToAddress.item)){
            $scope.formatedShipToAddress = FormatterService.formatAddress($scope.sr.shipToAddress.item);
    }else {
            $scope.formatedShipToAddress = FormatterService.formatNoneIfEmpty($scope.sr.shipToAddress);
    }*/

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
        $scope.sr.attachments = $scope.sr.item.attachments;
    }
    function groupPageCounts(device){
    	
    	var newCount = {},newDate = {},i=0;
        var meterReadStr = "";
        if(device.meterReads && device.meterReads !== null){
            var meterReadCnt = device.meterReads.length;
            for(;i<meterReadCnt;i++){
                ind = i + 1;
                newCount[device.meterReads[i].type] = device.meterReads[i].value;
                newDate[device.meterReads[i].type]  = device.meterReads[i].updateDate === null ? device.meterReads[i].createDate : device.meterReads[i].updateDate;
                meterReadStr = meterReadStr + ind + ". ";                    
                meterReadStr = meterReadStr + "Type:" + device.meterReads[i].type + ", ";
                meterReadStr = meterReadStr + "Count:" + device.meterReads[i].value + ", ";                    
                meterReadStr = meterReadStr + "Date:" + (device.meterReads[i].updateDate === null ? device.meterReads[i].createDate : device.meterReads[i].updateDate) + " ";
            }
        }
    	device.newCount = newCount;
    	device.newDate = newDate;
        $scope.meterReadsForCsv = meterReadStr;     
    } 
    
    function addTabsForMADC(){
    	$scope.configure.allSRTabs = {
    			showAssociated : true,
    			showActivities : true,
    			shipments : false
        }
    }
    function addTabsForBreakFix(){
    	$scope.configure.allSRTabs = {
    			showAssociated : true,
    			showActivities : true,
    			shipments : true
        }
    }
    function calculateTax(){
    	
    	var i = 0,tax=0;
    	for(;i<$scope.sr.item.orderItems.length;i++){
    		tax +=$scope.sr.item.orderItems[i].taxAmount;
    	}
    	
    	return tax;
    }
    setCsvDefinition();

}]);

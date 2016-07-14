

angular.module('mps.serviceRequests')
.factory('OrderControllerHelperService', [
    '$translate',
    '$location',
    'BlankCheck',
    'FormatterService',
    'UserService',
    '$rootScope',
    function(
        $translate,
        $location,
        BlankCheck,
        FormatterService,
        Users,
        $rootScope
        ) {

        function addShipAndInstall(){
            scope.configure.shipToBillTo = undefined;
            if($rootScope.orderInstall){
            	scope.configure.installShipping = addinstallShipping();
            }
            
            scope.configure.installPicker = {
                pickerObject: halObj.item,
                source: 'OrderCatalogPurchase'
            };
        }
        function addinstallShipping(){
        	return {   translate: {
                    title: 'ORDER_MAN.HARDWARE_ORDER.TXT_INSTALL_SHIP_BILL_ADDRESSES',
                    installQuestion:'ORDER_MAN.COMMON.TXT_LXK_INSTALL_QUERY',
                    installAddress:'ORDER_MAN.HARDWARE_ORDER.TXT_INSTALLATION_ADDRESS',
                    installAction:'ORDER_MAN.HARDWARE_ORDER.LNK_SELECT_INSTALL_ADDRESS',
                    sameShipInstallQuestion:'ORDER_MAN.COMMON.TXT_SHIP_INSTALL_ADDRS_SAME'
                },
                sameAddress: function(){
                    if(scope.scratchSpace.lexmarkShippingSameAsInstall){
                        halObj.copyRelationship('sourceAddress', halObj.item, 'shipToAddress');
                        halObj.tempSpace.shipToAddress =  angular.copy(halObj.tempSpace.installAddress);
                        halObj.item.shipToAddressPhysicalLocation.physicalLocation1 =
                            scope.sr.sourceAddressPhysicalLocation.physicalLocation1;
                        halObj.item.shipToAddressPhysicalLocation.physicalLocation2 =
                            scope.sr.sourceAddressPhysicalLocation.physicalLocation2;
                        halObj.item.shipToAddressPhysicalLocation.physicalLocation3 =
                            scope.sr.sourceAddressPhysicalLocation.physicalLocation3;
                        scope.formatAdditionalData();
                    }else{
                    	halObj.removeRelationship('shipToAddress');
                    	halObj.tempSpace.shipToAddress =  null;
                        halObj.item.shipToAddressPhysicalLocation.physicalLocation1 = "";                            
                        halObj.item.shipToAddressPhysicalLocation.physicalLocation2 = "";
                        halObj.item.shipToAddressPhysicalLocation.physicalLocation3 = "";                            
                        scope.formatAdditionalData();
                    }
               }
            
        	};
        }
        function addShipAndBill(){
        	if($rootScope.orderInstall){
            	scope.configure.installShipping = addinstallShipping();
            }            
            scope.configure.shipToBillTo = {
                translate:{
                    title:'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_SHIPPING_BILLING',
                    billToAddress:'ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_BILL_TO_ADDR',
                    billToAction:'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_SELECT_BILL_TO_FOR'
                }
            };
        }
        function setupShipBillToAndInstallAddresses(Orders){
            if(Orders && Orders.tempSpace && Orders.tempSpace.catalogCart &&
                Orders.tempSpace.catalogCart.billingModels){
                var isShipBill =  $.inArray('SHIP_AND_BILL', Orders.tempSpace.catalogCart.billingModels);
                scope.isShipBill = false;
                if(isShipBill > -1){
                    scope.paymentMethod = 'SHIP_AND_BILL';
                    scope.isShipBill = true;
                    addShipAndBill();
                }else if(Orders.tempSpace.catalogCart.billingModels.length > 0 && scope.type !== 'SUPPLIES'){
                    scope.paymentMethod = 'payLater';
                    addShipAndInstall();
                }else if(Orders.tempSpace.catalogCart.billingModels.length > 0){
                    scope.paymentMethod = 'payLater';
                }
            }else{
                scope.paymentMethod = 'Error';
            }

        }

         function hideShowPriceColumn(Catalog){
                var priceColumn = Catalog.columnDefs.defaultSet.find(function(column){
                            return column.isPrice;
                       });
                if(priceColumn &&
                    halObj &&
                    halObj.tempSpace &&
                    halObj.tempSpace.catalogCart &&
                    halObj.tempSpace.catalogCart.agreement &&
                    halObj.tempSpace.catalogCart.agreement.displayPrice &&
                    (halObj.tempSpace.catalogCart.agreement.displayPrice === 'UNKNOWN' ||
                     halObj.tempSpace.catalogCart.agreement.displayPrice === 'NEITHER')){
                    priceColumn.visible = false;
                }
            }

        function addMethods(halObject, $scope, $rootScope){
            halObj = halObject;
            scope = $scope;
            rootScope = $rootScope;

            if(scope){
                scope.setupShipBillToAndInstallAddresses = setupShipBillToAndInstallAddresses;
                scope.hideShowPriceColumn = hideShowPriceColumn;
            }else{
                throw 'scope was not passed in to addMethods';
            }
        }

    return  {
        addMethods: addMethods
    };
}]);


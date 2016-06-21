

angular.module('mps.orders')
.controller('CatalogController', [
    '$scope',
    '$location',
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
    'AssetPartsFactory',
    'HardwareCatalogFactory',
    'PersonalizationServiceFactory',
    '$q',
    'SuppliesCatalogFactory',
    'OrderControllerHelperService',
    'AccessoriesCatalogFactory',
    function(
        $scope,
        $location,
        $rootScope,
        Orders,
        GridService,
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
        AssetParts,
        HardwareCatalog,
        Personalize,
        $q,
        SuppliesCatalog,
        OrderControllerHelper,
        AccessoriesCatalogFactory) {
            $scope.showDeviceSelectionErrorMessage = false;
            var personal = new Personalize($location.url(),$rootScope.idpUser.id);
            OrderControllerHelper.addMethods(Orders, $scope, $rootScope);
            $scope.type = $routeParams.type.toUpperCase();
            //multi, none, single
            $scope.print = false;
            $scope.export = false;
            $scope.editable  = true;
            $scope.taxable = false;
            $scope.hideSubmitButton = true;
            $scope.submit = function(){
                $location.path(OrderItems.route + '/catalog/' + $routeParams.type + '/review');
            };
            OrderItems.columns = 'defaultSet';
            if(Orders && Orders.tempSpace && Orders.tempSpace.catalogCart && Orders.tempSpace.catalogCart.agreement){
                 $scope.configure = {
                     actions:{
                        submit: function(){
                            if(OrderItems.data.length > 0)
                                $scope.$broadcast('OrderCatalogSubmit', {});
                            else{
                                $scope.showDeviceSelectionErrorMessage = true;
                            }
                        },
                        disabled: true
                    },
                    cart:Orders.tempSpace.catalogCart
                };
                 if ($scope.type !== 'HARDWARE'){
                	 $scope.supplyMaxQuantity = (Orders.tempSpace.catalogCart.agreement.supplyMaxQuantity === 0)?1:Orders.tempSpace.catalogCart.agreement.supplyMaxQuantity;
                	 $scope.serviceMaxQuantity = (Orders.tempSpace.catalogCart.agreement.serviceMaxQuantity === 0)?1:Orders.tempSpace.catalogCart.agreement.serviceMaxQuantity;
                 }
                
            }else{
            	//If the page is refreshed.
                $location.path('/orders');
                $location.search('tab', 'orderAllTab');
                return;
            }
                if(Orders && Orders.tempSpace && Orders.tempSpace.catalogCart &&
                    Orders.tempSpace.catalogCart.billingModels){
                    var isShipBill =  $.inArray('SHIP_AND_BILL', Orders.tempSpace.catalogCart.billingModels);
                    if(isShipBill > -1){
                    $scope.paymentMethod = 'SHIP_AND_BILL';
                    }
                    else if(Orders.tempSpace.catalogCart.billingModels.length > 0){
                    $scope.paymentMethod = 'payLater';
                    }
            }else{
                $scope.paymentMethod = 'Error';
            }
            if($scope.type === 'HARDWARE'){
                $scope.configure.header = {
                    translate:{
                        h1:'ORDER_CATALOGS.DEVICE_CATALOG.TXT_DEVICE_CATALOG_ORDER',
                        body:'ORDER_CATALOGS.DEVICE_CATALOG.TXT_DEVICE_CATALOG_PAR'
                    }
                };
                $scope.configure.actions.translate = {
                        abandonRequest:'ORDER_CATALOGS.DEVICE_CATALOG.BTN_DEVICE_ORDER_ABANDON',
                            submit: 'ORDER_MAN.COMMON.BTN_NEW_ORDER_SUBMIT'
                };
                
                $scope.configure.breadcrumbs = {
                    1: {
                        href: "/orders",
                        value: "ORDER_MAN.MANAGE_ORDERS.TXT_MANAGE_ORDERS"
                    },
                    2: {
                        value: "ORDER_CATALOGS.DEVICE_CATALOG.TXT_DEVICE_CATALOG_ORDER"
                    }
                }

            }else if($scope.type  === 'SUPPLIES'){
                $scope.configure.header = {
                    translate:{
                        h1:'ORDER_CATALOGS.SUPPLIES_CATALOG.TXT_SUPPLIES_CATALOG_ORDER',
                        body:'ORDER_CATALOGS.SUPPLIES_CATALOG.TXT_SUPPLIES_CATALOG_PAR'
                    }
                };
                $scope.configure.actions.translate = {
                        abandonRequest:'ORDER_CATALOGS.SUPPLIES_CATALOG.BTN_ORDER_ABANDON_SUPPLIES',
                            submit: 'ORDER_MAN.COMMON.BTN_NEW_ORDER_SUBMIT'
                };
                
                $scope.configure.breadcrumbs = {
                    1: {
                        href: "/orders",
                        value: "ORDER_MAN.MANAGE_ORDERS.TXT_MANAGE_ORDERS"
                    },
                    2: {
                        value: "ORDER_CATALOGS.SUPPLIES_CATALOG.TXT_SUPPLIES_CATALOG_ORDER"
                    }
                }
            }
            $scope.configure.modal = {
                    translate: {
                        abandonTitle: 'SERVICE_REQUEST.TITLE_ABANDON_MODAL',
                        abandondBody: 'SERVICE_REQUEST.BODY_ABANDON_MODAL',
                        abandonCancel:'SERVICE_REQUEST.ABANDON_MODAL_CANCEL',
                        abandonConfirm: 'SERVICE_REQUEST.ABANDON_MODAL_CONFIRM'
                    },
                    returnPath: (Orders.sourcePage.indexOf('device_management') !== -1?Orders.sourcePage : Orders.route + '/') 
                };


            function getParts(){
                var filterSearchService,
                    beforeDisplay;
                $scope.optionsName = 'catalogOptions';
                 var params ={
                        contractNumber: $scope.configure.cart.contract.id,
                        agreementId: $scope.configure.cart.agreement.id,
                        billingModel: $scope.configure.cart.billingModels.join(',')
                    };

                switch($scope.configure.cart.catalog.toUpperCase()){
                    case 'SUPPLIES':
                        beforeDisplay = function(){
                            var deferred = $q.defer();
                             SuppliesCatalog.getThumbnails();
                             $q.all(SuppliesCatalog.thumbnails).then(function(){
                                deferred.resolve();
                             });
                            return deferred.promise;
                        };
                       $scope.hideShowPriceColumn(SuppliesCatalog);
                       filterSearchService = new FilterSearchService(SuppliesCatalog, $scope, $rootScope, personal,
                            'defaultSet', 92, 'catalogOptions', beforeDisplay);
                        $scope.catalogOptions.showBookmarkColumn = false;
                        $scope.catalogOptions.enableRowHeaderSelection = false;
                        $scope.catalogOptions.enableFullRowSelection = false;
                        filterSearchService.addBasicFilter('all supplies', params, {});
                    break;
                    case  'DEVICE':
                        beforeDisplay = function(){
                            var deferred = $q.defer();
                             HardwareCatalog.getThumbnails();
                             $q.all(HardwareCatalog.thumbnails).then(function(){
                                deferred.resolve();
                             });
                            return deferred.promise;
                        };
                        $scope.hideShowPriceColumn(HardwareCatalog);
                        filterSearchService = new FilterSearchService(HardwareCatalog, $scope, $rootScope, personal,
                                'defaultSet', 120, 'catalogOptions', beforeDisplay);
                        $scope.catalogOptions.showBookmarkColumn = false;
                        $scope.catalogOptions.enableRowHeaderSelection = false;
                        $scope.catalogOptions.enableFullRowSelection = false;
                        filterSearchService.addBasicFilter('all device packages', params, {});
                    break;
                    case  'ACCESSORIES':
                    	beforeDisplay = function(){
	                        var deferred = $q.defer();
	                        AccessoriesCatalogFactory.getThumbnails();
	                         $q.all(AccessoriesCatalogFactory.thumbnails).then(function(){
	                            deferred.resolve();
	                         });
	                        return deferred.promise;
                    	};
                    	$scope.hideShowPriceColumn(AccessoriesCatalogFactory);
	                   filterSearchService = new FilterSearchService(AccessoriesCatalogFactory, $scope, $rootScope, personal,
	                        'defaultSet', 92, 'catalogOptions', beforeDisplay);
	                    $scope.catalogOptions.showBookmarkColumn = false;
	                    $scope.catalogOptions.enableRowHeaderSelection = false;
	                    $scope.catalogOptions.enableFullRowSelection = false;
	                    filterSearchService.addBasicFilter('all accessories', params, {});
	                break;
                    default:
                        AssetParts.data = undefined;
                    break;
                }
            }

    $scope.selectRow = function(row){
        row.enableSelection = true;
        row.setSelected(true);
    };
    $scope.deSelectRow = function(row){
        row.enableSelection = false;
        row.setSelected(false);
    };

    $scope.removeItemRow = function(item){
       var row = $scope.catalogAPI.gridApi.grid.getRow(item);
       $scope.deSelectRow(row);
    };

    $scope.isAdded = function(item){
        var added = false;

        for(var i = 0; i < OrderItems.data.length; ++i){
            if(item.itemNumber === OrderItems.data[i].itemNumber){
                added = true;
                break;
            }
        }
        return added;
    };
    $scope.removeFromOrder = function(item){
        var index = -1;
        for(var i = 0; i < OrderItems.data.length; ++i){
            if(item.itemNumber === OrderItems.data[i].itemNumber){
                index = i;
                break;
            }
        }
        OrderItems.data.splice(index,1);
        OrderItems.columns = 'defaultSet';
        if(OrderItems.data.length === 0){
            $scope.configure.actions.disabled = true;
        }
        $scope.$broadcast('OrderContentRefresh', {
           'OrderItems': OrderItems // send whatever you want
        });
    };
    $scope.addToOrder = function(item){
        $scope.showDeviceSelectionErrorMessage = false;
        var newItem = angular.copy(item);
        newItem.quantity = 1;
        OrderItems.data.push(newItem);
        $scope.orderItems = OrderItems.data;
        OrderItems.columns = 'defaultSet';
        if(OrderItems.data.length > 0){
            $scope.configure.actions.disabled = false;
        }
        $scope.$broadcast('OrderContentRefresh', {
            'OrderItems': OrderItems // send whatever you want
        });
    };
    $scope.params={};
     
    $scope.searchPartNumber = function(){
    	$scope.params.search = $scope.partNumber;
    	$scope.params.searchOn = "displayItemNumber";
    	$scope.showSearchMessage = true;
    	$scope.catalogOptions.data = [];
    	$scope.searchFunctionDef($scope.params); 
    }
    $scope.clearPartNumberSearch = function(){
    	$scope.partNumber = "";
    	$scope.searchPartNumber();
    }
            getParts();

    }]);


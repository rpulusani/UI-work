define(['angular','order', 'utility.grid'], function(angular) {
    'use strict';
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
            SuppliesCatalog) {
                var personal = new Personalize($location.url(),$rootScope.idpUser.id);
                $scope.type = $routeParams.type.toUpperCase();
                //multi, none, single
                $scope.print = false;
                $scope.export = false;
                $scope.editable  = true;
                $scope.hideSubmitButton = true;

                 $scope.configure = {
                     actions:{
                        submit: function() {
                            $location.path(Orders.route + '/' + $scope.device.id + '/review');
                        },
                        disabled: true
                    },
                    cart:Orders.tempSpace.catalogCart
                };
                if(Orders && Orders.tempSpace && Orders.tempSpace.catalogCart && Orders.tempSpace.catalogCart.billingModels){
                     var isShipBill =  $.inArray('SHIP_AND_BILL', Orders.tempSpace.catalogCart.billingModels);
                     if(isShipBill > 0){
                        $scope.paymentMethod = 'SHIP_AND_BILL';
                     }else if(Orders.tempSpace.catalogCart.billingModels.length > 0){
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
                            submit: 'ORDER_CATALOGS.COMMON.BTN_REVIEW_AND_SUBMIT'
                    };
                }else if($scope.type  === 'SUPPLIES'){
                    $scope.configure.header = {
                        translate:{
                            h1:'ORDER_CATALOGS.SUPPLIES_CATALOG.TXT_SUPPLIES_CATALOG_ORDER',
                            body:'ORDER_CATALOGS.SUPPLIES_CATALOG.TXT_SUPPLIES_CATALOG_PAR'
                        }
                    };
                    $scope.configure.actions.translate = {
                            abandonRequest:'ORDER_CATALOGS.SUPPLIES_CATALOG.BTN_ORDER_ABANDON_SUPPLIES',
                            submit: 'ORDER_CATALOGS.COMMON.BTN_REVIEW_AND_SUBMIT'
                    };
                }
                function getParts(){
                    var filterSearchService,
                        beforeDisplay;
                    $scope.optionsName = 'catalogOptions';
                     var params ={
                            contractNumber: $scope.configure.cart.contract.id,
                            agreementId: $scope.configure.cart.agreement.id
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
                            filterSearchService = new FilterSearchService(HardwareCatalog, $scope, $rootScope, personal,
                                    'defaultSet', 92, 'catalogOptions', beforeDisplay);
                            $scope.catalogOptions.showBookmarkColumn = false;
                            $scope.catalogOptions.enableRowHeaderSelection = false;
                            $scope.catalogOptions.enableFullRowSelection = false;
                            filterSearchService.addBasicFilter('all device packages', params, {});
                        break;
                        case  'ACCESSORIES':
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
            var newItem = angular.copy(item);
            newItem.quantity += 1;
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


        $scope.submit = function(){
            Orders.newMessage();
            Orders.tempSpace = {};
            $location.path(OrderItems.route + '/purchase/review');
        };

                getParts();

        }]);
});

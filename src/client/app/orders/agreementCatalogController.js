define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.orders')
    .controller('AgreementCatalogController', [
        '$rootScope',
        '$scope',
        '$location',
        'OrderRequest',
        'BlankCheck',
        'AgreementFactory',
        'ContractFactory',
        '$routeParams',
        function(
            $rootScope,
            $scope,
            $location,
            Orders,
            BlankCheck,
            Aggrements,
            Contracts,
            $routeParams
        ){
            //multi, none, single
            $scope.print = false;
            $scope.export = false;
            $scope.type = $routeParams.type.toUpperCase();
            $scope.showBillingOptions = 'none';
            $scope.showAgreements = 'none';
            $scope.showContracts = 'none';
            //hardware, multi, supplies, none
            $scope.showCatalogTypes = 'none';
            $scope.configure = {
                 actions:{
                    submit: function() {
                        Orders.tempSpace = {};
                        Orders.newMessage();
                        Orders.tempSpace = {
                            'catalogCart': {
                                'billingModels': $scope.paySelection,
                                'catalog': $scope.catalog,
                                'contract': $scope.contractObject,
                                'agreement': $scope.agreementObject
                            }
                        };
                        $location.path($location.path() + '/cart');
                    },
                    disabled: true
                }
            };
            if($scope.type === 'HARDWARE'){
                $scope.configure.header = {
                    translate:{
                        h1:'ORDER_CATALOGS.DEVICE_CATALOG.TXT_DEVICE_CATALOG_ORDER',
                        body:'ORDER_CATALOGS.DEVICE_CATALOG.TXT_DEVICE_CATALOG_PAR'
                    }
                };
                $scope.configure.actions.translate = {
                        abandonRequest:'ORDER_CATALOGS.DEVICE_CATALOG.BTN_DEVICE_ORDER_ABANDON',
                        submit: 'ORDER_CATALOGS.DEVICE_CATALOG.BTN_DEVICE_ORDER_SUBMIT'
                };
                $scope.catalog = 'device';
            }else if($scope.type  === 'SUPPLIES'){
                $scope.configure.header = {
                    translate:{
                        h1:'ORDER_CATALOGS.SUPPLIES_CATALOG.TXT_SUPPLIES_CATALOG_ORDER',
                        body:'ORDER_CATALOGS.SUPPLIES_CATALOG.TXT_SUPPLIES_CATALOG_PAR'
                    }
                };
                $scope.configure.actions.translate = {
                        abandonRequest:'ORDER_CATALOGS.SUPPLIES_CATALOG.BTN_ORDER_ABANDON_SUPPLIES',
                        submit: 'ORDER_CATALOGS.SUPPLIES_CATALOG.BTN_ORDER_SUBMINT_SUPPLIES'
                };
                $scope.catalog = 'supplies';
            }

            function checkBilling(){
                if(Contracts && Contracts.item && Contracts.item.billingModels){
                   var isShipBill =  $.inArray('SHIP_AND_BILL', Contracts.item.billingModels);
                   if(isShipBill > -1){
                        $scope.showBillingOptions = 'multi';
                   }else{
                        $scope.showBillingOptions = 'single';
                        $scope.showCatalogTypes = $routeParams.type.toUpperCase();
                        $scope.paySelection = Contracts.item.billingModels;
                   }
                   $scope.configure.actions.disabled = false;
                }else{
                        $scope.showBillingOptions = 'none';
                }
            }
            function catalogOptions(){
                if($scope.contract && $scope.type === 'HARDWARE' && $scope.paySelection ==='SHIP_AND_BILL'){
                    $scope.showCatalogTypes = 'multi';
                }else if($scope.contract && $scope.type === 'HARDWARE' && $scope.paySelection ==='payLater'){
                    $scope.showCatalogTypes = $scope.type;
                    $scope.catalogSelection = 'device';
                    $scope.catalog = $scope.catalogSelection;
                }else if($scope.contract && $scope.type === 'SUPPLIES' && $scope.paySelection ==='payLater'){
                    $scope.showCatalogTypes = $scope.type;
                    $scope.catalogSelection = 'supplies';
                    $scope.catalog = $scope.catalogSelection;
                }else{
                    $scope.showCatalogTypes = 'none';
                    $scope.configure.actions.disabled = false;
                }
            }

            $scope.setAcceptedPayChoice= function(){
                if($scope.paySelection === 'SHIP_AND_BILL'){
                    catalogOptions();
                }
            };
            $scope.onAgreementSelected = function(option){
                if(option && option.id){
                    Contracts.item = {};
                    $scope.agreementObject = option;
                    checkBilling();
                    var contractOptons = {
                        params:{
                            type:$scope.type,
                            agreementId:option.id
                        }
                    };
                    Contracts.get(contractOptons).then(function(){
                        $scope.contracts = Contracts.data;
                        $scope.contract = undefined;
                        checkBilling();
                        if($scope.contracts && $scope.contracts.length > 1){
                            $scope.showContracts = 'multi';
                        }else if($scope.contracts && $scope.contracts.length == 1){
                            $scope.onContractSelected($scope.contracts[0]);
                            $scope.showContracts = 'single';
                            $scope.contract = $scope.contracts[0];
                        }
                        });
                }else{
                    Contracts.item = {};
                    checkBilling();
                    $scope.showContracts = 'none';
                    $scope.contract = undefined;
                }

            };
            $scope.onContractSelected = function(option){
                if(option && option.id){
                    $scope.contractObject = option;
                    Contracts.setItem(option);
                    var options = {
                        params:{
                            type:$scope.type
                        }
                    };

                    Contracts.item.get(options).then(function(response){
                        Contracts.setItem(response.data);
                        checkBilling();
                    });
                }else{
                    Contracts.item = {};
                    checkBilling();
                    $scope.contract = undefined;
                }
            };

            var agreementOptons = {
                params:{
                    type:$scope.type
                }
            };
            Aggrements.get(agreementOptons).then(function(){
                $scope.agreements = Aggrements.data;
                if($scope.agreements && $scope.agreements.length > 1){
                    $scope.showAgreements = 'multi';
                }else if($scope.agreements && $scope.agreements.length === 1){
                    $scope.showAgreements = 'single';
                    $scope.agreement = agreements[0];
                }else{
                    $scope.showAgreements = 'none';
                }
            });

        }]);
});

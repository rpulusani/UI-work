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

            function checkBilling(){
                if(Contracts && Contracts.item && Contracts.item.billingModels){
                   var isShipBill =  $.inArray('SHIP_AND_BILL', Contracts.item.billingModels);
                   if(isShipBill > -1){
                        $scope.showBillingOptions = 'multi';
                   }else{
                        $scope.showBillingOptions = 'single';
                        $scope.showCatalogTypes = $routeParams.type.toUpperCase();
                   }
                }else{
                        $scope.showBillingOptions = 'none';
                }
            }
            function catalogOptions(){
                if($scope.type === 'SUPPLIES'){
                    $scope.showCatalogTypes = $scope.type;
                }else if($scope.type === 'HARDWARE' && $scope.paySelection ==='payNow'){
                    $scope.showCatalogTypes = 'multi';
                }else if($scope.type === 'HARDWARE' && $scope.paySelection ==='payLater'){
                    $scope.showCatalogTypes = $scope.type;
                }else{
                    $scope.showCatalogTypes = 'none';
                }
            }

            $scope.setAcceptedPayChoice= function(){

            };
            $scope.onAgreementSelected = function(option){
                console.log(option);
                if(option && option.id){
                    Contracts.item = {};
                    checkBilling();
                    var contractOptons = {
                        params:{
                            type:$scope.type,
                            agreementId:option.id
                        }
                    };
                    Contracts.get(contractOptons).then(function(){
                        $scope.contracts = Contracts.data;
                        checkBilling();
                        if($scope.contracts && $scope.contracts.length > 1){
                            $scope.showContracts = 'multi';
                        }else if($scope.contracts && $scope.contracts.length == 1){
                            $scope.onContractSelected($scope.contracts[0]);
                            $scope.showContracts = 'single';
                        }
                        });
                }else{
                    Contracts.item = {};
                    checkBilling();
                    $scope.showContracts = 'none';
                }

            };
            $scope.onContractSelected = function(option){
                if(option && option.id){
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
                }else{
                    $scope.showAgreements = 'none';
                }
            });

        }]);
});

define(['angular','serviceRequest', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.orders')
    .controller('OrderActionButtonsController', [
        '$rootScope',
        '$scope',
        '$location',
        'OrderRequest',
        'BlankCheck',
        function(
            $rootScope,
            $scope,
            $location,
            Orders,
            BlankCheck
        ){
            $scope.goToSuppliesDeviceCreate = function(){
                $location.path(Orders.route + '/create_asset_supplies');
            };
            $scope.goToHardwareCreate = function(){
                $location.path(Orders.route + '/create_hardware');
            };
            $scope.goToReturnSuppliesCreate = function(){
                $location.path(Orders.route + '/supply/return/review');
            };
            $scope.goToSuppliesCatalogCreate = function(){
                $location.path(Orders.route + '/create_catalog_supplies');
            };
        }
    ]);
});

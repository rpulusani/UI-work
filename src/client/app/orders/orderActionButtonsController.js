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
                Orders.newMessage();
                Orders.tempSpace = {};
                $location.path(Orders.route + '/create_asset_supplies');
            };
            $scope.goToHardwareCreate = function(){
                Orders.newMessage();
                Orders.tempSpace = {};
                $location.path(Orders.route + '/create_hardware');
            };
            $scope.goToReturnSuppliesCreate = function(){
                Orders.newMessage();
                Orders.tempSpace = {};
                $location.path(Orders.route + '/supply/return/review');
            };
            $scope.goToSuppliesCatalogCreate = function(){
                Orders.newMessage();
                Orders.tempSpace = {};
                $location.path(Orders.route + '/create_catalog_supplies');
            };
        }
    ]);
});

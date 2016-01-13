define(['angular','serviceRequest', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.orders')
    .controller('OrderActionButtonsController', [
        '$rootScope',
        '$scope',
        '$location',
        'BlankCheck',
        function(
            $rootScope,
            $scope,
            $location,
            BlankCheck
        ){
            $scope.goToSuppliesDeviceCreate = function(){
                Contacts.item = {};
                $location.path(Contacts.route + '/new');
            };
            $scope.goToHardwareCreate = function(){
                Addresses.item = {};
                $location.path(Addresses.route + '/new');
            };
            $scope.goToReturnSuppliesCreate = function(){
                Contacts.item = {};
                $location.path(Contacts.route + '/new');
            };
            $scope.goToSuppliesCatalogCreate = function(){
                Addresses.item = {};
                $location.path(Addresses.route + '/new');
            };
        }
    ]);
});

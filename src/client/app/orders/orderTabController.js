define(['angular','order', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.orders')
    .controller('OrderTabController', [
        '$rootScope',
        '$scope',
        'SecurityHelper',
        function(
            $rootScope,
            $scope,
            SecurityHelper
        ) {
            new SecurityHelper($rootScope).redirectCheck($rootScope.orderAccess);
            $scope.active = function(value){
                $rootScope.serviceTabSelected = value;
            };

            $scope.isActive = function(value){
                var passed = false;
                if($rootScope.serviceTabSelected === value){
                    passed = true;
                }
                return passed;
            };

            $scope.active('orderAllTab');
        }
    ]);
});

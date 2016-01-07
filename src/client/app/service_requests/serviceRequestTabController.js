define(['angular','serviceRequest', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('ServiceRequestTabController', [
        '$rootScope',
        '$scope',
        'SecurityHelper',
        function(
            $rootScope,
            $scope,
            SecurityHelper
        ) {
            new SecurityHelper($rootScope).redirectCheck($rootScope.serviceRequestAccess);
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

            if(!$rootScope.serviceTabSelected){
                $scope.active('serviceRequestsAllTab');
            }
        }
    ]);
});

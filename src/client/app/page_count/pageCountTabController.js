
'use strict';
angular.module('mps.pageCount')
.controller('PageCountTabController', [
    '$rootScope',
    '$scope',
    'SecurityHelper',
    function(
        $rootScope,
        $scope,
        SecurityHelper
    ) {
        //new SecurityHelper($rootScope).redirectCheck($rootScope.orderAccess);
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

        $scope.active('allPageCountTab');
    }
]);



'use strict';
angular.module('mps.serviceRequestAddresses')
.controller('OpenServiceRequestController', [
    '$rootScope',
    '$scope',
    '$location',
    'ServiceRequestService',
    function(
        $rootScope,
        $scope,
        $location,
        ServiceRequest
    ) {
    $scope.actionLink = function(fn){
            if(fn && typeof fn === 'function'){
                fn();
            }else{
            }
        };

    }
]);


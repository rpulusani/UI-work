define(['angular', 'deviceServiceRequest'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .controller('DeviceSearchController', ['$scope', '$location',
        function($scope, $location) {

            $scope.serial = '';

            $scope.goToSubmit = function() {
                console.log($scope.serial);
            };

        }
    ]);
});

define(['angular', 'deviceManagement', 'deviceManagement.deviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceController', ['$scope', '$location', 'Devices',
        function($scope, $location, Device) {
            $scope.goToReview = function(device) {
                $location.path('/device_management/' + device.id + '/review');
            };
        }
    ]);
});

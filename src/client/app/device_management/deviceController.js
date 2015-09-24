define(['angular', 'deviceManagement', 'deviceManagement.deviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceController', ['$scope', '$location', 'Device',
        function($scope, $location, Device) {
            $scope.goToReview = function(id) {
                $location.path('/device_management/' + id + '/review');
            };
        }
    ]);
});

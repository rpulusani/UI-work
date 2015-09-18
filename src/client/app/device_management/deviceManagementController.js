define(['angular', 'deviceManagement'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceManagementController', ['$scope', '$location', 'Device',
        function($scope, $location, Device) {
            var acctId = 1;
            $scope.devices = Device.query({accountId: acctId});
            $scope.goToRead = function(id) {
                $location.path('/device_management/' + id + '/review');
            };
        }
    ])
});

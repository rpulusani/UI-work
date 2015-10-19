define(['angular', 'deviceServiceRequest', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .controller('DeviceSearchController', ['$scope', '$location', 'grid', 'DeviceSearch',
        function($scope, $location, Grid, DeviceSearch) {

            $scope.serial = '';
            $scope.gridOptions = {};

            $scope.goToSubmit = function() {
                console.log($scope.serial);
                $scope.queryBySerial($scope.serial);

            };

            $scope.queryBySerial = function(query) {
                DeviceSearch.getPage().then(function() {
                    Grid.display(DeviceSearch, $scope);
                }, function(reason) {
                    NREUM.noticeError('Grid Load Failed for ' + DeviceSearch.serviceName +  ' reason: ' + reason);
                });
            };
        } 
    ]);
});

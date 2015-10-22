define(['angular', 'deviceManagement', 'deviceManagement.devicePickerFactory', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DevicePickerController', ['$scope', '$location', 'grid', 'DevicePicker', '$rootScope',
        'PersonalizationServiceFactory',
        function($scope, $location, Grid, DevicePicker, $rootScope, Personalize) {
            $rootScope.currentAccount = '1-21AYVOT';
            $rootScope.currentRowList = [];
            var personal = new Personalize($location.url(), $rootScope.idpUser.id);

            $scope.isRowSelected = function(){
                if ($scope.currentRowList.length >= 1) {
                   return true;
                } else {
                   return false;
                }
            };

            $scope.goToDeviceAdd = function(){
                var returned = 'return';
                $location.path('/service_requests/devices/new/'+returned);
            };

            $scope.discardDeviceSelection = function(){
                var returned = 'discard';
                $location.path('/service_requests/devices/new/'+returned);
            };

            $scope.gridOptions = {};
            $scope.gridOptions.multiSelect = false;
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, DevicePicker, personal);

            DevicePicker.getPage().then(function() {
                Grid.display(DevicePicker, $scope, personal);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + DevicePicker.serviceName +  ' reason: ' + reason);
            });
        }
    ]);
});

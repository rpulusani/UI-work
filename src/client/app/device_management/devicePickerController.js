define(['angular', 'deviceManagement', 'deviceManagement.devicePickerFactory'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DevicePickerController', ['$scope', '$location', 'gridService', 'DevicePicker', '$rootScope',
        function($scope, $location, GridService, DevicePicker, $rootScope) {
            $rootScope.currentAccount = '1-21AYVOT';

            $scope.gridOptions = {};
            
            GridService.getGridOptions(DevicePicker, '').then(
                function(options){
                    $scope.gridOptions = options;
                    //$scope.gridOptions.multiSelect = false;
                    $scope.pagination = GridService.pagination(DevicePicker, $rootScope);
                    
                    DevicePicker.resource($rootScope.currentAccount, 0).then(
                        function(response){
                            $scope.gridOptions.data = DevicePicker.getList();
                        }
                    );
                },
                function(reason){
                     NREUM.noticeError('Grid Load Failed: ' + reason);
                }
            );
        }
    ]);
});

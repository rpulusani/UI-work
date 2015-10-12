define(['angular', 'deviceManagement', 'deviceManagement.devicePickerFactory', 'ui.grid'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DevicePickerController', ['$scope', '$location', 'gridService', 'DevicePicker', '$rootScope',
        function($scope, $location, GridService, DevicePicker, $rootScope) {
            $rootScope.currentAccount = '1-21AYVOT';
            $rootScope.currentRowList = [];

            $scope.isRowSelected = function(){
                if ($scope.currentRowList.length === 1) {
                   return true;
                } else {
                   return false;
                }
            };

            $scope.goToDeviceAdd = function(){
                var returned = 'return';
                $location.path('/service_requests/devices/new/'+returned);
            };

            $scope.gridOptions = {};
            $scope.gridOptions.multiSelect = false;
            $scope.gridOptions.onRegisterApi = GridService.getGridActions($rootScope, DevicePicker);
            GridService.getGridOptions(DevicePicker, '').then(
                function(options){
                    $scope.gridOptions = options;
                    $scope.pagination = GridService.pagination(DevicePicker, $rootScope);
                    $scope.itemsPerPage = DevicePicker.getPersonalizedConfiguration('itemsPerPage');

                    var params =[
                        {
                            name: 'accountIds',
                            value: "'1-21AYVOT'"
                        },
                        {
                            name: 'size',
                            value: $scope.itemsPerPage
                        },
                        {
                            page: 'page',
                            value: 0
                        }
                    ];
                    DevicePicker.resource(params).then(
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

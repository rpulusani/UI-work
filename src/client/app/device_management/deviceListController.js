define(['angular', 'deviceManagement', 'deviceManagement.deviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceListController', ['$scope', '$location', 'gridService', 'Devices', '$rootScope',
        function($scope, $location, GridService, Devices, $rootScope) {
            $rootScope.currentAccount = '1-21AYVOT';
            
            $scope.goToCreate = function() {
                $location.path('/service_requests/devices/new');
            };

            $scope.gridOptions = {};
            
            GridService.getGridOptions(Devices, '').then(
                function(options){
                    $scope.gridOptions = options;
                    $scope.pagination = GridService.pagination(Devices, $rootScope);
                    
                    Devices.resource($rootScope.currentAccount, 0).then(
                        function(response){
                            $scope.gridOptions.data = Devices.getList();
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

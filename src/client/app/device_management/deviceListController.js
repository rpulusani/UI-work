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
                    $scope.itemsPerPage = Devices.getPersonalizedConfiguration('itemsPerPage');

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
                    
                    Devices.resource(params).then(
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

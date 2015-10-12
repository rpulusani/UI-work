define(['angular', 'deviceManagement', 'deviceManagement.deviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceListController', ['$scope', '$location', 'gridService', 'Devices', '$rootScope',
        function($scope, $location, GridService, Devices, $rootScope) {
            $rootScope.currentAccount = '1-21AYVOT';
            $rootScope.currentRowList = [];

            $scope.goToCreate = function() {
                $location.path('/service_requests/devices/new');
            };

            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = GridService.getGridActions($rootScope, Devices);
            Devices.setRequiredParams([{name: 'accountIds', value: $rootScope.currentAccount }]);
            GridService.getGridOptions(Devices, '').then(
                function(options){
                    $scope.gridOptions = options;
                    $scope.pagination = GridService.pagination(Devices, $rootScope);
                    $scope.itemsPerPage = Devices.getPersonalizedConfiguration('itemsPerPage');

                    var params =[
                        {
                            name: 'size',
                            value: $scope.itemsPerPage
                        },
                        {
                            page: 'page',
                            value: 0
                        }
                    ];

                    Devices.resource(Devices.getFullParamsList(params)).then(
                        function(response){
                            $scope.gridOptions.data = Devices.getGRIDList();
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

define(['angular', 'deviceManagement', 'deviceManagement.deviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceListController', ['$scope', '$location', 'grid', 'Devices', '$rootScope',
        'PersonalizationServiceFactory',
        function($scope, $location, Grid, Devices, $rootScope, Personalize) {
            $rootScope.currentAccount = '1-21AYVOT';
            $rootScope.currentRowList = [];
            var personal = new Personalize($location.url(),$rootScope.idpUser.id);
            $scope.goToCreate = function() {
                Devices.item = {};
                $location.path('/service_requests/devices/new');
            };

            $scope.view = function(device){
                Devices.setItem(device);
                var options = {
                    params:{
                        embed:'contact,address'
                    }
                };
                Devices.item.links.self(options).then(function(){
                    Devices.item = Devices.item.self.item;
                    $location.path(Devices.route + '/' + device.id + '/review');

                });
            };

            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Devices, personal);
            Devices.getPage().then(function() {
                Grid.display(Devices, $scope, personal);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + Devices.serviceName +  ' reason: ' + reason);
            });
        }
    ]);
});

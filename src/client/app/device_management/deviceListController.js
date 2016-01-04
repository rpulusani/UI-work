define(['angular', 'deviceManagement', 'deviceManagement.deviceFactory', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceListController', ['$scope', '$location', 'grid', 'Devices', '$rootScope',
        'PersonalizationServiceFactory', 'FilterSearchService',
        function($scope, $location, Grid, Devices, $rootScope, Personalize, FilterSearchService) {
            $rootScope.currentRowList = [];
            $scope.visibleColumns = [];
            var personal = new Personalize($location.url(),$rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(Devices, $scope, $rootScope, personal);

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

                Devices.item.get(options).then(function(){
                    $location.path(Devices.route + '/' + device.id + '/review');
                });
            };
            filterSearchService.addBasicFilter('DEVICE_MGT.ALL_DEVICES', {'embed': 'address,contact'});
            //filterSearchService.addBasicFilter('DEVICE_MGT.BOOKMARKED_DEVICES');
            //filterSearchService.addPanelFilter('Filter By Location', 'locationFilter');
            filterSearchService.addPanelFilter('Filter By CHL', 'CHLFilter');
                $scope.$broadcast('setupColumnPicker', Grid);
        }
    ]);
});

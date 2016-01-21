define(['angular', 'deviceManagement', 'deviceManagement.deviceFactory', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceListController', [
        '$scope',
        '$location',
        'grid',
        'Devices',
        '$rootScope',
        'PersonalizationServiceFactory',
        'FilterSearchService',
        'SecurityHelper',
        '$window',
        '$timeout',
        'lbsURL',
        function(
            $scope,
            $location,
            GridService,
            Devices,
            $rootScope,
            Personalize,
            FilterSearchService,
            SecurityHelper,
            $window,
            $timeout,
            lbsURL
            ) {
            $rootScope.currentRowList = [];
            $scope.visibleColumns = [];

            new SecurityHelper($rootScope).redirectCheck($rootScope.deviceAccess);
            var personal = new Personalize($location.url(),$rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(Devices, $scope, $rootScope, personal);


            $scope.goToCreate = function() {
                Devices.item = {};
                $location.path('/service_requests/devices/new');
            };
            $scope.goToLBS = function(){
                $window.open(lbsURL);
                $timeout(function(){
                    $('#deviceListTabOutter a').click();
                }, 0);

                return false;
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

            filterSearchService.addBasicFilter('DEVICE_MGT.ALL_DEVICES', {'embed': 'address,contact'}, false,
                function(Grid) {
                    setTimeout(function() {
                        $scope.$broadcast('setupColumnPicker', Grid);
                    }, 500);
                }
            );
            //filterSearchService.addBasicFilter('DEVICE_MGT.BOOKMARKED_DEVICES');
            //filterSearchService.addPanelFilter('Filter By Location', 'locationFilter');
            filterSearchService.addPanelFilter('SERVICE_REQUEST.FILTER_BY_CHL', 'CHLFilter');

        }
    ]);
});

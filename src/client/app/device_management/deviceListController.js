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
    'ServiceRequestService',
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
        lbsURL,
        ServiceRequest
        ) {
        $rootScope.currentRowList = [];
        $scope.visibleColumns = [];

        new SecurityHelper($rootScope).redirectCheck($rootScope.deviceAccess);
        var personal = new Personalize($location.url(),$rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(Devices, $scope, $rootScope, personal);

        ServiceRequest.reset();

        $scope.goToCreate = function() {
            Devices.item = {};
            ServiceRequest.reset();
            $location.path('/service_requests/devices/new');
        };
        
        $scope.goToOrderDevice = function() {
            Devices.reset();
            ServiceRequest.reset();
            $location.path('/orders/catalog/hardware');
        };
        $scope.goToOrderSupplyCatalog = function() {
            Devices.reset();
            ServiceRequest.reset();
            $location.path('/orders/catalog/supplies');
        };

        $scope.goToPageCount = function() {
            $location.path('/page_count');
        };
        $scope.goToLBS = function(){
            $window.open(lbsURL);
            $timeout(function(){
                $('#deviceListTabOutter a').click();
            }, 0);

            return false;
        };
        $scope.goToSuppliesOrder = function(device) {
            Devices.setItem(device);
            var options = {
                params:{
                    embed:'contact,address'
                }
            };

            Devices.item.get(options).then(function(){
                $location.search('tab', 'orderTab');
                $location.path(Devices.route + '/' + device.id + '/review');
            });
        };
        $scope.goToRequestService = function(device) {
            Devices.setItem(device);
            var options = {
                params:{
                    embed:'contact,address'
                }
            };
            window.scrollTo(0,0);
            Devices.item.get(options).then(function(){
                $location.path('/service_requests/devices/' + device.id + '/view');
            });
        };
        $scope.goToUpdatePageCount = function(device) {
            Devices.setItem(device);
            var options = {
                params:{
                    embed:'contact,address'
                }
            };

            Devices.item.get(options).then(function(){
                $location.search('tab', 'pageCountTab');
                $location.path(Devices.route + '/' + device.id + '/review');
            });
        };
        $scope.goToUpdate = function(device) {
            Devices.setItem(device);
            var options = {
                params:{
                    embed:'contact,address'
                }
            };
            window.scrollTo(0,0);
            Devices.item.get(options).then(function(){
                $location.path('/service_requests/devices/' + device.id + '/update');
            });
        };
        $scope.goToOrderAnother = function(device) {
            Devices.item = {};
            $location.path('/orders/catalog/hardware');
        };
        $scope.goToDelete = function(device) {
            Devices.setItem(device);
            var options = {
                params:{
                    embed:'contact,address'
                }
            };
            window.scrollTo(0,0);
            Devices.item.get(options).then(function(){
                $location.path('/service_requests/devices/decommission/' + device.id + '/view');
            });
        };

        $scope.selectRow = function(btnType) {
            if (btnType === 'orderSupplies') {
                $scope.goToSuppliesOrder($scope.gridApi.selection.getSelectedRows()[0]);
            } else if (btnType === 'requestService') {
                $scope.goToRequestService($scope.gridApi.selection.getSelectedRows()[0]);
            } else if (btnType === 'updatePageCounts') {
                $scope.goToUpdatePageCount($scope.gridApi.selection.getSelectedRows()[0]);
            } else if (btnType === 'edit') {
                $scope.goToUpdate($scope.gridApi.selection.getSelectedRows()[0]);
            } else if (btnType === 'move') {
                $scope.goToUpdate($scope.gridApi.selection.getSelectedRows()[0]);
            } else if (btnType === 'orderAnother') {
                $scope.goToOrderAnother($scope.gridApi.selection.getSelectedRows()[0]);
            } else if (btnType === 'delete') {
                $scope.goToDelete($scope.gridApi.selection.getSelectedRows()[0]);
            }
        };

        $scope.view = function(device){
            Devices.setItem(device);
            var options = {
                params:{
                    embed:'contact,address'
                }
            };

            Devices.item.get(options).then(function(){
                $location.search('tab', 'deviceInfoTab');
                $location.path(Devices.route + '/' + device.id + '/review');
            });
        };

        var removeParamsList = ['bookmarkFilter', 'chlFilter', 'location'];

            filterSearchService.addBasicFilter('DEVICE_MAN.MANAGE_DEVICES.FILTER_ALL_DEVICES', {'embed': 'address,contact'}, removeParamsList,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }, 500);

                $scope.$broadcast('setupPrintAndExport', $scope);

            }
        );
        filterSearchService.addPanelFilter('SERVICE_REQUEST.FILTER_BY_CHL', 'CHLFilter', undefined,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }, 500);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
        filterSearchService.addPanelFilter('SERVICE_REQUEST.FILTER_BY_LOCATION', 'LocationFilter', undefined,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }, 500);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );
            filterSearchService.addPanelFilter('DEVICE_MAN.MANAGE_DEVICES.FILTER_BOOKMARKED_DEVICES', 'BookmarkFilter', undefined,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }, 500);
                $scope.$broadcast('setupPrintAndExport', $scope);
            }
        );

    }
]);

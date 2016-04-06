
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
    'OrderRequest',
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
        ServiceRequest,
        Orders
        ) {
        $rootScope.currentRowList = [];
        $scope.visibleColumns = [];

        new SecurityHelper($rootScope).redirectCheck($rootScope.deviceAccess);
        var personal = new Personalize($location.url(),$rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(Devices, $scope, $rootScope, personal);

        ServiceRequest.reset();

        $scope.breadcrumbs = {
            1: {
                href: "/device_management",
                value: "DEVICE_MAN.MANAGE_DEVICES.TXT_MANAGE_DEVICES"
            }
        };

        Devices.updatingMultiple = false;

        $scope.goToCreate = function() {
            Devices.reset();
            ServiceRequest.reset();
            Devices.item = {};
            $location.path('/service_requests/devices/new');
        };

        $scope.goToOrderDevice = function() {
            Devices.reset();
            ServiceRequest.reset();
            Devices.item = {};
            $location.path('/orders/catalog/hardware');
        };
        $scope.goToOrderSupplyCatalog = function() {
            Devices.reset();
            Orders.reset();
            Devices.item = {};
            Orders.item = {};
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
        $scope.goToUpdate = function(devices) {
            var device,
            i = 0,
            deviceCnt = 0,
            options = {
                params:{
                    embed:'contact,address'
                }
            };

            if (!angular.isArray(devices)) {
                devices = [devices];
            }

            if (devices.length === 1) {
                device = devices[0];

                Devices.setItem(device);

                window.scrollTo(0,0);

                Devices.item.get(options).then(function(){
                    $location.path('/service_requests/devices/' + device.id + '/update');
                });
            } else {
                Devices.updatingMultiple = true;
                Devices.data = devices;

                for (i; i < Devices.data.length; i += 1) {
                    (function(device, index) {
                        device = Devices.data[index];

                        Devices.setItem(device);

                        Devices.item.get(options).then(function(){

                            deviceCnt += 1;

                            if (deviceCnt === Devices.data.length) {
                                $location.path('/service_requests/devices/update-multiple');
                            }
                        });
                    }(devices[i], i));
                }
            }
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
                $scope.goToUpdate($scope.gridApi.selection.getSelectedRows());
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

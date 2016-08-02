
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
    'SiebelStatus',
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
        Orders,
        SiebelStatus
        ) {
        $rootScope.currentRowList = [];
        $scope.visibleColumns = [];

        if(!$rootScope.deviceAccess){
            new SecurityHelper($rootScope).confirmPermissionCheck("deviceAccess");    
        }

        var personal = new Personalize($location.url(),$rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(Devices, $scope, $rootScope, personal);

        ServiceRequest.reset();
        $rootScope.preBreadcrumb = {
                href: "/device_management",
                value: "DEVICE_MAN.MANAGE_DEVICES.TXT_MANAGE_DEVICES"
            }
        $scope.breadcrumbs = {
            1: $rootScope.preBreadcrumb
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
            Orders.newMessage();
            Orders.tempSpace = {};
            Orders.sourcePage = $location.path(); 
            $location.path('/orders/catalog/hardware');
        };
        $scope.goToOrderSupplyCatalog = function() {
            Devices.reset();
            Orders.reset();
            Devices.item = {};
            Orders.item = {};
            Orders.sourcePage = $location.path(); 
            $location.path('/orders/catalog/supplies');
        };

        $scope.goToPageCount = function() {
            $location.path('/page_count');
        };
        $scope.goToLBS = function(){
            $window.open(lbsURL);
            $timeout(function(){
                $('#deviceListTabOutter a').click();
                $scope.active('deviceListTab');
                $('deviceListTabOutter').addClass('set--is-active');
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
                    $location.search('search', null);
                    $location.search('searchOn', null);
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
                    embed:'contact,address,chl,account'
                }
            };

            Devices.item.get(options).then(function(){
                $location.search('search', null);
                $location.search('searchOn', null);
                $location.search('tab', 'deviceInfoTab');
                $location.path(Devices.route + '/' + device.id + '/review');
            });
        };

        $scope.active = function(value){
            $rootScope.serviceTabSelected = value;
        };

        $scope.isActive = function(value){
            var passed = false;
            if($rootScope.serviceTabSelected === value){
                passed = true;
            }
            return passed;
        };

        $scope.active('deviceListTab');

        var removeParamsList = ['bookmarkFilter', 'chlFilter', 'location', 'search', 'searchOn', 'addressId'];

        filterSearchService.addBasicFilter('DEVICE_MAN.MANAGE_DEVICES.FILTER_ALL_DEVICES', {'embed': 'address,contact,account'}, removeParamsList,
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

            var configPermissions = [];
            configPermissions = angular.copy($rootScope.configurePermissions);
            $scope.deviceActionPermissions = {};          		
            		
            
            function setupInitDevicePermissions(){
                $scope.deviceActionPermissions.orderSuppliesAsset = $rootScope.orderSuppliesAsset;
                $scope.deviceActionPermissions.createBreakFixAccess = $rootScope.createBreakFixAccess;
                $scope.deviceActionPermissions.pageCountAccess = $rootScope.pageCountAccess;
                $scope.deviceActionPermissions.updateDevice = $rootScope.updateDevice;
                $scope.deviceActionPermissions.moveDevice = $rootScope.moveDevice;
                $scope.deviceActionPermissions.orderDevice = $rootScope.orderDevice;
                $scope.deviceActionPermissions.decommissionAccess = $rootScope.decommissionAccess;
        		
            }
            setupInitDevicePermissions();
            Devices.onSelectRow = function(row){
            	/** This method is to check individual button permission on select of the 
            	 * asset row. */
            	if($rootScope.currentRowList.length === 0){
            		setupInitDevicePermissions();
            	} 
                var helperDeviceSelect = new SecurityHelper($scope.deviceActionPermissions);
            	var accId = row.entity._embedded.account.accountId,
            	i=0,
            	acntPermissions,
            	accounts = $rootScope.currentUser.transactionalAccount.data;
            	
            	if ($rootScope.currentRowList.length == 1){
            		for(;i<accounts.length;i++){
                		if(accounts[i].account.accountId === accId){
                			acntPermissions = accounts[i].permisssions.permissions;
                			
                			break;
                		}
                	}
            		$scope.deviceActionPermissions.security.setWorkingPermission(acntPermissions);
            		helperDeviceSelect.setupPermissionList(configPermissions);
            	}
            	
            };  
            $scope.siebelDown = false;
            SiebelStatus.get().then(function(response){
            	 $scope.siebelDown = (response.data.errorcode === 1? true : false); 
            });
    }
]);

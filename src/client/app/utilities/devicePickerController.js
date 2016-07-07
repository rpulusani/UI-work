

angular.module('mps.utility')
.controller('DevicePickerController', ['$scope', '$location', 'grid', 'Devices',
    'BlankCheck', 'FormatterService', '$rootScope', '$routeParams', 'PersonalizationServiceFactory', '$controller', 'imageService',
    'Contacts','$q','$timeout',
    function($scope, $location, GridService, Devices, BlankCheck, FormatterService, $rootScope, $routeParams,
        Personalize, $controller, ImageService, Contacts,$q,$timeout) {
        if(Devices.item && Object.keys(Devices.item).length !== 0){
            $rootScope.deviceToRegisterInPicker = angular.copy(Devices.item);
        }
        $scope.selectedDevice = undefined;
        $rootScope.currentSelectedRow = undefined;
        $scope.prevDevice={};

        var personal = new Personalize($location.url(), $rootScope.idpUser.id);

        if ($rootScope.currentSelectedRow ) {
            $scope.selectedDevice = $rootScope.currentSelectedRow;
        }

        if($rootScope.selectedDevice) {
            $rootScope.selectedDevice = undefined;
        }

        if(!$scope.singleDeviceSelection){
            $scope.singleDeviceSelection = false;
        }

        configureTemplates();

        $scope.sourceController = function() {
            return $controller($routeParams.source + 'Controller', { $scope: $scope }).constructor;
        };

        $scope.isRowSelected = function(){
            if ($rootScope.currentSelectedRow) {
               $rootScope.selectedDevice = $rootScope.currentSelectedRow;
               if($rootScope.returnPickerObjectDevice.deviceDeInstallQuestion){
                    $scope.prevDevice.selectedDevice = $rootScope.selectedDevice;
                }
                else{
                    $scope.selectedDevice = $rootScope.selectedDevice;
                }
               return true;
            } else {
               return false;
            }
        };

        $scope.$watch('prevDevice.selectedDevice',function(){
            if ($scope.prevDevice.selectedDevice && $scope.prevDevice.selectedDevice.partNumber) {
                $scope.getPartImage($scope.prevDevice.selectedDevice.partNumber);
                $scope.getSelectedDeviceContact($scope.prevDevice.selectedDevice);
            }
        });

        $scope.$watch('selectedDevice', function() {
            if ($scope.selectedDevice && $scope.selectedDevice.partNumber) {
                $scope.getPartImage($scope.selectedDevice.partNumber);
                $scope.getSelectedDeviceContact($scope.selectedDevice);
            }
        });

        $scope.getPartImage = function(partNumber) {
            var imageUrl = '';
            ImageService.getPartMediumImageUrl(partNumber).then(function(url){
                if($rootScope.returnPickerObjectDevice.deviceDeInstallQuestion){
                    $scope.prevDevice.medImage = url;
                }
                else{
                    $scope.selectedImageUrl = url;
                }
            }, function(reason){
                 NREUM.noticeError('Image url was not found reason: ' + reason);
            });
        };

        $scope.getSelectedDeviceContact = function(selectedDevice) {
            if(selectedDevice){
                Devices.setItem(selectedDevice);
                var options = {
                    params:{
                        embed:'contact,address,account'
                    }
                };
                Devices.item.get(options).then(function(){
                    if(Devices.item && Devices.item.contact){
                        selectedDevice.contact = Devices.item.contact.item;
                        if($rootScope.returnPickerObjectDevice.deviceDeInstallQuestion){
                            $scope.formattedPrevDeviceContact = FormatterService.formatContact(selectedDevice.contact);
                        }
                        else{
                            $scope.formattedSelectedDeviceContact = FormatterService.formatContact(selectedDevice.contact);
                        }
                    }
                });
            }
        };

        $scope.goToCallingPage = function(){
            var url = $rootScope.deviceReturnPath;
            if($rootScope.currentSelectedRow && $rootScope.deviceReturnPath.indexOf("{{id}}") > -1){
                url = $rootScope.deviceReturnPath.replace("{{id}}", $rootScope.currentSelectedRow.id);
            }
            $location.path(url);
        };

        $scope.discardSelect = function(){
            $rootScope.selectedDevice = undefined;
            $rootScope.formattedDevice = undefined;
            $rootScope.currentSelectedRow = undefined;
            if($rootScope.deviceToRegisterInPicker){
                Devices.item = $rootScope.deviceToRegisterInPicker;
                $rootScope.deviceToRegisterInPicker = undefined;
            }
            $location.path($rootScope.deviceReturnPath);
        };

        var Grid = new GridService();
        $scope.gridOptions = {};
        $scope.gridOptions.multiSelect = false;
        $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Devices, personal);
        var options = {};
        options = {
            params:{
                embed:'address,contact,account'
            }
        };
        
        

        var visibleDefered = $q.defer();
        $scope.visibleColumns = visibleDefered.promise;
        $timeout(function(){
            visibleDefered.resolve(Grid.getVisibleColumns(Devices));
        }, 500);
        $scope.optionParams = {};
        $scope.searchFunctionDef = function(params, removeParamsList){
        	
        	params['embed'] = 'address,contact,account';
        	
        	options = {
        			params:params
        	};
        	Devices.params = {};
        	Devices.getPage(0, 20, options).then(function() {
                $scope.itemCount = Devices.data.length;
                Grid.display(Devices, $scope, personal);
                if(Devices.item.serialNumber === undefined){
                    $rootScope.devicesNotFoundInPicker = true;
                }
            });
        };
        
        if ($rootScope.returnPickerObjectDevice && $rootScope.returnPickerObjectDevice.selectedDevice) {
            $scope.prevDevice = $rootScope.returnPickerObjectDevice;
            if ($scope.prevDevice.selectedDevice.partNumber) {
                ImageService.getPartMediumImageUrl($scope.prevDevice.selectedDevice.partNumber).then(function(url){
                    $scope.prevDevice.medImage = url;
                }, function(reason){
                     NREUM.noticeError('Image url was not found reason: ' + reason);
                });
            }

           if ($scope.prevDevice.address && !$scope.singleDeviceSelection) {
                $scope.formattedSingleLineAddress = FormatterService.formatAddressSingleLine($scope.prevDevice.address);
                options.params.addressId = $scope.prevDevice.address.id;
            }

        }


        Devices.getPage(0, 20, options).then(function() {
            $scope.itemCount = Devices.data.length;
            Grid.display(Devices, $scope, personal);
            if(Devices.item.serialNumber === undefined){
                $rootScope.devicesNotFoundInPicker = true;
            }
        }, function(reason) {
            NREUM.noticeError('Grid Load Failed for ' + Devices.serviceName +  ' reason: ' + reason);
        });

        function configureTemplates() {
            $scope.configure = {
                header: {
                    translate: {
                        h1: $scope.header,
                        body: $scope.bodyText,
                        readMore: $scope.readMore
                    },
                    readMoreUrl: $scope.readMoreUrl,
                    showCancelBtn: false
                },
                breadcrumbs: {
                    1: {
                        href: "/device_management",
                        value: "DEVICE_MAN.MANAGE_DEVICES.TXT_MANAGE_DEVICES"
                    },
                    2: {
                        value: "REQUEST_MAN.REQUEST_SELECT_DEVICE_REMOVAL.LNK_SELECT_DEVICE"
                    } 
                }
            };
        }

    }
]);


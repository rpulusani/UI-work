

angular.module('mps.utility')
.controller('DevicePickerController', ['$scope', '$location', 'grid', 'Devices',
    'BlankCheck', 'FormatterService', '$rootScope', '$routeParams', 'PersonalizationServiceFactory', '$controller', 'imageService',
    'Contacts',
    function($scope, $location, GridService, Devices, BlankCheck, FormatterService, $rootScope, $routeParams,
        Personalize, $controller, ImageService, Contacts) {
        $rootScope.deviceToRegisterInPicker = angular.copy(Devices.item);
        $scope.selectedDevice = undefined;
        $rootScope.currentSelectedRow = undefined;

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
               $scope.selectedDevice = $rootScope.selectedDevice;
               return true;
            } else {
               return false;
            }
        };

        $scope.$watch('selectedDevice', function() {
            if ($scope.selectedDevice && $scope.selectedDevice.partNumber) {
                $scope.getPartImage($scope.selectedDevice.partNumber);
            }
            $scope.getSelectedDeviceContact();
        });

        $scope.getPartImage = function(partNumber) {
            var imageUrl = '';
            ImageService.getPartMediumImageUrl(partNumber).then(function(url){
                $scope.selectedImageUrl = url;
            }, function(reason){
                 NREUM.noticeError('Image url was not found reason: ' + reason);
            });
        };

        $scope.getSelectedDeviceContact = function() {
            if($scope.selectedDevice){
                Devices.setItem($scope.selectedDevice);
                var options = {
                    params:{
                        embed:'contact,address'
                    }
                };
                Devices.item.get(options).then(function(){
                    if(Devices.item && Devices.item.contact){
                        $scope.selectedDevice.contact = Devices.item.contact.item;
                        $scope.formattedSelectedDeviceContact = FormatterService.formatContact($scope.selectedDevice.contact);
                    }
                });
            }
        };

        $scope.goToCallingPage = function(){
            var url = $rootScope.deviceReturnPath;
            if($rootScope.deviceReturnPath.indexOf("{{id}}") > -1){
                url = $rootScope.deviceReturnPath.replace("{{id}}", $rootScope.currentSelectedRow.id);
            }
            $location.path(url);
        };

        $scope.discardSelect = function(){
            $rootScope.selectedDevice = undefined;
            $rootScope.formattedDevice = undefined;
            $rootScope.currentSelectedRow = undefined;
            $location.path($rootScope.deviceReturnPath);
        };

        var Grid = new GridService();
        $scope.gridOptions = {};
        $scope.gridOptions.multiSelect = false;
        $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Devices, personal);
        var options = {};
        options = {
            params:{
                embed:'contact'
            }
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
                breadcrumbs: false
            };
        }

    }
]);


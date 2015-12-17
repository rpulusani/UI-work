define(['angular', 'utility', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .controller('DevicePickerController', ['$scope', '$location', 'grid', 'Devices',
        'BlankCheck', 'FormatterService', '$rootScope', '$routeParams', 'PersonalizationServiceFactory', '$controller', 'imageService',
        'Contacts',
        function($scope, $location, Grid, Devices, BlankCheck, FormatterService, $rootScope, $routeParams, 
            Personalize, $controller, ImageService, Contacts) {
            $scope.selectedDevice = [];
            $rootScope.currentRowList = [];
            var personal = new Personalize($location.url(), $rootScope.idpUser.id);

            if($rootScope.selectedContact) {
                $rootScope.selectedContact = undefined;
            }

            if (!Devices.data.length) {
                $location.path(Devices.route + '/');
            }

            if($rootScope.selectedAddress) {
                $rootScope.selectedAddress = undefined;
            }

            configureTemplates();

            $scope.sourceController = function() {
                return $controller($routeParams.source + 'Controller', { $scope: $scope }).constructor;
            };

            $scope.isRowSelected = function(){
                if ($rootScope.currentRowList.length >= 1) {
                   $rootScope.selectedDevice = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
                   $scope.selectedDevice = $rootScope.selectedDevice;
                   return true;
                } else {
                   return false;
                }
            };

            $scope.$watch('selectedDevice', function() {
                if ($scope.selectedDevice.partNumber) {
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
                Devices.setItem($scope.selectedDevice);
                var options = {
                    params:{
                        embed:'contact'
                    }
                };
                Devices.item.get(options).then(function(){
                    $scope.selectedDevice.contact = Devices.item.contact.item;
                    $scope.formattedSelectedDeviceContact = FormatterService.formatContact($scope.selectedDevice.contact);
                });
            };

            $scope.goToCallingPage = function(){
                $location.path($rootScope.deviceReturnPath);
            };

            $scope.discardSelect = function(){
                $rootScope.selectedDevice = undefined;
                $rootScope.formattedDevice = undefined;
                $location.path($rootScope.deviceReturnPath);
            };

            $scope.gridOptions = {};
            $scope.gridOptions.multiSelect = false;
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Devices, personal);
            var options = {};
            if ($rootScope.returnPickerObjectDevice && $rootScope.returnPickerObjectDevice.selectedDevice) {
                $scope.prevDevice = $rootScope.returnPickerObjectDevice;
                if ($scope.prevDevice.selectedDevice.partNumber) {
                    ImageService.getPartMediumImageUrl($scope.prevDevice.selectedDevice.partNumber).then(function(url){
                        $scope.prevDevice.medImage = url;
                    }, function(reason){
                         NREUM.noticeError('Image url was not found reason: ' + reason);
                    });
                }
        
                if ($scope.prevDevice.selectedDevice.contact) {
                    Devices.setItem($scope.prevDevice.selectedDevice);
                    var options = {
                        params:{
                            embed:'contact'
                        }
                    };
                    Devices.item.links.self(options).then(function(){
                        $scope.prevDevice.selectedDevice.contact = Devices.item.self.item.contact.item;
                        $scope.formattedPrevDeviceContact = FormatterService.formatContact($scope.prevDevice.selectedDevice.contact);
                    });
                }

                if ($scope.prevDevice.address) {
                    $scope.formattedSingleLineAddress = FormatterService.formatAddressSingleLine($scope.prevDevice.address);
                    options = {
                        params: {
                            search: $scope.prevDevice.address.id,
                            searchOn: 'addressId',
                        }
                    };
                }
                
            }
            Devices.getPage(0, 20, options).then(function() {
                $scope.itemCount = Devices.data.length;
                console.log($scope.itemCount);
                Grid.display(Devices, $scope, personal);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + Devices.serviceName +  ' reason: ' + reason);
            });

            function configureTemplates() {
                $scope.configure = {
                    header: {
                        translate: {
                            h1: 'DEVICE_MGT.REMOVE_A_DEVICE',
                            body: 'MESSAGE.LIPSUM',
                            readMore: ''
                        },
                        readMoreUrl: ''
                    }
                }
            }

        }
    ]);
});

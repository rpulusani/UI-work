define(['angular', 'utility', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .controller('DevicePickerController', ['$scope', '$location', 'grid', 'Devices',
     'BlankCheck', 'FormatterService', '$rootScope', '$routeParams', 'PersonalizationServiceFactory', '$controller',
        function($scope, $location, Grid, Devices, BlankCheck, FormatterService, $rootScope, $routeParams, 
            Personalize, $controller) {
            $scope.selectedDevice = [];
            $rootScope.currentRowList = [];
            var personal = new Personalize($location.url(), $rootScope.idpUser.id);

            if($rootScope.selectedContact) {
                $rootScope.selectedContact = undefined;
            }

            if($rootScope.selectedAddress) {
                $rootScope.selectedAddress = undefined;
            }

            if (!BlankCheck.isNullOrWhiteSpace($scope.sourceDevice)) {
                $scope.formattedDevice = JSON.parse($scope.sourceDevice);
            }

            configureTemplates();

            $scope.sourceController = function() {
                console.log($scope);
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
            if ($rootScope.returnPickerObjectDevice && $rootScope.returnPickerObjectDevice.address) {
                $scope.formattedSingleLineAddress = FormatterService.formatAddressSingleLine($rootScope.returnPickerObjectDevice.address);
                options = {
                    params: {
                        search: $rootScope.returnPickerObjectDevice.address.id,
                        searchOn: 'addressId',
                    }
                };
            }
            Devices.getPage(0, 20, options).then(function() {
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

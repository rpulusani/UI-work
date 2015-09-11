define(['angular', 'deviceManagement'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceManagementController', ['$scope', '$location', '$routeParams', 'BlankCheck', 'Device',
        function($scope, $location, $routeParams, BlankCheck, Device) {
            var acct_id = 1;
            $scope.devices = Device.devices;
            $scope.device = Device.device;
            $scope.formattedAddress = '';
            $scope.formattedTitleAddress = '';
            $scope.file_list = ['.xls', '.xlsx', '.csv'].join(',');

            $scope.installAddress = {
                storeFrontName: 'Lexmark International Inc',
                addressLine1: '740 W. New Circle Rd.',
                addressLine2: '',
                country: 'United States',
                city: 'Lexington',
                state: 'KY',
                postalCode: '40511',
                building: 'Bldg1',
                floor: 'floor2',
                office: 'office3' 
            };

            $scope.primaryContact = {
                address: $scope.installAddress,
                name: 'John Public',
                phoneNumber: '9992882222',
                emailAddress: 'jpublic@lexmark.com'
            };

            $scope.formatAddress = function() {
                if(BlankCheck.checkNotNullOrUndefined($scope.installAddress)){
                    $scope.formattedAddress = $scope.installAddress.storeFrontName + '\n' + 
                                              $scope.installAddress.addressLine1 + ', ' +
                                              $scope.installAddress.city + ', ' + 
                                              $scope.installAddress.state + ' ' +
                                              $scope.installAddress.postalCode + '\n';
                    if(BlankCheck.checkNotBlank($scope.installAddress.building)){
                        $scope.formattedAddress = $scope.formattedAddress + $scope.installAddress.building + ', ';
                    }
                    if(BlankCheck.checkNotBlank($scope.installAddress.floor)){
                        $scope.formattedAddress = $scope.formattedAddress + $scope.installAddress.floor + ', ';
                    }
                    if(BlankCheck.checkNotBlank($scope.installAddress.office)){
                         $scope.formattedAddress = $scope.formattedAddress + $scope.installAddress.office + '\n';
                    }
                    $scope.formattedAddress = $scope.formattedAddress + $scope.installAddress.country;
                    $scope.formattedTitleAddress = $scope.installAddress.addressLine1 + ", " +
                                                    $scope.installAddress.city + ", " +
                                                    $scope.installAddress.state + " " +
                                                    $scope.installAddress.postalCode + ", " +
                                                    $scope.installAddress.country;
                }
            };
            
            if($routeParams.id) {
                $scope.device = Device.get({accountId: acct_id, id: $routeParams.id});
            }else {
                $scope.devices = Device.query({accountId: acct_id});
            }

            $scope.goToRead = function(id) {
                $scope.device = Device.get({accountId: acct_id, id: id});
                $location.path('/device_management/' + id + '/review');
            };

            $scope.formatAddress();
        }
    ]);
});

define(['angular', 'deviceManagement', 'utility.blankCheckUtility', 'deviceManagement.deviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceInformationController', ['$scope', '$location', '$routeParams', 'BlankCheck', 'Devices',
        function($scope, $location, $routeParams, BlankCheck, Device) {

             var redirect_to_list = function() {
               $location.path(Contacts.route + '/');
            };

             /* if ($routeParams.id) { //doing work on a current device
                var promise = Device.getSelfResource($routeParams.id);
                $q.when(promise,
                    function(item){
                        $scope.device = item;
                    }
                );
            } else { //doing work on a new address
                $scope.Devices = {accountId: $rootScope.currentUser.item.accounts[0].accountId, id:'new'};
            }*/

            if (Device.item === null) {
                redirect_to_list();
            } else {
                $scope.device = Device.item;
            }



            var acctId = 1;
            $scope.formattedAddress = '';

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
                name: 'Fake Data',
                phoneNumber: '(999)288-2222',
                emailAddress: 'jpublic@lexmark.com'
            };

            $scope.formatAddress = function() {
                if (BlankCheck.checkNotNullOrUndefined($scope.installAddress) ) {
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

            $scope.formatAddress();
        }
    ]);
});

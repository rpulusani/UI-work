define(['angular', 'deviceServiceRequest'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .controller('DeviceAddController', ['$scope', '$location', '$routeParams', '$rootScope',
        function($scope, $location, $routeParams, $rootScope) {
            // Remove this varibale after real call and getting the list of products
            // based on serial number
            $scope.productNumbers = [{id: 1, name: 'Product 1'}, {id: 2, name: 'Product 2'}, {id: 3, name: 'Product 3'}];
            $scope.goToBrowse = function() {
                $location.path('/device_management/pick_device');
            };



            $scope.continueForm = false;
            $scope.submitForm = false;
            $scope.attachmentIsShown = false;
            $rootScope.currentAccount = '1-74XV2R';

            if ($routeParams.id) { //doing work on a current address
              $scope.address = Addresses.get({id: $routeParams.id, accountId: $rootScope.currentAccount});
            } else { //doing work on a new address
                $scope.address = {accountId: $rootScope.currentAccount, id:'new'};
            }


            $scope.file_list = ['.csv', '.xls', '.xlsx', '.vsd', '.doc',
                                '.docx', '.ppt', '.pptx', '.pdf', '.zip'].join(',');

            $scope.contact = {};

            $scope.setStoreFrontName = function() {
                $scope.address.storeFrontName =  $scope.address.name;
            };

            $scope.save = function() {
                if ($scope.address.id) {
                    Addresses.update({
                        id: $scope.address.id,
                        accountId: $scope.address.accountId
                    }, $scope.address, $scope.goToViewAll);
                } else {
                    Addresses.save({
                        accountId: $scope.address.accountId
                    }, $scope.address, $scope.goToViewAll);
                }
            };

            $scope.cancel = function() {
                $location.path('/service_requests/addresses');
            };

            $scope['continue'] = function() {
                $scope.continueForm = true;
            };

            $scope.attachmentToggle = function() {
                $scope.attachmentIsShown = !$scope.attachmentIsShown;
            };


            $scope.goToReview = function(address) {
                $location.path('/service_requests/addresses/' + address.id + '/review');
            };

            $scope.goToViewAll = function(address) {
                $location.path('/service_requests/addresses');
            };

            $scope.goToUpdate = function(address) {
                $location.path('/service_requests/addresses/' + address.id + '/update');
            };

            $scope.goToVerify = function() {
               // Addresses.verify($scope.address, function(res) {
                  //  console.log(res);
                    Addresses.addresss = $scope.address;
                    $location.path('/service_requests/addresses/' + $scope.address.id + '/verify');
                //});
            };

            $scope.removeAddress = function(address) {
                Addresses.remove($scope.address, function() {
                    $scope.addresses.splice($scope.addresses.indexOf(address), 1);
                });
            };

    }]);
});

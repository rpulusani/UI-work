'use strict';
angular.module('mps.serviceRequestAddresses')
.controller('AddressesController', ['$scope', '$http', '$location', '$routeParams', 'History', 'Addresses',
    function($scope, $http, $location, $routeParams, History, Addresses) {
        $scope.continueForm = false;
        $scope.submitForm = false;
        $scope.attachmentIsShown = false;

        if ($routeParams.id) {
            $scope.address = Addresses.get({id: $routeParams.id, accountId: '1-74XV2R'});
        } else {
            $scope.address = {accountId: '1-74XV2R'};
        }
      
        $scope.addresses = Addresses.query({accountId: $scope.address.accountId}, function() {
            $scope.addresses = $scope.addresses.addresses;
        });
        
        $scope.file_list = ['.csv', '.xls', '.xlsx', '.vsd', '.doc',
                            '.docx', '.ppt', '.pptx', '.pdf', '.zip'].join(',');

        $scope.contact = {};

        $scope.serviceRequest = {
            customerReferenceId: '1-23654-AB',
            costCenter: '',
            addtnlDescription: '',
            requestedEffectiveDate: '',
            hours: 3
        };

        $scope.loadTestData = function() {
            $scope.contact.name = 'Vickers PetsAtHome';
            $scope.contact.phoneNumber = '9992882222';
            $scope.contact.emailAddress = 'vickerspets@test.com';
        };

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

        $scope.back = function() {
            if ($scope.continueForm) {
                $scope.continueForm = false;
            }

            History.back();
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

        $scope.goToCreate = function() {
            $location.path('/service_requests/addresses/new');
        };

        $scope.goToReview = function(id) {
            $location.path('/service_requests/addresses/' + id + '/review');
        };

        $scope.goToViewAll = function(id) {
            $location.path('/service_requests/addresses');
        };

        $scope.goToUpdate = function(id) {
            $location.path('/service_requests/addresses/' + id + '/update');
        };

        $scope.goToVerify = function(id) {
            $location.path('/service_requests/addresses/' + id + '/verify');
        }

        $scope.removeAddress = function(address) {
            Addresses.remove({id: address.id, accountId: '1-74XV2R'}, function() {
                $scope.addresses.splice($scope.addresses.indexOf(address), 1);
            });
        };

        $scope.loadTestData();
    }
]);

'use strict';
angular.module('mps.serviceRequestAddresses')
.controller('AddressesController', ['$scope', '$http', '$location', '$routeParams', 'History', 'Addresses',
    function($scope, $http, $location, $routeParams, History, Addresses) {
        $scope.continueForm = false;
        $scope.submitForm = false;
        $scope.attachmentIsShown = false;
        $scope.address = Addresses.address;
        $scope.addresses = Addresses.addresses;
        $scope.file_list = ['.csv', '.xls', '.xlsx', '.vsd', '.doc',
                        '.docx', '.ppt', '.pptx', '.pdf', '.zip'].join(',');
       
        $scope.contact = {
            name: '',
            phoneNumber: '',
            emailAddress: ''
        };

        $scope.serviceRequest = {
            customerReferenceId: '',
            costCenter: '',
            addtnlDescription: '',
            requestedEffectiveDate: ''
        };

        $scope.setStoreFrontName = function(){
            $scope.address.storeName =  $scope.address.addName;
        };

        $scope.loadTestData = function() {
            $scope.contact.name = 'Vickers PetsAtHome';
            $scope.contact.phoneNumber = '9992882222';
            $scope.contact.emailAddress = 'vickerspets@test.com';
        };

        $scope.save = function() {
            var newAddress = JSON.stringify($scope.address),
            fd;

            $scope.submitForm = false; // Request data from the server
        
            // 1 send to address creation
            $location.path('/service_requests/addresses/' + $scope.address.id + '/submitted');
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

        $scope.goToRead = function() {
            Addresses.getById($scope.address.id, function() {
                $scope.address = Addresses.address;
                $location.path('/service_requests/addresses/' + $scope.address.id + '/review');
            });
        };

        $scope.goToViewAll = function(id) {
            $location.path('/service_requests/addresses');
        };

        $scope.goToUpdate = function(id) {
            $location.path('/service_requests/addresses/' + id + '/update');
        };

        $scope.removeAddress = function(id) {
            Addresses.removeById(id, function() {
                if (Addresses.addresses.length === 0) {
                    $scope.addresses = [];
                }
            });
        };

        if (Addresses.addresses.length === 0) {
            Addresses.query(function() {
                $scope.addresses = Addresses.addresses;
            });
        }

        if ($routeParams.id) {
           Addresses.getById($routeParams.id, function() {
                $scope.address = Addresses.address;
            });
        }

        $scope.loadTestData();
    }
]);

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

        $scope.loadTestData = function() {
            $scope.contact.name = 'Vickers PetsAtHome';
            $scope.contact.phoneNumber = '9992882222';
            $scope.contact.emailAddress = 'vickerspets@test.com';
        };

        $scope.save = function(routeToTop) {
            var newAddress = JSON.stringify($scope.address),
            fd;

            $scope.submitForm = false; // Request data from the server

            if (!Addresses.address) {
                fd = new FormData(document.getElementsByName('newAddress')[0]);

                Addresses.save(fd, function(res) {
                    Addresses.addresses = [];

                    if (!routeToTop) {
                        $location.path('/service_requests/addresses/' + res.id).search('');
                    } else {
                        $location.path('/service_requests/addresses').search('');
                    }
                });
            } else {
                fd = new FormData(document.getElementsByName('editAddress')[0]);

                Addresses.update(fd, Addresses.address.id, function(res) {
                    Addresses.addresses = [];

                    if (!routeToTop) {
                        $location.path('/service_requests/addresses/' + res.id).search('');
                    } else {
                        $location.path('/service_requests/addresses').search('');
                    }
                });
            }
        };

        $scope.back = function() {
            if ($scope.continueForm) {
                $scope.continueForm = false;
            }

            History.back();
        };

        $scope.cancel = function() {
            $location.path('/');
        };

        $scope.continue = function() {
            $scope.continueForm = true;
        };

        $scope.attachmentToggle = function() {
            $scope.attachmentIsShown = !$scope.attachmentIsShown;
        };

        $scope.goToViewAll = function(id) {
            $location.path('/service_requests/addresses').search('');
        };

        $scope.updateAddress = function(id) {
            $location.path('/service_requests/addresses/' + id).search('view', 'update');
        };

        $scope.deleteAddress = function(id) {
            Addresses.deleteById(id, function() {
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
        } else {
            Addresses.address = null;
        }

        $scope.loadTestData();
    }
]);

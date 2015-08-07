'use strict';
angular.module('mps.serviceRequestAddresses')
.controller('AddressesController', ['$scope', '$http', '$location', '$routeParams', 'Addresses',
function($scope, $http, $location, $routeParams, Addresses) {
    $scope.continueForm = false;
    $scope.submitForm = false;
    $scope.attachmentIsShown = false;
    $scope.currentAddressId = Addresses.currentAddress.id;
    $scope.address = Addresses.currentAddress; // Current/Last opened address id
    $scope.addresses = Addresses.addresses;

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
        fd = new FormData(document.getElementsByName('newAddress')[0]);

        fd.append('file', $scope.addyFile);

        $scope.submitForm = false; // Request data from the server

        Addresses.save(fd, function(res) {
            Addresses.hasData = false;

            if (!routeToTop) {
                $location.path('/service_requests/addresses/' + res.id).search('');
            } else {
                $location.path('/service_requests/addresses').search('');
            }
        });
    };

    $scope.back = function() {
        if ($scope.continueForm) {
            $scope.continueForm = false;
        }
                
        window.history.back();
    };

    $scope.cancel = function(){
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
        Addresses.deleteById(id, function(res) {
            var i = 0,
            addressCnt = Addresses.addresses.length;

            for (i; i < addressCnt; i += 1) {
                if (Addresses.addresses[i].id === id) {
                    Addresses.addresses.splice(i, 1);
                }
            }
        });
    };

    if (Addresses.hasData === false) {
        Addresses.query(function() {
            $scope.addresses = Addresses.addresses;
        });
    }

    if ($routeParams.id && $routeParams.id !== '') {
        $scope.currentAddressId = $routeParams.id;
    } else if ($routeParams.addressid && $routeParams.addressid !== '') {
        $scope.currentAddressId = $routeParams.addressid;
    } else {
        $scope.currentAddressId = null;
    }

    if ($scope.currentAddressId) {
        Addresses.getById($scope.currentAddressId, function(newAddress) {
            $scope.address = newAddress;
        });
    }

    $scope.loadTestData();
}]);

'use strict';
angular.module('mps.serviceRequestAddresses')
.controller('AddressesController', ['$scope', '$http', '$location', '$routeParams', 'Addresses',
function($scope, $http, $location, $routeParams, Addresses) {
    $scope.continueForm = false;
    $scope.submitForm = false;
    $scope.attachmentIsShown = false;
    $scope.currentAddressId = ''; // Current/Last opened address id
    $scope.alertMsg = ''; // On-page alert message
    $scope.addresses = Addresses.addresses;
  
    $scope.contact = {
        name: '',
        phoneNumber: '',
        emailAddress: ''
    };

    $scope.address = {
        addName: '',
        storeName: '',
        addrLine1: '',
        addrLine2: '',
        city: '',
        country: '',
        state: '',
        zipCode: '',
        county: '',
        district:''
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
            Addresses.hasData = true;

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
        $location.path('/service_requests/addresses');
    };

    $scope.updateAddress = function(id) {
        $location.path('/service_requests/addresses/update').search('addressid', id);
    };

    $scope.deleteAddress = function(id) {
        Addresses.deleteById(id, function(res) {
            var i = 0,
            addressCnt = Addresses.length;

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

    if ($location.search().addressid) {
        $scope.currentAddressId = $location.search().addressid;
    } else if ($routeParams.id && $routeParams.id.indexOf('addy-') !== -1 ) {
        $scope.currentAddressId = $routeParams.id;
    }

    if ($scope.currentAddressId !== '') {
        $http.get(window.location.href).success(function(res) {
            $scope.address = res;
        }).error(function() {
            // address id wasn't in the store
            $location.path('/service_requests/addresses/new');
        });
    }

    $scope.loadTestData();
}]);

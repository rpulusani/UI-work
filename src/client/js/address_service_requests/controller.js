'use strict';
angular.module('mps.serviceRequestAddresses')
.controller('AddressesController', ['$scope', '$http', '$location', '$routeParams', 'Addresses', 'Contacts',
function($scope, $http, $location, $routeParams, Addresses) {
    $scope.continueForm = false;
    $scope.submitForm = false;
    $scope.attachmentIsShown = false;

    $scope.address = Addresses.currentAddress;
    $scope.addresses = Addresses.addresses;
    /*
    $scope.contact = Contacts.currentContact;
    $scope.contacts = Contacts.contacts;
    */
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

    // Contacts.loadTestData()
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
        Addresses.deleteById(id, function() {
            if (Addresses.addresses.length === 0) {
                $scope.addresses = false; // for use with ng-bind, hides table completely
            }
        });
    };

    if (Addresses.hasData === false) {
        Addresses.query(function() {
            $scope.addresses = Addresses.addresses;
            
            if (Addresses.addresses.length === 0) {
                $scope.addresses = false; // for use with ng-bind, hides table completely
            }
        });
    }

    if ($routeParams.id && $routeParams.id !== '') {
        Addresses.currentAddress.id = $routeParams.id;
    } else {
        Addresses.currentAddress.id = null;
    }

    if (Addresses.currentAddress.id) {
        Addresses.getById(Addresses.currentAddress.id, function() {
            $scope.address = Addresses.currentAddress;
        });
    }

    $scope.loadTestData();
}]);

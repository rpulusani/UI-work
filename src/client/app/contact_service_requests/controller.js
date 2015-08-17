'use strict';
angular.module('mps.serviceRequestContacts')
.controller('ContactsController', ['$scope', '$http', '$location', '$routeParams', 'Contacts',
function($scope, $http, $location, $routeParams, Contacts) {
    $scope.continueForm = false;
    $scope.submitForm = false;
    $scope.attachmentIsShown = false;
    $scope.currentContactId = ''; // Current/Last opened address id
    $scope.alertMsg = ''; // On-page alert message
    $scope.contacts = Contacts.contacts;

    $scope.file_list = ['.csv', '.xls', '.xlsx', '.vsd', '.doc',
                        '.docx', '.ppt', '.pptx', '.pdf', '.zip'].join(',');

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

        fd.append('file', $scope.contactFile);

        $scope.submitForm = false; // Request data from the server

        Contacts.save(fd, function(res) {
            Contacts.hasData = true;

            if (!routeToTop) {
                $location.path('/service_requests/contacts/' + res.id).search('');
            } else {
                $location.path('/service_requests/contacts').search('');
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
        $location.path('/service_requests/contacts');
    };

    $scope.updateAddress = function(id) {
        $location.path('/service_requests/contacts/update').search('addressid', id);
    };

    $scope.deleteContact = function(id) {
        Contacts.deleteById(id, function(res) {
            var i = 0,
            addressCnt = Contacts.length;

            for (i; i < addressCnt; i += 1) {
                if (Contacts.contacts[i].id === id) {
                    Contacts.contacts.splice(i, 1);
                }
            }
        });
    };

    if (Contacts.hasData === false) {
        Contacts.query(function() {
            $scope.contacts = Contacts.contacts;
        });
    }

    $scope.loadTestData();
}]);

'use strict';
angular.module('mps.serviceRequestAddresses')
.controller('AddressesController', ['$scope', '$http', '$location', '$routeParams', 'History', 'Addresses',
    function($scope, $http, $location, $routeParams, History, Addresses) {
        $scope.accountId = 1; // TODO: CHANGE to read user obj/$routeParams
        $scope.continueForm = false;
        $scope.submitForm = false;
        $scope.attachmentIsShown = false;
        $scope.address = null;
        $scope.addresses = [];
        $scope.file_list = ['.csv', '.xls', '.xlsx', '.vsd', '.doc',
                        '.docx', '.ppt', '.pptx', '.pdf', '.zip'].join(',');

        $scope.contact = {
            name: '',
            phoneNumber: '',
            emailAddress: ''
        };

        $scope.serviceRequest = {
            customerReferenceId: '1-23654-AB',
            costCenter: '',
            addtnlDescription: '',
            requestedEffectiveDate: '',
            hours: 3
        };

        $scope.setStoreFrontName = function(){
            $scope.address.storeName =  $scope.address.addName;
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
            if ($scope.address.id) {
                Addresses.update({id: $scope.address.id, accountId: $scope.accountId}, $scope.address, $scope.goToViewAll);
            } else {
                Addresses.save({accountId: $scope.accountId}, $scope.address, $scope.goToViewAll);
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

        $scope.goToRead = function(form) {
            if(form.$valid){
                Addresses.getById($scope.address.id, function() {
                    $scope.address = Addresses.address;
                    $location.path('/service_requests/addresses/' + $scope.address.id + '/review');
                });
            }
        };

        $scope.goToViewAll = function(id) {
            $location.path('/service_requests/addresses');
        };

        $scope.goToUpdate = function(id) {
            $location.path('/service_requests/addresses/' + id + '/update');
        };

        $scope.removeAddress = function(id) {
            Addresses.remove({id: id});
        };

        if ($scope.addresses.length === 0) {
            Addresses.query({accountId: $scope.accountId}, function(res) {
                $scope.addresses = res.resource.addresses;
            });
        }

        if ($routeParams.id) {
            Addresses.get({id: $routeParams.id, accountId: $scope.accountId}, function(res) {
                $scope.address = res;
            });
        }

        $scope.loadTestData();
    }
]);

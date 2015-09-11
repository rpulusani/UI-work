define(['angular', 'address'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
.controller('AddressesController', ['$scope', '$http', '$location', '$routeParams', 'Addresses',
    function($scope, $http, $location, $routeParams, Addresses, CountryService) {
            $scope.continueForm = false;
            $scope.submitForm = false;
            $scope.attachmentIsShown = false;
            $scope.address = Addresses.address;
            $scope.addresses = Addresses.addresses;
        //$scope.countryHAL = CountryService.getHAL();
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

        $scope.setStoreFrontName = function(){
            $scope.address.storeName =  $scope.address.addName;
            };

            $scope.save = function() {
                var newAddress = JSON.stringify($scope.address),
                fd;

                $scope.submitForm = false; // Request data from the server
                Addresses.address  = $scope.address;
                $location.path('/service_requests/addresses/' + $scope.address.id + '/submitted');
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
                Addresses.removeById(id, function() {
                    if (Addresses.addresses.length === 0) {
                        $scope.addresses = [];
                    }
                });
            };

        function setSelectedCountry(){
            $scope.countryHAL.$promise.then(function(countries) {
               $scope.countryList =  $scope.countryHAL.countries;
               for(var i = 0; i < $scope.countryList.length; i++){
                    if($scope.address.country === $scope.countryList[i].code){
                        $scope.address.selectedCountry = $scope.countryList[i];
                        for(var j = 0; j < $scope.countryList[i].provinces.length; j++){
                            if($scope.address.state === $scope.countryList[i].provinces[j].code){
                                $scope.address.selectedState = $scope.countryList[i].provinces[j];
                            }
                        }
                    }
                }
            });
        }

        $scope.getAddress = function(){
            if ($routeParams['id']) {
                Addresses.getById($routeParams['id'], function() {
                    $scope.address = Addresses.address;
                });
            }else if($location.path() === '/service_requests/addresses/new'){
                Addresses.new();
                 $scope.address = Addresses.address;
            }
            setSelectedCountry();
        };

        $scope.getAddressList = function(){
            if (Addresses.addresses.length === 0) {
                Addresses.query(function() {
                    $scope.addresses = Addresses.addresses;
                    $scope.getAddress();
                });
            }else{
                $scope.getAddress();
            }
        };

        $scope.getAddressList();
        }
    ]);
});

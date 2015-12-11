define(['angular', 'deviceServiceRequest', 'deviceManagement.deviceFactory'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .controller('DeviceAddController', ['$scope', '$location', '$filter', '$routeParams', '$rootScope', 'FormatterService', 'Devices',
        function($scope, $location, $filter, $routeParams, $rootScope, FormatterService, Devices) {

            $scope.device = {};
            $scope.device.selectedDevice = {};
            $scope.device.selectedContact = {};
            $scope.device.lexmarkDeviceQuestion = 'true';
            $scope.isSubmitted = false;
            $scope.isReview = false;
            $scope.isPrimarySelected = false;
            $scope.isSecondarySelected = false;
            $scope.currentDate = $filter('date')(new Date(), "MM/dd/yyyy");

            /* Remove this varibale after real call and getting the list of products
               based on serial number */
            $scope.productNumbers = [{id: 1, name: 'Product 1'}, {id: 2, name: 'Product 2'}, {id: 3, name: 'Product 3'}];

            if ($rootScope.newDevice !== undefined && $routeParams.return) {
                $scope.device = $rootScope.newDevice;
            }


            if ($rootScope.currentRowList !== undefined && $rootScope.currentRowList.length >= 1 &&
                 $routeParams.return && $routeParams.return !== 'discard') {
                if ($rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity.serialNumber !== undefined) {
                    $scope.device.selectedDevice = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
                } else {
                    if ($rootScope.currentSelected) {
                        switch($rootScope.currentSelected){
                            case 'deviceContact':
                                $scope.device.selectedContact = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
                            break;
                            case 'requestPrimaryContact':
                                $scope.device.requestPrimaryContact = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
                            break;
                            case 'requestSecondaryContact':
                                $scope.device.requestSecondaryContact = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
                            break;
                        }
                    }

                }
            }

            $scope.goToBrowse = function(device) {
                $rootScope.newDevice = device;
                $location.path('/device_management/pick_device');
            };

            $scope.goToReview = function() {
                $scope.isReview = true;
            };

            $scope.goToAdd = function() {
                $scope.isReview = false;
            };

            $scope.goToSubmit = function() {
                $scope.isSubmitted = true;
            };

            $scope.goToCreate = function() {
                $location.path('/service_requests/devices/new');
            };

            $scope.goToContactPicker = function(device,currentSelected) {
                $rootScope.currentSelected = currentSelected;
                $rootScope.newDevice = device;
                $location.path('/service_requests/devices/pick_contact');
            };

            $scope.isDeviceSelected = function(){
                if ($rootScope.currentRowList !== undefined && $rootScope.currentRowList.length >= 1
                    && $routeParams.return && $routeParams.return !== 'discard') {
                    return true;
                } else {
                    return false;
                }
            };

            if ($scope.device.address) {
                $scope.installAddress = FormatterService.formatAddress($scope.device.address);
            }

            if ($scope.device.selectedContact) {
                $scope.devicePrimaryContact = FormatterService.formatContact($scope.device.selectedContact);
                $scope.isReview = false;
            }

            if ($scope.device.requestPrimaryContact) {
                $scope.requestPrimaryContact = FormatterService.formatContact($scope.device.requestPrimaryContact);
                $scope.isPrimarySelected = true;
                $scope.isReview = true;
            }

            if ($scope.device.requestSecondaryContact) {
                $scope.requestSecondaryContact = FormatterService.formatContact($scope.device.requestSecondaryContact);
                $scope.isSecondarySelected = true;
                $scope.isReview = true;
            }

            configureTemplates();

            function configureTemplates() {
                $scope.configure = {
                    header: {
                        translate: {
                            h1: 'DEVICE_SERVICE_REQUEST.ADD',
                            body: 'MESSAGE.LIPSUM',
                            readMore: 'Learn more about requests'
                        },
                        readMoreUrl: '#'
                    },
                    actions: {
                        translate: {
                            abandonRequest:'DEVICE_SERVICE_REQUEST.ABANDON',
                            submit: 'LABEL.REVIEW_SUBMIT'
                        },
                        submit: function() {
                            if($scope.isReview){
                                $scope.goToSubmit();
                            }else{
                                $scope.goToReview();
                            }
                        }
                    },
                    modal: {
                        translate: {
                            abandonTitle: 'SERVICE_REQUEST.TITLE_ABANDON_MODAL',
                            abandonBody: 'SERVICE_REQUEST.BODY_ABANDON_MODAL',
                            abandonCancel:'SERVICE_REQUEST.ABANDON_MODAL_CANCEL',
                            abandonConfirm: 'SERVICE_REQUEST.ABANDON_MODAL_CONFIRM'
                        },
                        returnPath: Devices.route + '/'
                    }
                };
            }
        }
    ]);
});

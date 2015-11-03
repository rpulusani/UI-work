define(['angular', 'deviceServiceRequest', 'deviceManagement.deviceFactory','utility.formatters'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestDevices')
    .controller('DeviceUpdateController', ['$scope', '$location', '$filter', '$routeParams', '$rootScope', 'FormatterService',
        'BlankCheck','DeviceServiceRequest', 'Devices',
        function($scope, $location, $filter, $routeParams, $rootScope, Format, BlankCheck, DeviceServiceRequest, Devices) {
            
            var redirectToList = function() {
                $location.path(Devices.route + '/');
            };

            if (Devices.item === null) {
                redirectToList();
            } else {
                $scope.device = Devices.item;
                $scope.currentInstallAddress = Devices.item._embeddedItems['address'];
                $scope.updatedInstallAddress = Devices.item._embeddedItems['address'];
                $scope.primaryContact = Devices.item._embeddedItems['primaryContact'];
                
                configureTemplates();
            }

            function configureTemplates(){
                $scope.configure = {
                    header: {
                        translate:{
                            h1: 'DEVICE_SERVICE_REQUEST.UPDATE_DEVICE',
                            body: 'MESSAGE.LIPSUM',
                            readMore: ''
                        },
                        readMoreUrl: ''
                    },
                    device: {
                        update:{
                            translate: {
                                title: 'DEVICE_SERVICE_REQUEST.REQUESTED_UPDATE_TO_DEVICE',
                                installAddress: 'DEVICE_MGT.INSTALL_ADDRESS',
                                move: 'DEVICE_SERVICE_REQUEST.LEXMARK_MOVE_DEVICE'
                            }
                        }
                    },
                    contact:{
                        translate: {
                            title: 'SERVICE_REQUEST.CONTACT_INFORMATION',
                            requestedByTitle: 'SERVICE_REQUEST.REQUEST_CREATED_BY',
                            primaryTitle: 'SERVICE_REQUEST.PRIMARY_CONTACT',
                            changePrimary: 'SERVICE_REQUEST.CHANGE_PRIMARY_CONTACT'
                        }
                    },
                    detail:{
                        translate:{
                            title: 'DEVICE_SERVICE_REQUEST.ADDITIONAL_REQUEST_DETAILS',
                            referenceId: 'SERVICE_REQUEST.INTERNAL_REFERENCE_ID',
                            costCenter: 'SERVICE_REQUEST.REQUEST_COST_CENTER',
                            comments: 'LABEL.COMMENTS',
                            attachments: 'LABEL.ATTACHMENTS',
                            attachmentMessage: 'MESSAGE.ATTACHMENT',
                            fileList: ['.csv', '.xls', '.xlsx', '.vsd', '.doc', '.docx', '.ppt', '.pptx', '.pdf', '.zip'].join(', ')
                        },
                        show:{
                            referenceId: true,
                            costCenter: true,
                            comments: true,
                            attachements: true
                        }
                    },
                    actions:{
                        translate: {
                            abandonRequest:'DEVICE_SERVICE_REQUEST.DISCARD_DEVICE_CHANGES',
                            submit: 'DEVICE_SERVICE_REQUEST.SUBMIT_DEVICE_REQUEST'
                        }
                    },
                    modal:{
                        translate:{
                            abandonTitle: 'SERVICE_REQUEST.TITLE_ABANDON_MODAL',
                            abandondBody: 'SERVICE_REQUEST.BODY_ABANDON_MODAL',
                            abandonCancel:'SERVICE_REQUEST.ABANDON_MODAL_CANCEL',
                            abandonConfirm: 'SERVICE_REQUEST.ABANDON_MODAL_CONFIRM',
                        },
                        returnPath: Devices.route + '/'
                    }
                };
            }

            $scope.goToReview = function() {
                console.log($scope.lexmarkMoveDevice);
                $location.path(DeviceServiceRequest.route + '/update/' + $scope.device.id + '/review');
            };
            console.log($routeParams);
            if ($routeParams.updateid) {
                console.log($scope.lexmarkMoveDevice);
                if (!BlankCheck.isNullOrWhiteSpace($scope.lexmarkMoveDevice)) {
                    $scope.formattedMoveDevice = Format.formatYesNo($scope.lexmarkMoveDevice);
                    console.log('inside condition');
                    console.log($scope.formattedMoveDevice);
                }
            }
            
            
            // if ($rootScope.newDevice !== undefined && $routeParams.return) {
            //     $scope.device = $rootScope.newDevice;
            // } 
            

            // if ($rootScope.currentRowList !== undefined && $rootScope.currentRowList.length >= 1 
            //     && $routeParams.return && $routeParams.return !== 'discard') {
            //     if ($rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity.serialNumber !== undefined) {
            //         console.log("inside device condition");
            //         $scope.device.selectedDevice = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
            //     } else {
            //         if ($rootScope.currentSelected) {
            //             switch($rootScope.currentSelected){
            //                 case 'deviceContact':
            //                     $scope.device.selectedContact = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
            //                 break;
            //                 case 'requestPrimaryContact':
            //                     $scope.device.requestPrimaryContact = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
            //                 break;
            //                 case 'requestSecondaryContact':
            //                     $scope.device.requestSecondaryContact = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
            //                 break;
            //             }
            //         }
                    
            //     }
            // }

            // $scope.goToBrowse = function(device) {
            //     $rootScope.newDevice = device;
            //     $location.path('/device_management/pick_device');
            // };

            // $scope.goToReview = function() {
            //     $scope.isReview = true;
            // };

            // $scope.goToAdd = function() {
            //     $scope.isReview = false;
            // };

            // $scope.goToSubmit = function() {
            //     $scope.isSubmitted = true;
            // };

            // $scope.goToCreate = function() {
            //     $location.path('/service_requests/devices/new');
            // };

            $scope.goToContactPicker = function(device,currentSelected) {
                $rootScope.currentSelected = currentSelected;
                $rootScope.newDevice = device;
                $location.path('/service_requests/devices/pick_contact');
            };

            // $scope.isDeviceSelected = function(){
            //     if ($rootScope.currentRowList !== undefined && $rootScope.currentRowList.length >= 1 
            //         && $routeParams.return && $routeParams.return !== 'discard') {
            //         return true;
            //     } else {
            //         return false;
            //     }
            // };

            // if ($scope.device.address) {
            //     $scope.installAddress = Format.formatAddress($scope.device.address);
            // }

            if ($scope.updatedInstallAddress) {
                $scope.formattedDeviceAddress = Format.formatAddress($scope.updatedInstallAddress);
            }

            if ($scope.primaryContact) {
                $scope.formattedPrimaryContact = Format.formatPrimaryContact($scope.primaryContact);
            }

            
        }
    ]);
});

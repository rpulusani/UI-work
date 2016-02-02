define(['angular', 'address'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('AddressDeleteController', [
        '$scope',
        '$rootScope',
        '$routeParams',
        '$location',
        '$translate',
        'Addresses',
        'ServiceRequestService',
        'FormatterService',
        'BlankCheck',
        'Contacts',
        'SRControllerHelperService',
        'UserService',
        function($scope,
            $rootScope,
            $routeParams,
            $location,
            $translate,
            Addresses,
            ServiceRequest,
            FormatterService,
            BlankCheck,
            Contacts,
            SRHelper,
            Users) {

            SRHelper.addMethods(Addresses, $scope, $rootScope);

            var configureSR = function(ServiceRequest){
                    ServiceRequest.addRelationship('account', $scope.address);
                    ServiceRequest.addRelationship('sourceAddress', $scope.address, 'self');
                    ServiceRequest.addRelationship('primaryContact', $scope.address, 'requestor');
                    ServiceRequest.addField('type', 'DATA_ADDRESS_REMOVE');

            };

            $scope.getRequestor = function(ServiceRequest, Contacts) {
                Users.getLoggedInUserInfo().then(function() {
                    Users.item.links.contact().then(function() {
                        $scope.address.requestedByContact = Users.item.contact.item;
                        ServiceRequest.addRelationship('requester', $scope.address.requestedByContact, 'self');
                        if(!$scope.address.primaryContact){
                            $scope.address.primaryContact = $scope.address.requestedByContact;

                            ServiceRequest.addRelationship('primaryContact', $scope.address.requestedByContact, 'self');
                        }
                        $scope.formatAdditionalData();
                    });
                });
            };

            $scope.formatAdditionalData = function() {
                if (!BlankCheck.isNull($scope.address)) {
                    $scope.formattedAddress = FormatterService.formatAddress($scope.address);
                }

                if (!BlankCheck.isNull($scope.address.primaryContact)) {
                    $scope.formattedPrimaryContact = FormatterService.formatContact($scope.address.primaryContact);
                }

                if (!BlankCheck.isNull($scope.address.requestedByContact)) {
                    $scope.requestedByContactFormatted = FormatterService.formatContact($scope.address.requestedByContact);
                }
                if (!BlankCheck.isNull($scope.sr.customerReferenceId)) {
                    $scope.formattedReferenceId = FormatterService.formatNoneIfEmpty($scope.sr.customerReferenceId);
                }

                if (!BlankCheck.isNull($scope.sr.costCenter)) {
                    $scope.formattedCostCenter = FormatterService.formatNoneIfEmpty($scope.sr.costCenter);
                }

            };

            if (Addresses.item === null) {
                $scope.redirectToList();
            } else if($rootScope.selectedContact && $rootScope.returnPickerObject && $rootScope.selectionId === Addresses.item.id){
                $scope.address = $rootScope.returnPickerObject;
                $scope.sr = $rootScope.returnPickerSRObject;
                ServiceRequest.addRelationship('primaryContact', $rootScope.selectedContact, 'self');
                $scope.address.primaryContact = angular.copy($rootScope.selectedContact);
                $scope.formatAdditionalData();
                $scope.resetContactPicker();
            }else if($rootScope.contactPickerReset){
                $rootScope.address = Addresses.item;
                $rootScope.contactPickerReset = false;
            }else {

                $scope.address = Addresses.item;
                if (Addresses.item && !BlankCheck.isNull(Addresses.item['contact']) && Addresses.item['contact']['item']) {
                    $scope.Addresses.primaryContact = Addresses.item['contact']['item'];
                }else if(Addresses.item && !BlankCheck.isNull(Addresses.item['contact'])){
                    $scope.Addresses.primaryContact = Addresses.item['contact'];
                }

                if ($rootScope.returnPickerObject && $rootScope.selectionId !== Addresses.item.id) {
                    $scope.resetContactPicker();
                }
            }

            $scope.setupSR(ServiceRequest, configureSR);
            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate );
            $scope.getRequestor(ServiceRequest, Contacts);

            function configureReviewTemplate(){
                $scope.configure.actions.translate.submit = 'ADDRESS_SERVICE_REQUEST.DELETE_SUBMIT';
                $scope.configure.actions.submit = function(){
                    var deferred = ServiceRequest.post({
                         item:  $scope.sr
                    });
                    deferred.then(function(result){
                        $rootScope.newAddress = $scope.address;
                        $rootScope.newSr = $scope.sr;
                       $location.path(Addresses.route + '/delete/' + $scope.address.id + '/receipt');
                    }, function(reason){
                        NREUM.noticeError('Failed to create SR because: ' + reason);
                    });
                };
            }
            function configureReceiptTemplate(){
                $scope.configure.header.translate.h1 = "ADDRESS_SERVICE_REQUEST.SR_DELETE_SUBMITTED";
                $scope.configure.header.translate.body = "ADDRESS_SERVICE_REQUEST.DELETE_ADDRESS_SUBMIT_HEADER_BODY";
                $scope.configure.header.translate.bodyValues= {
                    'srNumber': FormatterService.getFormattedSRNumber($scope.sr),
                    'srHours': 24,
                    'deviceManagementUrl': 'device_management/',
                };
                $scope.configure.receipt = {
                    translate:{
                        title:"ADDRESS_SERVICE_REQUEST.DELETE_ADDRESS_DETAIL",
                        titleValues: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) }
                    }
                };
                $scope.configure.contact.show.primaryAction = false;
            }
            function configureTemplates(){
                $scope.configure = {
                    header: {
                        translate:{
                            h1: 'ADDRESS_SERVICE_REQUEST.DELETE',
                            body: 'MESSAGE.LIPSUM',
                            bodyValues: '',
                            readMore: ''
                        },
                        readMoreUrl: '',
                        showCancelBtn: false
                    },
                    address: {
                        information:{
                            translate: {
                                title: 'ADDRESS.INFO',
                                contact: 'ADDRESS_SERVICE_REQUEST.ADDRESS_CONTACT'
                            }
                        }
                    },
                    contact:{
                        translate: {
                            title: 'SERVICE_REQUEST.CONTACT_INFORMATION',
                            requestedByTitle: 'SERVICE_REQUEST.REQUEST_CREATED_BY',
                            primaryTitle: 'SERVICE_REQUEST.PRIMARY_CONTACT',
                            changePrimary: 'SERVICE_REQUEST.CHANGE_PRIMARY_CONTACT'
                        },
                        show:{
                            primaryAction : true
                        },
                        pickerObject: $scope.address,
                        source: 'AddressDelete'
                    },
                    detail:{
                        translate:{
                            title: 'ADDRESS_SERVICE_REQUEST.ADDITIONAL_REQUEST_DETAILS',
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
                            abandonRequest:'ADDRESS_SERVICE_REQUEST.ABANDON_DELETE',
                            submit: 'LABEL.REVIEW_SUBMIT'
                        },
                        submit: function(){
                            $location.path(Addresses.route + '/delete/' + $scope.address.id + '/review');
                        }
                    },
                    modal:{
                        translate:{
                            abandonTitle: 'SERVICE_REQUEST.TITLE_ABANDON_MODAL',
                            abandondBody: 'SERVICE_REQUEST.BODY_ABANDON_MODAL',
                            abandonCancel:'SERVICE_REQUEST.ABANDON_MODAL_CANCEL',
                            abandonConfirm: 'SERVICE_REQUEST.ABANDON_MODAL_CONFIRM',
                        },
                        returnPath: '/service_requests/addresses'
                    },
                    contactPicker:{
                        translate:{
                            title: 'CONTACT.SELECT_CONTACT',
                            contactSelectText: 'CONTACT.SELECTED_CONTACT_IS',
                        },
                        returnPath: Addresses.route + '/delete/' + $scope.address.id + '/review'
                    },
                    statusList:[
                  {
                    'label':'Submitted',
                    'date': '1/29/2016',
                    'current': true
                  },
                  {
                    'label':'In progress',
                    'date': '',
                    'current': false
                  },
                  {
                    'label':'Completed',
                    'date': '',
                    'current': false
                  }
                ]
                };
            }

            $scope.formatReceiptData($scope.formatAdditionalData);
        }
    ]);
});


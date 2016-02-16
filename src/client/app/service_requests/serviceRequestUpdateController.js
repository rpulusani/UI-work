define(['angular', 'serviceRequest'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequests')
    .controller('ServiceRequestUpdateController', [
        '$scope',
        '$location',
        '$routeParams',
        '$rootScope',
        'ServiceRequestService',
        'SRControllerHelperService',
        'FormatterService',
        'BlankCheck',
        'Contacts',
        'UserService',
        '$translate',
        'HATEAOSConfig',
        function(
            $scope,
            $location,
            $routeParams,
            $rootScope,
            ServiceRequest,
            SRHelper,
            FormatterService,
            BlankCheck,
            Contacts,
            Users,
            $translate,
            HATEAOSConfig) {

            SRHelper.addMethods(ServiceRequest, $scope, $rootScope);

            $scope.goToReview = function() {
                $location.path('/service_requests/' + $scope.sr.id +'/update/' + $routeParams.type + '/review');
            };

            $scope.updateSRObjectForSubmit = function() {
                ServiceRequest.newMessage();
                $scope.srToSubmit = ServiceRequest.item;
                if($location.path().indexOf('UPDATE_INSTALL') > -1) {
                    ServiceRequest.addField('type', 'UPDATE_INSTALL');
                } else if ($location.path().indexOf('UPDATE_DECOMMISSION') > -1) {
                    ServiceRequest.addField('type', 'UPDATE_DECOMMISSION');
                } else if ($location.path().indexOf('UPDATE_MOVE') > -1) {
                    ServiceRequest.addField('type', 'UPDATE_MOVE');
                } else if ($location.path().indexOf('UPDATE_CONSUMABLES') > -1) {
                    ServiceRequest.addField('type', 'UPDATE_CONSUMABLES');
                } else if ($location.path().indexOf('UPDATE_HARDWARE_SERVICE') > -1) {
                    ServiceRequest.addField('type', 'UPDATE_HARDWARE_SERVICE');
                } else if ($location.path().indexOf('UPDATE_HARDWARE_REQUEST') > -1) {
                    ServiceRequest.addField('type', 'UPDATE_HARDWARE_REQUEST');
                } else if ($location.path().indexOf('UPDATE_HARDWARE_INSTALL') > -1) {
                    ServiceRequest.addField('type', 'UPDATE_HARDWARE_INSTALL');
                } else {
                    ServiceRequest.addField('type', 'UPDATE_ALL');
                }
                ServiceRequest.addField('description', $scope.sr.updateDescription);
                ServiceRequest.addField('notes', $scope.sr.notes);
                ServiceRequest.addField('customerReferenceId', $scope.sr.customerReferenceId);
                ServiceRequest.addRelationship('primaryContact', $scope.sr.primaryContact, 'self');
                ServiceRequest.addRelationship('requester', $scope.sr.requestedByContact, 'self');
                ServiceRequest.addRelationship('account', $scope.sr.requestedByContact, 'account');
                ServiceRequest.addRelationship('relatedRequest', $scope.sr, 'self');
            };

            $scope.goToSubmit = function(){
                $scope.updateSRObjectForSubmit();
                if (!BlankCheck.checkNotBlank(ServiceRequest.item.postURL)) {
                    HATEAOSConfig.getApi(ServiceRequest.serviceName).then(function(api) {
                        ServiceRequest.item.postURL = api.url;
                    });
                }
                var deferred = ServiceRequest.post({
                    item:  $scope.srToSubmit
                });

                deferred.then(function(result){
                    ServiceRequest.item = ServiceRequest.item;
                    $rootScope.newSr = $scope.sr;
                    $location.path('/service_requests/' + $scope.sr.id +'/update/' + $routeParams.type + '/receipt');
                }, function(reason){
                    NREUM.noticeError('Failed to create SR because: ' + reason);
                });

            };

             var configureSR = function(ServiceRequest){
                ServiceRequest.addRelationship('account', $scope.sr);
                ServiceRequest.addRelationship('primaryContact', $scope.sr, 'contact');
                ServiceRequest.addRelationship('relatedRequest', $scope.sr, 'self');
                ServiceRequest.addField('type', $routeParams.type);
            };

            $scope.getRequestor = function(ServiceRequest, Contacts) {
                Users.getLoggedInUserInfo().then(function() {
                    Users.item.links.contact().then(function() {
                        $scope.sr.requestedByContact = Users.item.contact.item;
                        ServiceRequest.addRelationship('requester', $scope.sr.requestedByContact, 'self');
                        $scope.sr.primaryContact = $scope.sr.requestedByContact;
                        ServiceRequest.addRelationship('primaryContact', $scope.sr.primaryContact, 'self');
                        $scope.requestedByContactFormatted =
                        FormatterService.formatContact($scope.sr.requestedByContact);
                        if(!$scope.formattedPrimaryContact){
                            $scope.formattedPrimaryContact = FormatterService.formatContact($scope.sr.primaryContact);
                        }
                    });
                });
            };

            $scope.formatAdditionalData = function() {
                if (!BlankCheck.isNull($scope.sr.primaryContact)) {
                    $scope.formattedPrimaryContact = FormatterService.formatContact($scope.sr.primaryContact);
                }

                if (!BlankCheck.isNull($scope.sr.requestedByContact)) {
                    $scope.requestedByContactFormatted = FormatterService.formatContact($scope.sr.requestedByContact);
                }

                if (!BlankCheck.isNull(ServiceRequest.tempSpace.primaryContact)) {
                    $scope.formattedPrimaryContact = FormatterService.formatContact(ServiceRequest.tempSpace.primaryContact);
                }

            };

            if(ServiceRequest.item === null){
                $scope.redirectToList();
            }else if($rootScope.selectedContact && $rootScope.returnPickerObject && $rootScope.selectionId === ServiceRequest.item.id){
                $scope.sr = $rootScope.returnPickerSRObject;
                ServiceRequest.addRelationship('primaryContact', $rootScope.selectedContact, 'self');
                ServiceRequest.tempSpace.primaryContact = angular.copy($rootScope.selectedContact);
                $scope.formatAdditionalData();
                $scope.resetContactPicker();
            }else if($rootScope.contactPickerReset){
                $rootScope.sr = ServiceRequest.item;
                $rootScope.contactPickerReset = false;
            }else{
                $scope.sr = ServiceRequest.item;
            }

            $scope.setupSR(ServiceRequest, configureSR);
            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate);
            $scope.getRequestor(ServiceRequest, Contacts);


            function configureReviewTemplate(){
                $scope.configure.actions.translate.submit = 'SERVICE_REQUEST.SUBMIT_REQUEST_UPDATE';
                $scope.configure.actions.submit = function(){
                    updateSRObjectForSubmit();
                    if (!BlankCheck.checkNotBlank(ServiceRequest.item.postURL)) {
                        HATEAOSConfig.getApi(ServiceRequest.serviceName).then(function(api) {
                            ServiceRequest.item.postURL = api.url;
                        });
                    }
                    var deferred = ServiceRequest.post({
                        item:  $scope.sr
                    });

                    deferred.then(function(result){
                        ServiceRequest.item = ServiceRequest.item;
                        $rootScope.newSr = $scope.sr;
                        $location.path('/service_requests/' + $scope.sr.id +'/update/' + $routeParams.type + '/receipt');
                    }, function(reason){
                        NREUM.noticeError('Failed to create SR because: ' + reason);
                    });

                };
            }

            function configureReceiptTemplate() {
                $scope.configure.header.translate.h1 = "SERVICE_REQUEST.UPDATE_REQUEST_SUBMITTED";
                $scope.configure.header.translate.h1Values = {
                    'srNumber': FormatterService.getFormattedSRNumber($scope.sr)
                };
                $scope.configure.header.translate.body = "SERVICE_REQUEST.UPDATE_REQUEST_SUBMIT_HEADER_BODY";
                $scope.configure.header.translate.bodyValues= {
                    'srNumber': FormatterService.getFormattedSRNumber($scope.sr),
                    'srHours': 24,
                    'srUrl': '/service_requests',
                };
                $scope.configure.receipt = {
                    translate: {
                        title:"SERVICE_REQUEST.DETAILS_UPDATE_REQUEST_FOR_SUBMITTED",
                        titleValues: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) }
                    }
                };
                $scope.configure.contact.show.primaryAction = false;
            }

            function configureTemplates() {
                $scope.configure = {
                    header: {
                        translate: {
                            h1: 'SERVICE_REQUEST.UPDATE_REQUEST_FOR_SUBMITTED',
                            h1Values: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) },
                            body: 'MESSAGE.LIPSUM',
                            readMore: 'Learn more about requests'
                        },
                        readMoreUrl: '/service_requests/learn_more',
                        showCancelBtn: false
                    },
                    update: {
                        information:{
                            translate: {
                                h1: 'SERVICE_REQUEST.UPDATE_REQUEST_FOR_SUBMITTED',
                                title: 'SERVICE_REQUEST.REQUEST_UPDATE_INFORMATION',
                                contact: 'SERVICE_REQUEST.CONTACT_INFORMATION',
                                label: 'SERVICE_REQUEST.UPDATE_DESCRIPTION'
                            }
                        }
                    },
                    detail: {
                        translate: {
                            title: 'SERVICE_REQUEST.ADDITIONAL_REQUEST_DETAILS',
                            referenceId: 'SERVICE_REQUEST.INTERNAL_REFERENCE_ID',
                            costCenter: 'SERVICE_REQUEST.REQUEST_COST_CENTER',
                            comments: 'LABEL.COMMENTS',
                            attachments: 'LABEL.ATTACHMENTS',
                            attachmentMessage: 'MESSAGE.ATTACHMENT',
                            fileList: ['.csv', '.xls', '.xlsx', '.vsd', '.doc', '.docx', '.ppt', '.pptx', '.pdf', '.zip'].join(', ')
                        },
                        show: {
                            referenceId: true,
                            costCenter: true,
                            comments: true,
                            attachements: true
                        }
                    },
                    actions: {
                        translate: {
                            abandonRequest:'SERVICE_REQUEST.ABANDON_REQUEST_CANCELLATION',
                            submit: 'SERVICE_REQUEST.SUBMIT_REQUEST_CANCELLATION'
                        },
                        submit: $scope.goToSubmit
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
                        pickerObject: $scope.sr,
                        source: 'ServiceRequestUpdate'
                    },
                    modal: {
                        translate: {
                            abandonTitle: 'SERVICE_REQUEST.TITLE_ABANDON_MODAL',
                            abandonBody: 'SERVICE_REQUEST.BODY_ABANDON_MODAL',
                            abandonCancel:'SERVICE_REQUEST.ABANDON_MODAL_CANCEL',
                            abandonConfirm: 'SERVICE_REQUEST.ABANDON_MODAL_CONFIRM'
                        },
                        returnPath: '/service_requests'
                    },
                    contactPicker:{
                        translate:{
                            title: 'CONTACT.SELECT_CONTACT',
                            contactSelectText: 'CONTACT.SELECTED_CONTACT_IS',
                        },
                        returnPath: ServiceRequest.route + $scope.sr.id + '/update/' + $scope.sr.type
                    }
                };
            }

            $scope.formatReceiptData($scope.formatAdditionalData);

        }
    ]);
});

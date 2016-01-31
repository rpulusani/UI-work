define(['angular', 'serviceRequest'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequests')
    .controller('ServiceRequestCancelController', [
        '$scope',
        '$location',
        '$rootScope',
        'ServiceRequestService',
        'SRControllerHelperService',
        'FormatterService',
        'BlankCheck',
        'Contacts',
        'UserService',
        '$translate',
        function(
            $scope,
            $location,
            $rootScope,
            ServiceRequest,
            SRHelper,
            FormatterService,
            BlankCheck,
            Contacts,
            Users,
            $translate) {

            $rootScope.showCancelBtn = false;

            // configurations will overwrite other SR templates
            // srCancel is not fully realized but need to name an sr that is being cancelled and the actual cancel of that sr differently to avoid confusion

            SRHelper.addMethods(ServiceRequest, $scope, $rootScope);

            $scope.goToReview = function() {
                $location.path(ServiceRequests.route + $scope.srCancel.id + '/receipt');
            };

            $scope.getRequestor = function(ServiceRequest, Contacts) {
                Users.getLoggedInUserInfo().then(function() {
                    Users.item.links.contact().then(function() {
                        $scope.srCancel.requestedByContact = Users.item.contact.item;
                        ServiceRequest.addRelationship('requester', $scope.srCancel.requestedByContact, 'self');
                        $scope.srCancel.primaryContact = $scope.srCancel.requestedByContact;
                        ServiceRequest.addRelationship('primaryContact', $scope.srCancel.requestedByContact, 'self');
                        $scope.requestedByContactFormatted =
                        FormatterService.formatContact($scope.srCancel.requestedByContact);
                    });
                });
            };

            var configureSR = function(ServiceRequest){
                ServiceRequest.addRelationship('account', $scope.srCancel);
                ServiceRequest.addRelationship('primaryContact', $scope.srCancel, 'contact');
                ServiceRequest.addField('type', 'CANCEL_HARDWARE_INSTALL');  //'CANCEL_INSTALL', 'CANCEL_LBS_UPDATE', 'CANCEL_MOVE'
            };

            $scope.formatAdditionalData = function() {
                if (!BlankCheck.isNull($scope.srCancel.primaryContact)) {
                    $scope.formattedPrimaryContact = FormatterService.formatContact($scope.srCancel.primaryContact);
                }

                if (!BlankCheck.isNull($scope.srCancel.requestedByContact)) {
                    $scope.requestedByContactFormatted = FormatterService.formatContact($scope.srCancel.requestedByContact);
                }

            };

            if(ServiceRequest.item === null){
                $scope.redirectToList();
            }else{
                $scope.srCancel = ServiceRequest.item;
            }

            $scope.setupSR(ServiceRequest, configureSR);
            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate);
            $scope.getRequestor(ServiceRequest, Contacts);

            function configureReviewTemplate(){
                $scope.configure.header.translate.h1Values = {
                    'srNumber': FormatterService.getFormattedSRNumber($scope.sr)
                };
                $scope.configure.actions.translate.submit = 'SERVICE_REQUEST.SUBMIT_REQUEST_CANCELLATION';
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
                        $location.path(ServiceRequests.route + $scope.srCancel.id + '/receipt');
                    }, function(reason){
                        NREUM.noticeError('Failed to create SR because: ' + reason);
                    });

                };
            }

            function configureReceiptTemplate() {
                $scope.configure.header.translate.h1 = "SERVICE_REQUEST.CANCEL_REQUEST_SUBMITTED";
                $scope.configure.header.translate.h1Values = {
                    'srNumber': FormatterService.getFormattedSRNumber($scope.sr)
                };
                $scope.configure.header.translate.body = "SERVICE_REQUEST.CANCEL_REQUEST_SUBMIT_HEADER_BODY";
                $scope.configure.header.translate.bodyValues= {
                    'srNumber': FormatterService.getFormattedSRNumber($scope.sr),
                    'srHours': 24,
                    'addressUrl': '/service_requests',
                };
                $scope.configure.receipt = {
                    translate: {
                        title:"SERVICE_REQUEST.DETAILS_CANCEL_REQUEST_FOR_SUBMITTED",
                        titleValues: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) }
                    }
                };
                $scope.configure.contact.show.primaryAction = false;
            }

            //typed to ServiceRequest overwrites other SR headers
            function configureTemplates() {
                $scope.configure = {
                    header: {
                        translate: {
                            h1: 'SERVICE_REQUEST.CANCEL_REQUEST_FOR_SUBMITTED',
                            body: 'MESSAGE.LIPSUM',
                            readMore: 'Learn more about requests'
                        },
                        readMoreUrl: '/service_requests/learn_more'
                    },
                    cancel: {
                        information:{
                            translate: {
                                h1: 'SERVICE_REQUEST.CANCEL_REQUEST_FOR_SUBMITTED',
                                title: 'SERVICE_REQUEST.REQUEST_CANCELLATION_INFORMATION',
                                contact: 'ADDRESS_SERVICE_REQUEST.ADDRESS_CONTACT',
                                label: 'SERVICE_REQUEST.CANCELLATION_DESCRIPTION'
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
                        submit: $scope.goToReview
                    },
                    contact:{
                        translate: {
                            title: 'SERVICE_REQUEST.CONTACT_INFORMATION',
                            requestedByTitle: 'SERVICE_REQUEST.REQUEST_CREATED_BY',
                            primaryTitle: 'SERVICE_REQUEST.PRIMARY_CONTACT',
                            changePrimary: 'SERVICE_REQUEST.CHANGE_PRIMARY_CONTACT'
                        },
                        show:{
                            primaryAction : false
                        }
                    },
                    modal: {
                        translate: {
                            abandonTitle: 'SERVICE_REQUEST.TITLE_ABANDON_MODAL',
                            abandonBody: 'SERVICE_REQUEST.BODY_ABANDON_MODAL',
                            abandonCancel:'SERVICE_REQUEST.ABANDON_MODAL_CANCEL',
                            abandonConfirm: 'SERVICE_REQUEST.ABANDON_MODAL_CONFIRM'
                        },
                        returnPath: '/service_requests'
                    }
                };
            }

            $scope.formatReceiptData($scope.formatAdditionalData);

        }
    ]);
});

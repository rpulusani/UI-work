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
            '$translate',
            function(
                $scope,
                $location,
                $rootScope,
                ServiceRequest,
                SRHelper,
                FormatterService,
                BlankCheck,
                $translate) {

                SRHelper.addMethods(ServiceRequest, $scope, $rootScope);

                if(!ServiceRequest || !ServiceRequest.item){
                    $scope.redirectToList();
                }

                $scope.sr = ServiceRequest.item;

            function configureReceiptTemplate() {
                $scope.configure.header.translate.h1 = "ADDRESS_SERVICE_REQUEST.SR_ADD_SUBMITTED";
                $scope.configure.header.translate.body = "ADDRESS_SERVICE_REQUEST.ADD_ADDRESS_SUBMIT_HEADER_BODY";
                $scope.configure.header.translate.bodyValues= {
                    'srNumber': FormatterService.getFormattedSRNumber($scope.sr),
                    'srHours': 24,
                    'addressUrl': '/service_requests/addresses',
                };
                $scope.configure.receipt = {
                    translate: {
                        title:"ADDRESS_SERVICE_REQUEST.REQUEST_SERVICE_DETAIL",
                        titleValues: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) }
                    }
                };
                $scope.configure.contact.show.primaryAction = false;
            }

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
                                title: 'SERVICE_REQUEST.REQUEST_CANCELLATION_INFORMATION',
                                contact: 'ADDRESS_SERVICE_REQUEST.ADDRESS_CONTACT',
                                label: 'SERVICE_REQUEST.REQUEST_CANCELLATION_DESCRIPTION'
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

            }
    ]);
});

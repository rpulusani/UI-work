define(['angular', 'serviceRequest'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequests')
    .controller('ServiceRequestUpdateController', [
        '$scope',
        '$location',
        '$routeParams',
        '$rootScope',
        '$interpolate',
        'ServiceRequestService',
        'SRControllerHelperService',
        'FormatterService',
        'BlankCheck',
        'Contacts',
        'UserService',
        '$translate',
        'HATEAOSConfig',
        '$timeout',
        'TombstoneService',
        'tombstoneWaitTimeout',
        function(
            $scope,
            $location,
            $routeParams,
            $rootScope,
            $interpolate,
            ServiceRequest,
            SRHelper,
            FormatterService,
            BlankCheck,
            Contacts,
            Users,
            $translate,
            HATEAOSConfig,
            $timeout,
            Tombstone,
            tombstoneWaitTimeout) {

            // NOTE - setupTemplates expects 'review' in the URL in order
            // to fire configureReviewTemplate. This is not used by cancel
            // since the type comes through a url parameter. Changes should
            // go in the goToSubmit function

            $scope.isLoading = false;

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
                } else if ($location.path().indexOf('UPDATE_CONSUMABLES_ORDER') > -1) {
                    ServiceRequest.addField('type', 'UPDATE_CONSUMABLES_ORDER');
                } else if ($location.path().indexOf('UPDATE_HARDWARE_ORDER') > -1) {
                    ServiceRequest.addField('type', 'UPDATE_HARDWARE_ORDER');
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
              if(!$scope.isLoading) {
                $scope.isLoading = true;

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
                  if(ServiceRequest.item._links['tombstone']){
                    $timeout(function() {
                      $location.search('tab', null);
                        ServiceRequest.getAdditional(ServiceRequest.item, Tombstone, 'tombstone', true).then(function() {
                          var exp = $interpolate('{{root}}/{{id}}/update/{{type}}/receipt/{{queued}}');
                          if(Tombstone.item && Tombstone.item.siebelId) {
                            ServiceRequest.item.requestNumber = Tombstone.item.siebelId;
                            $location.path(exp({
                              root: ServiceRequest.route,
                              id: $scope.sr.id,
                              type: $routeParams.type,
                              queued: 'notqueued'}));
                          } else {
                              ServiceRequest.item = ServiceRequest.item;
                              $rootScope.newSr = $scope.sr;
                              $location.path(exp({
                                root: ServiceRequest.route,
                                id: $scope.sr.id,
                                type: $routeParams.type,
                                queued: 'queued'}));
                            }
                        });
                      }, tombstoneWaitTimeout);
                    }

                }, function(reason){
                    NREUM.noticeError('Failed to create SR because: ' + reason);
                });
              }
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
            }

            function configureReceiptTemplate() {
              if($routeParams.queued === 'queued') {
                $scope.configure.header.translate.h1="QUEUE.RECEIPT.TXT_TITLE";
                $scope.configure.header.translate.h1Values = {
                    'type': $translate.instant('SERVICE_REQUEST_COMMON.TYPES.' + ServiceRequest.item.type)
                };
                $scope.configure.header.translate.body = "QUEUE.RECEIPT.TXT_PARA";
                $scope.configure.header.translate.bodyValues= {
                    'srHours': 24
                };
                $scope.configure.header.translate.readMore = undefined;
                $scope.configure.header.translate.action="QUEUE.RECEIPT.TXT_ACTION";
                $scope.configure.header.translate.actionValues = {
                    actionLink: ServiceRequest.route,
                    actionName: 'Manage Service Requests'
                };
                $scope.configure.receipt = {
                    translate:{
                        title:"ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_DETAIL_SUPPLIES",
                        titleValues: {'srNumber': $translate.instant('QUEUE.RECEIPT.TXT_GENERATING_REQUEST') }
                    }
                };
                $scope.configure.queued = true;
              } else {
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
                            abandonRequest:'SERVICE_REQUEST.ABANDON_REQUEST_UPDATE',
                            submit: 'SERVICE_REQUEST.SUBMIT_REQUEST_UPDATE'
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



angular.module('mps.serviceRequests')
.controller('ServiceRequestCancelController', [
    '$scope',
    '$filter',
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
    'tombstoneWaitTimeout','$interval','tombstoneCheckCount',
    function(
        $scope,
        $filter,
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
        tombstoneWaitTimeout,$interval,tombstoneCheckCount) {

        // NOTE - setupTemplates expects 'review' in the URL in order
        // to fire configureReviewTemplate. This is not used by cancel
        // since the type comes through a url parameter. Changes should
        // go in the goToSubmit function
        if(ServiceRequest.item === null){
            $location.path('/service_requests').search('tab','serviceRequestsAllTab');
        }

        $scope.isLoading = false;

        SRHelper.addMethods(ServiceRequest, $scope, $rootScope);
        var statusBarLevelsShort = [
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED_SHORT'), value: 'SUBMITTED'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_IN_PROCESS'), value: 'INPROCESS'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_COMPLETED'), value: 'COMPLETED'}];

        function getSRNumber(existingUrl) {
            var exp = $interpolate('{{root}}/{{id}}/cancel/{{type}}/receipt/{{queued}}');
            var intervalPromise = $interval(function(){        		
        		ServiceRequest.getAdditional(ServiceRequest.item, Tombstone, 'tombstone', true).then(function(){
        			
                    if (existingUrl === $location.url()) {
                        if(Tombstone.item && Tombstone.item.siebelId) {
                            ServiceRequest.item.requestNumber = Tombstone.item.siebelId;
                            $location.path(exp({root: ServiceRequest.route,
                                id: $scope.sr.id,
                                type: $routeParams.type,
                                queued: 'notqueued'}));
                            $interval.cancel(intervalPromise);
                        }
                    }
                });
        	}, tombstoneWaitTimeout, tombstoneCheckCount);
        	
        	intervalPromise.then(function(){
        		$location.path(exp({root: ServiceRequest.route,
                    id: $scope.sr.id,
                    type: $routeParams.type,
                    queued: 'queued'}));
        		$interval.cancel(intervalPromise);
        	});
        	
        }

        $scope.goToReview = function() {
            $location.path('/service_requests/' + $scope.sr.id +'/cancel/' + $routeParams.type + '/review');
        };

        $scope.updateSRObjectForSubmit = function() {
            ServiceRequest.newMessage();
            $scope.srToSubmit = ServiceRequest.item;
            if($location.path().indexOf('CANCEL_INSTALL') > -1) {
                ServiceRequest.addField('type', 'CANCEL_INSTALL');
            } else if ($location.path().indexOf('CANCEL_DECOMMISSION') > -1) {
                ServiceRequest.addField('type', 'CANCEL_DECOMMISSION');
            } else if ($location.path().indexOf('CANCEL_MOVE') > -1) {
                ServiceRequest.addField('type', 'CANCEL_MOVE');
            } else {
                ServiceRequest.addField('type', 'CANCEL_ALL');
            }
            ServiceRequest.addField('description', $scope.sr.cancellationDescription);
            ServiceRequest.addField('notes', $scope.sr.notes);
            ServiceRequest.addField('customerReferenceId', $scope.sr.customerReferenceId);
            ServiceRequest.addRelationship('primaryContact', $scope.sr.primaryContact, 'self');
            ServiceRequest.addRelationship('requester', $scope.sr.requestedByContact, 'self');
            ServiceRequest.addRelationship('account', $scope.sr, 'account');
            ServiceRequest.addRelationship('relatedRequest', $scope.sr, 'self');
            ServiceRequest.addField('attachments', $scope.files_complete);

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
              if(ServiceRequest.item._links['tombstone']) {
                getSRNumber($location.url());
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

            if (ServiceRequest.tempSpace && !BlankCheck.isNull(ServiceRequest.tempSpace.primaryContact)) {
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
          var submitDate = $filter('date')(new Date(), 'yyyy-MM-ddTHH:mm:ss');
          $scope.configure.statusList = $scope.setStatusBar('SUBMITTED', submitDate.toString(), statusBarLevelsShort);
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
                    actionName: 'REQUEST_MAN.COMMON.TXT_MANAGE_SERVICE_REQUESTS'
                };
                $scope.configure.receipt = {
                    translate:{
                        title:"REQUEST_MAN.MANAGE_REQUESTS.TXT_CANCEL_REQUEST_DETAILS",
                        titleValues: {'srNumber': $translate.instant('QUEUE.RECEIPT.TXT_GENERATING_REQUEST') }
                    },
                    descriptionDetail: {
                        information:{
                            translate: {
                                    title: 'REQUEST_MAN.MANAGE_REQUESTS.TXT_CANCELLATION_DETAILS',
                                    label: 'REQUEST_MAN.MANAGE_REQUESTS.TXT_CANCEL_DESCRIPTION'
                            }
                        },
                        show: {
                            description: true
                        }
                    }
                };
                $scope.configure.queued = true;
          } else {
            $scope.configure.header.translate.h1 = "REQUEST_MAN.MANAGE_REQUESTS.TXT_CANCEL_REQUEST_SUBMITTED";
            $scope.configure.header.translate.h1Values = {
                'srNumber': FormatterService.getFormattedSRNumber($scope.sr),
                'refId': FormatterService.getFormattedSRNumber($scope.sr)
            };
            $scope.configure.header.translate.body = "REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED";
            $scope.configure.header.translate.bodyValues= {
                'srNumber': FormatterService.getFormattedSRNumber($scope.sr),
                'refId': FormatterService.getFormattedSRNumber($scope.sr),
                'srHours': 24,
                'srUrl': '/service_requests',
            };
            $scope.configure.receipt = {
                translate: {
                    title:"REQUEST_MAN.MANAGE_REQUESTS.TXT_CANCEL_REQUEST_DETAILS",
                    titleValues: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) }
                },
                descriptionDetail: {
                    information:{
                        translate: {
                            title: 'REQUEST_MAN.MANAGE_REQUESTS.TXT_CANCELLATION_DETAILS',
                            label: 'REQUEST_MAN.MANAGE_REQUESTS.TXT_CANCEL_DESCRIPTION'
                        }
                    },
                    show: {
                        description: true
                    }
                }
            };
            $scope.configure.contact.show.primaryAction = false;
          }
        }

        function configureTemplates() {
            $scope.configure = {
                header: {
                    translate: {
                            h1: 'REQUEST_MAN.MANAGE_REQUESTS.TXT_CANCEL_REQUEST_NUMBER',
                        h1Values: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) },
                            body: 'REQUEST_MAN.MANAGE_REQUESTS.TXT_CANCEL_REQUEST_PAR',
                            readMore: 'REQUEST_MAN.COMMON.LNK_LEARN_MORE'
                    },
                    readMoreUrl: '/service_requests/learn_more',
                    showCancelBtn: false
                },
                cancel: {
                    information:{
                        translate: {
                                h1: 'REQUEST_MAN.MANAGE_REQUESTS.TXT_CANCEL_REQUEST_NUMBER',
                                title: 'REQUEST_MAN.MANAGE_REQUESTS.TXT_REQUEST_CANCEL_INFORMATION',
                                contact: 'REQUEST_MAN.COMMON.TXT_REQUEST_CONTACT',
                                label: 'REQUEST_MAN.MANAGE_REQUESTS.TXT_CANCEL_DESCRIPTION'
                        }
                    }
                },
                detail: {
                    translate: {
                            title: 'REQUEST_MAN.MANAGE_REQUESTS.TXT_REQUEST_ADDL_CANCEL_DETAILS',
                            referenceId: 'REQUEST_MAN.COMMON.TXT_REQUEST_CUST_REF_ID',
                            costCenter: 'REQUEST_MAN.COMMON.TXT_REQUEST_COST_CENTER',
                            comments: 'REQUEST_MAN.COMMON.TXT_REQUEST_COMMENTS',
                            attachments: 'REQUEST_MAN.COMMON.TXT_REQUEST_ATTACHMENTS',
                            attachmentMessage: 'REQUEST_MAN.COMMON.TXT_REQUEST_ATTACH_FILE_FORMATS',
                            validationMessage:'ATTACHMENTS.COMMON.VALIDATION',
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
                            abandonRequest:'REQUEST_MAN.MANAGE_REQUESTS.BTN_ABANDON_REQUEST_CANCELLATION',
                            submit: 'REQUEST_MAN.MANAGE_REQUESTS.BTN_SUBMIT_REQUEST_CANCELLATION'
                    },
                    submit: $scope.goToSubmit
                },
                contact:{
                    translate: {
                        title: 'CONTACT_MAN.COMMON.TXT_CONTACT_INFORMATION',
                        requestedByTitle: 'REQUEST_MAN.COMMON.TXT_REQUEST_CREATED_BY',
                        primaryTitle: 'REQUEST_MAN.COMMON.TXT_REQUEST_CONTACT',
                        changePrimary: 'SERVICE_REQUEST.CHANGE_PRIMARY_CONTACT'
                    },
                    show:{
                        primaryAction : true
                    },
                    pickerObject: $scope.sr,
                    source: 'ServiceRequestCancel'
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
                    returnPath: ServiceRequest.route + $scope.sr.id + '/cancel/' + $scope.sr.type
                },
                attachments:{
                    maxItems:2
                }
            };
        }

        $scope.formatReceiptData($scope.formatAdditionalData);

    }
]);


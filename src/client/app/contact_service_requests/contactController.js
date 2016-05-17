
angular.module('mps.serviceRequestContacts')
.controller('ContactController', [
    '$scope',
    '$location',
    '$filter',
    'Contacts',
    '$translate',
    '$rootScope',
    'FormatterService',
    'BlankCheck',
    'UserService',
    'ServiceRequestService',
    'SRControllerHelperService',
    'SecurityHelper',
    '$timeout',
    'tombstoneWaitTimeout',
    'TombstoneService',
    function($scope,
        $location,
        $filter,
        Contacts,
        $translate,
        $rootScope,
        FormatterService,
        BlankCheck,
        Users,
        ServiceRequest,
        SRHelper,
        SecurityHelper,
        $timeout,
        tombstoneWaitTimeout,
        Tombstone
        ) {
    	$scope.isLoading = false;
        SRHelper.addMethods(Contacts, $scope, $rootScope);

        var configureSR = function(ServiceRequest){
        	ServiceRequest.addRelationship('secondaryContact', $scope.contact, 'self');
            ServiceRequest.addRelationship('account', $scope.contact);
            ServiceRequest.addField('sourceAddress', $scope.contact.address);
            ServiceRequest.addField('type', 'DATA_CONTACT_CHANGE');
            ServiceRequest.addField('attachments', $scope.files_complete);
           
        },
        statusBarLevels = [
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED_SHORT'), value: 'SUBMITTED'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_IN_PROCESS'), value: 'INPROCESS'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_COMPLETED'), value: 'COMPLETED'}];

        $scope.getRequestor = function(ServiceRequest, Contacts) {
            Users.getLoggedInUserInfo().then(function() {
                Users.item.links.contact().then(function() {
                    $scope.contact.requestedByContact = Users.item.contact.item;
                    ServiceRequest.addRelationship('requester', $scope.contact.requestedByContact, 'self');
                    if(!$scope.contact.primaryContact){
                        $scope.contact.primaryContact = $scope.contact.requestedByContact;

                        ServiceRequest.addRelationship('primaryContact', $scope.contact.requestedByContact, 'self');
                    }
                    $scope.formatAdditionalData();
                });
            });
        };

        $scope.formatAdditionalData = function() {
            if (!BlankCheck.isNull($scope.contact.primaryContact)) {
                $scope.formattedPrimaryContact = FormatterService.formatContact($scope.contact.primaryContact);
            }

            if (!BlankCheck.isNull($scope.contact.address)) {
                $scope.formattedContactAddress = FormatterService.formatAddress($scope.contact.address);
            }

            if (!BlankCheck.isNull($scope.contact)) {
                $scope.formattedContact = FormatterService.formatContact($scope.contact);
            }

            if (!BlankCheck.isNull($scope.contact.requestedByContact)) {
                $scope.requestedByContactFormatted = FormatterService.formatContact($scope.contact.requestedByContact);
            }
            if (!BlankCheck.isNull($scope.sr.customerReferenceId)) {
                $scope.formattedReferenceId = FormatterService.formatNoneIfEmpty($scope.sr.customerReferenceId);
            }

            if (!BlankCheck.isNull($scope.sr.costCenter)) {
                $scope.formattedCostCenter = FormatterService.formatNoneIfEmpty($scope.sr.costCenter);
            }

        };

        if (Contacts.item === null) {
            $scope.redirectToList();
        } else if($rootScope.selectedContact && $rootScope.returnPickerObject && $rootScope.selectionId === Contacts.item.id){
            $scope.contact = $rootScope.returnPickerObject;
            $scope.sr = $rootScope.returnPickerSRObject;
            ServiceRequest.addRelationship('primaryContact', $rootScope.selectedContact, 'self');
            $scope.contact.primaryContact = angular.copy($rootScope.selectedContact);
            $scope.formatAdditionalData();
            $scope.resetContactPicker();
        }else if($rootScope.contactPickerReset){
            $rootScope.contact = Contacts.item;
            $rootScope.contactPickerReset = false;
        }else {
            $scope.contact = Contacts.item;
            if (Contacts.item && !BlankCheck.isNull(Contacts.item['contact']) && Contacts.item['contact']['item']) {
                $scope.Contacts.primaryContact = Contacts.item['contact']['item'];
            }else if(Contacts.item && !BlankCheck.isNull(Contacts.item['contact'])){
                $scope.Contacts.primaryContact = Contacts.item['contact'];
            }

            if ($rootScope.returnPickerObject && $rootScope.selectionId !== Contacts.item.id) {
                $scope.resetContactPicker();
            }
        }

        $scope.setupSR(ServiceRequest, configureSR);
        $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate, ServiceRequest);
        $scope.getRequestor(ServiceRequest, Contacts);


        function configureReviewTemplate(){
            $scope.configure.actions.translate.submit = 'CONTACT_SERVICE_REQUEST.SUBMIT_UPDATE_CONTACT_REQUEST';
            $scope.configure.actions.submit = function(){
            	  if(!$scope.isLoading) {
                      $scope.isLoading = true;
                      if (!BlankCheck.checkNotBlank(ServiceRequest.item.postURL)) {
                          HATEAOSConfig.getApi(ServiceRequest.serviceName).then(function(api) {
                              ServiceRequest.item.postURL = api.url;
                          });
                     }
                     var deferred = ServiceRequest.post({
                          item:  $scope.sr
                     });
                     deferred.then(function(result){
                     	if(ServiceRequest.item._links['tombstone']) {
                             getSRNumber($location.url());
                         }
                         $rootScope.newContact = $scope.contact;
                         $rootScope.newSr = $scope.sr;
                         
                     }, function(reason){
                         NREUM.noticeError('Failed to create SR because: ' + reason);
                     });
            	  }
            };
        }
        function getSRNumber(existingUrl) {
            $timeout(function(){
                return ServiceRequest.getAdditional(ServiceRequest.item, Tombstone, 'tombstone', true).then(function(){
                    if (existingUrl === $location.url()) {
                        if(Tombstone.item && Tombstone.item.siebelId) {
                            ServiceRequest.item.requestNumber = Tombstone.item.siebelId;
                            $location.path(Contacts.route + '/update/' + $scope.contact.id + '/receipt');
                        } else {
                            return getSRNumber($location.url());
                        }
                    }
                });
            }, tombstoneWaitTimeout);
        }
        function configureReceiptTemplate(){
            var srMsg = FormatterService.getFormattedSRNumber($scope.sr),
            submitDate = $filter('date')(new Date(), 'yyyy-MM-ddTHH:mm:ss');
            $scope.configure.statusList = $scope.setStatusBar('SUBMITTED', submitDate.toString(), statusBarLevels);

            if (!srMsg) {
                    srMsg = $translate.instant('QUEUE.RECEIPT.TXT_GENERATING_REQUEST');
            }

            $scope.configure.header.translate.h1 = "CONTACT_SERVICE_REQUEST.SR_UPDATE_TITLE";
            $scope.configure.header.translate.body = "CONTACT_MAN.UPDATE_CONTACT.TXT_UPDATE_SUPPLIES_CONTACT_PAR";
            $scope.configure.header.translate.bodyValues= {
                'srNumber': srMsg,
                'srHours': 24,
                'contactManagementUrl': 'service_requests/contacts',
            };
            $scope.configure.receipt = {
                translate:{
                    title:"CONTACT_SERVICE_REQUEST.UPDATE_CONTACT_DETAIL",
                    titleValues: {'srNumber':  srMsg}
                },
                print: true
            };

            $scope.configure.contactsr.translate.title = 'CONTACT_SERVICE_REQUEST.DATA_CONTACT_CHANGE';
            $scope.configure.contact.show.primaryAction = false;
        }
        function configureTemplates(){
            $scope.configure = {
                header: {
                    translate:{
                        h1: 'CONTACT_MAN.UPDATE_CONTACT.TXT_UPDATE_SUPPLIES_CONTACT',
                        body: 'CONTACT_MAN.UPDATE_CONTACT.TXT_UPDATE_SUPPLES_CONTACT_REVIEW',
                        bodyValues: '',
                        readMore: ''
                    },
                    readMoreUrl: '',
                    showCancelBtn: false
                },
                contactsr:{
                    translate: {
                        title: 'CONTACT_MAN.COMMON.TXT_CONTACT_INFORMATION'
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
                    pickerObject: $scope.contact,
                    source: 'ContactUpdateAddress'
                },
                detail:{
                    translate:{
                        title: 'SERVICE_REQUEST.ADDITIONAL_REQUEST_DETAILS',
                        referenceId: 'REQUEST_MAN.COMMON.TXT_REQUEST_CUST_REF_ID',
                        costCenter: 'REQUEST_MAN.COMMON.TXT_REQUEST_COST_CENTER',
                        comments: 'LABEL.COMMON.COMMENTS',
                        attachments: 'LABEL.COMMON.ATTACHMENTS',
                        attachmentMessage: 'MESSAGE.ATTACHMENT',
                        validationMessage:'ATTACHMENTS.COMMON.VALIDATION',
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
                        abandonRequest:'CONTACT_MAN.UPDATE_CONTACT.BTN_DISCARD_CHANGES',
                        submit: 'CONTACT_MAN.MANAGE_CONTACTS.BTN_UPDATE_CONTACT'
                    },
                    submit: function(){
                        $location.path(Contacts.route + '/update/' + $scope.contact.id + '/review');
                    }
                },
                modal:{
                    translate:{
                        abandonTitle: 'SERVICE_REQUEST.TITLE_ABANDON_MODAL',
                        abandondBody: 'SERVICE_REQUEST.BODY_ABANDON_MODAL',
                        abandonCancel:'SERVICE_REQUEST.ABANDON_MODAL_CANCEL',
                        abandonConfirm: 'SERVICE_REQUEST.ABANDON_MODAL_CONFIRM',
                    },
                    returnPath: '/service_requests/contacts'
                },
                contactPicker:{
                    translate:{
                        title: 'CONTACT.SELECT_CONTACT',
                        contactSelectText: 'CONTACT.SELECTED_CONTACT_IS',
                    },
                    returnPath: Contacts.route + '/update/' + $scope.contact.id + '/review'
                },
                attachments:{
                    maxItems:2
                }
            };
        }

        $scope.formatReceiptData($scope.formatAdditionalData);

    }
]);

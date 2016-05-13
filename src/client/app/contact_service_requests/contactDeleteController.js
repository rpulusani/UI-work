
angular.module('mps.serviceRequestContacts')
.controller('ContactDeleteController', [
    '$scope',
    '$rootScope',
    '$filter',
    '$routeParams',
    '$location',
    '$timeout',
    '$translate',
    'Contacts',
    'ServiceRequestService',
    'FormatterService',
    'BlankCheck',
    'SRControllerHelperService',
    'UserService',
    'TombstoneService',
    'tombstoneWaitTimeout',
    'SecurityHelper',
    function($scope,
        $rootScope,
        $filter,
        $routeParams,
        $location,
        $timeout,
        $translate,
        Contacts,
        ServiceRequest,
        FormatterService,
        BlankCheck,
        SRHelper,
        Users,
        Tombstone,
        tombstoneWaitTimeout,
        SecurityHelper) {
    	
    	 if(Contacts.item === null){       
             $location.path('/service_requests/contacts/');
         }
    	
        $scope.isLoading = false;

        SRHelper.addMethods(Contacts, $scope, $rootScope);
        $scope.setTransactionAccount('ContactDelete', Contacts);
        new SecurityHelper($rootScope).redirectCheck($rootScope.contactAccess);

        var statusBarLevels = [
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED_SHORT'), value: 'SUBMITTED'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_IN_PROCESS'), value: 'INPROCESS'},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_COMPLETED'), value: 'COMPLETED'}];

        var configureSR = function(ServiceRequest){
                ServiceRequest.addRelationship('account', Contacts.item);
                ServiceRequest.addRelationship('contact', $scope.contact, 'self');
                ServiceRequest.addRelationship('primaryContact', $scope.contact, 'requestor');
                ServiceRequest.addField('type', 'DATA_CONTACT_REMOVE');

        };

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

        function getSRNumber(existingUrl) {
            $timeout(function(){
                return ServiceRequest.getAdditional(ServiceRequest.item, Tombstone, 'tombstone', true).then(function(){
                    if (existingUrl === $location.url()) {
                        if(Tombstone.item && Tombstone.item.siebelId) {
                            ServiceRequest.item.requestNumber = Tombstone.item.siebelId;
                            $location.path(Contacts.route + '/delete/' + $scope.contact.id + '/receipt/notqueued');
                        } else {
                            return getSRNumber($location.url());
                        }
                    }
                });
            }, tombstoneWaitTimeout);
        }

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
        $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate );
        $scope.getRequestor(ServiceRequest, Contacts);

        function configureReviewTemplate(){
            $scope.configure.actions.translate.submit = 'CONTACT_MAN.DELETE_CONTACT.BTN_SUBMIT_DELETE_CONTACT';
            $scope.configure.actions.submit = function(){
              if(!$scope.isLoading) {
                $scope.isLoading = true;
                ServiceRequest.addField('attachments', $scope.files_complete);
                var deferred = ServiceRequest.post({
                     item:  $scope.sr
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
        }
        function configureReceiptTemplate(){
          var submitDate = $filter('date')(new Date(), 'yyyy-MM-ddTHH:mm:ss');
          $scope.configure.statusList = $scope.setStatusBar('SUBMITTED', submitDate.toString(), statusBarLevels);
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
                actionLink: Contacts.route,
                actionName: 'Manage Contacts'
            };
            $scope.configure.receipt = {
                translate:{
                    title:"ORDER_MAN.SUPPLY_ORDER_SUBMITTED.TXT_ORDER_DETAIL_SUPPLIES",
                    titleValues: {'srNumber': $translate.instant('QUEUE.RECEIPT.TXT_GENERATING_REQUEST') }
                }
            };
            $scope.configure.queued = true;
          } else {
            $scope.configure.header.translate.h1 = "CONTACT_SERVICE_REQUEST.SR_DELETE_SUBMITTED";
            $scope.configure.header.translate.body = "CONTACT_MAN.DELETE_CONTACT.TXT_DELETE_SUPPLIES_CONTACT_PAR";
            $scope.configure.header.translate.readMore = 'CONTACT_SERVICE_REQUEST.RETURN_LINK';
            $scope.configure.header.translate.readMoreUrl = Contacts.route;
            $scope.configure.header.translate.bodyValues= {
                'srNumber': FormatterService.getFormattedSRNumber($scope.sr),
                'srHours': 24,
                'contactManagementUrl': 'service_requests/contacts',
            };
            $scope.configure.receipt = {
                translate:{
                    title:"CONTACT_SERVICE_REQUEST.DELETE_CONTACT_DETAIL",
                    titleValues: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) }
                },
                print: true
            };
            $scope.configure.contactsr.translate.title = 'CONTACT_SERVICE_REQUEST.DATA_CONTACT_REMOVE_TITLE';
            $scope.configure.contact.show.primaryAction = false;
          }
        }
        function configureTemplates(){
            $scope.configure = {
                header: {
                    translate:{
                        h1: 'CONTACT_MAN.DELETE_CONTACT.TXT_DELETE_SUPPLIES_CONTACT',
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
                        title: 'CONTACT_MAN.DELETE_CONTACT.TXT_REQUEST_CONTACT',
                        requestedByTitle: 'CONTACT_MAN.DELETE_CONTACT.TXT_REQUEST_CREATED_BY',
                        primaryTitle: 'CONTACT_MAN.DELETE_CONTACT.TXT_REQUEST_CONTACT',
                        changePrimary: 'SERVICE_REQUEST.CHANGE_PRIMARY_CONTACT'
                    },
                    show:{
                        primaryAction : true
                    },
                    pickerObject: $scope.contact,
                    source: 'ContactDelete'
                },
                detail:{
                    translate:{
                        title: 'CONTACT_MAN.DELETE_CONTACT.TXT_ADDTIONAL_REQUEST_DETAILS',
                        referenceId: 'CONTACT_MAN.DELETE_CONTACT.TXT_CUSTOMER_REF_ID',
                        costCenter: 'CONTACT_MAN.DELETE_CONTACT.TXT_REQUEST_COST_CENTER',
                        comments: 'CONTACT_MAN.DELETE_CONTACT.TXT_COMMENTS',
                        attachments: 'CONTACT_MAN.DELETE_CONTACT.TXT_ATTACHMENTS_SIZE',
                        attachmentMessage: 'CONTACT_MAN.DELETE_CONTACT.TXT_ATTACHMENTS_FORMAT',
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
                        abandonRequest:'CONTACT_MAN.DELETE_CONTACT.BTN_ABANDON_CONTACT_DELETE',
                        submit: 'CONTACT_MAN.DELETE_CONTACT.BTN_SUBMIT_DELETE_CONTACT'
                    },
                    submit: function(){
                        $location.path(Contacts.route + '/delete/' + $scope.contact.id + '/review');
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
                    returnPath: Contacts.route + '/delete/' + $scope.contact.id + '/review'
                },
                attachments:{
                    maxItems:2
                }
            };
        }

        $scope.formatReceiptData($scope.formatAdditionalData);
    }
]);

define(['angular', 'serviceRequest'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequests')
    .factory('SRControllerHelperService', [
        '$translate',
        '$location',
        'BlankCheck',
        'FormatterService',
        function(
            $translate,
            $location,
            BlankCheck,
            FormatterService
            ) {
            var scope,
            rootScope,
            halObj;

            function goToContactPicker(pickerObject) {
                if(pickerObject && scope.sr){
                    rootScope.returnPickerObject = pickerObject;
                    rootScope.returnPickerSRObject = scope.sr;
                    $location.path(halObj.route + '/pick_contact');
                }else{
                    throw 'Failed to route to pick a contact either pickerObject or sr object are empty';
                }
            }

            function redirectToList() {
                if(halObj && halObj.route){
                    $location.path(halObj.route + '/');
                }else{
                    $location.path('/');
                }
            }

            function setupSR(ServiceRequest, fillFunc){
                if(ServiceRequest){
                    if(ServiceRequest.item === null){
                        ServiceRequest.newMessage();
                        scope.sr = ServiceRequest.item;
                        if(fillFunc){
                            fillFunc(ServiceRequest);
                        }
                        ServiceRequest.addField('customerReferenceId', '');
                        ServiceRequest.addField('costCenter', '');
                        ServiceRequest.addField('notes', '');
                        ServiceRequest.addField('description', '');
                    }else{
                       scope.sr = ServiceRequest.item;
                    }
                }else{
                    throw 'setupSR needs a ServiceRequest Factory to perform this function';
                }
            }

            function getRequestor(ServiceRequest, Contacts){
                var user = {item: {}}; 
                user.item = Contacts.createItem(rootScope.currentUser.item);

                user.item.links.contact().then(function() {
                    scope.device.requestedByContact = user.item.contact.item;
                    ServiceRequest.addRelationship('requester', scope.device.requestedByContact, 'self');
                    ServiceRequest.addRelationship('primaryContact', scope.device.requestedByContact, 'self');
                    scope.requestedByContactFormatted =
                    FormatterService.formatContact(scope.device.requestedByContact);
                });
            }

            function setupTemplates(configureMainTemplate, configureReceipt, configureReview){
                if(configureMainTemplate){
                    configureMainTemplate();
                    if($location.path().indexOf('receipt') > -1){
                        if(configureReceipt){
                            configureReceipt();
                        }else{
                            throw 'recieptTemplate function was not passed into setupTemplates';
                        }
                    }else if($location.path().indexOf('review') > -1){
                        if(configureReview){
                            configureReview();
                        }else{
                            throw 'reviewTemplate function was not passed into setupTemplates';
                        }
                    }
                }else{
                    throw 'mainTemplate function was not passed into setupTemplates';
                }
            }

            function formatReceiptData(formatAdditionalData){
                if(formatAdditionalData){
                    formatAdditionalData();
                }
                if(scope.sr){
                    scope.formattedNotes = FormatterService.formatNoneIfEmpty(scope.sr.notes);
                    scope.formattedReferenceId = FormatterService.formatNoneIfEmpty(scope.sr.customerReferenceId);
                    scope.formattedCostCenter = FormatterService.formatNoneIfEmpty(scope.sr.costCenter);
                    scope.formattedAttachments = FormatterService.formatNoneIfEmpty(scope.sr.attachments);
                }
            }

            function addMethods(halObject, $scope, $rootScope){
                halObj = halObject;
                scope = $scope;
                rootScope = $rootScope;

                if(scope){
                    scope.goToContactPicker = goToContactPicker;
                    scope.redirectToList = redirectToList;
                    scope.getRequestor = getRequestor;
                    scope.formatReceiptData = formatReceiptData;
                    scope.setupTemplates = setupTemplates;
                    scope.setupSR = setupSR;
                }else{
                    throw 'scope was not passed in to addMethods';
                }
            }

        return  {
            addMethods: addMethods
        };
    }]);
});

define(['angular', 'serviceRequest'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequests')
    .factory('SRControllerHelperService', [
        '$translate',
        '$location',
        'BlankCheck',
        'FormatterService',
        'UserService',
        '$rootScope',
        function(
            $translate,
            $location,
            BlankCheck,
            FormatterService,
            Users,
            $rootScope
            ) {
            var scope,
            rootScope,
            halObj;

            function setTransactionAccount(source, halObject, incontextAccount){
                if(!inTransactionalAccountContext()){
                    if(!halObject.getRelationship('account', halObject.item)){
                        goToAccountPicker(source, halObject.item);
                    }
                }

            }
            function inTransactionalAccountContext(){
                var result = false;
                if($rootScope.currentAccount && $rootScope.currentAccount.accountLevel &&
                    $rootScope.currentAccount.accountLevel.toUpperCase() === 'SIEBEL'){
                    result = true;
                }

                return result;
            }
            function goToAccountPicker(source, pickerObject){
                if(pickerObject && source){
                    rootScope.accountReturnPath = $location.path();
                    rootScope.returnPickerObject = pickerObject;
                    $location.search('tab',null);
                    $location.path(halObj.route + '/pick_account/' + source);
                }else{
                    throw 'Failed to route to pick an account either pickerObject or sr object are empty';
                }
            }

            function goToContactPicker(source, currentSelected, pickerObject) {
                if(pickerObject && scope.sr){
                    rootScope.currentSelected = currentSelected;
                    if (pickerObject.id) {
                        rootScope.selectionId = pickerObject.id;
                    }
                    rootScope.contactReturnPath = $location.path();
                    rootScope.returnPickerObject = pickerObject;
                    rootScope.returnPickerSRObject = scope.sr;
                    $location.path(halObj.route + '/pick_contact/' + source);
                }else{
                    throw 'Failed to route to pick a contact either pickerObject or sr object are empty';
                }
            }

            function goToAddressPicker(source, pickerObject) {
                if (pickerObject && scope.sr) {
                    rootScope.addressReturnPath = $location.path();
                    if (pickerObject.id) {
                        rootScope.selectionId = pickerObject.id;
                    }
                    rootScope.returnPickerObjectAddress = pickerObject;
                    rootScope.returnPickerSRObjectAddress = scope.sr;
                    $location.path(halObj.route + '/pick_address/' + source);
                } else{
                    throw 'Failed to route to pick an Address either pickerObject or sr object are empty';
                }
            }

            function goToAddressBillToPicker(source, pickerObject) {
                if (pickerObject && scope.sr) {
                    rootScope.addressReturnPath = $location.path();
                    if (pickerObject.id) {
                        rootScope.selectionId = pickerObject.id;
                    }
                    rootScope.returnPickerObjectAddressBillTo = pickerObject;
                    rootScope.returnPickerSRObjectAddressBillTo = scope.sr;
                    $location.path(halObj.route + '/pick_address_bill_to/' + source);
                } else{
                    throw 'Failed to route to pick an Bill To Address either pickerObject or sr object are empty';
                }
            }

            function goToAddressShipToPicker(source, pickerObject) {
                if (pickerObject && scope.sr) {
                    rootScope.addressReturnPath = $location.path();
                    if (pickerObject.id) {
                        rootScope.selectionId = pickerObject.id;
                    }
                    rootScope.returnPickerObjectAddressShipTo = pickerObject;
                    rootScope.returnPickerSRObjectAddressShipTo = scope.sr;
                    $location.path(halObj.route + '/pick_address_ship_to/' + source);
                } else{
                    throw 'Failed to route to pick an Ship To Address either pickerObject or sr object are empty';
                }
            }

            function goToDevicePicker(source, pickerObject, customUrl) {
                if (pickerObject && scope.sr) {
                    if(customUrl){
                        rootScope.deviceReturnPath = customUrl;
                    }else{
                        rootScope.deviceReturnPath = $location.url();
                    }
                    if (pickerObject.id) {
                        rootScope.selectionId = pickerObject.id;
                    }
                    rootScope.returnPickerObjectDevice = pickerObject;
                    rootScope.returnPickerSRObjectDevice = scope.sr;
                    $location.path(halObj.route + '/pick_device/' + source);
                } else{
                    throw 'Failed to route to pick a Device either pickerObject or sr object are empty';
                }
            }

            function redirectToList() {
                if(halObj && halObj.route){
                    $location.path(halObj.route + '/');
                }else{
                    $location.path('/');
                }
            }

            function setupSR(HalObject, fillFunc){
                if(HalObject){

                    if(HalObject.item === null){
                        HalObject.newMessage();
                    }

                    if(HalObject.isNewMessage){
                        scope.sr = HalObject.item;
                        if(fillFunc){
                            fillFunc(HalObject);
                        }
                        HalObject.addField('customerReferenceId', '');
                        HalObject.addField('costCenter', '');
                        HalObject.addField('notes', '');
                        scope.sr = HalObject.item;
                    }else{
                       scope.sr = HalObject.item;
                    }
                }else{
                    throw 'setupSR needs a HalObject Factory to perform this function';
                }
            }

            function getRequestor(ServiceRequest, Contacts) {
                Users.getLoggedInUserInfo().then(function() {
                    Users.item.links.contact().then(function() {
                        scope.device.requestedByContact = Users.item.contact.item;
                        ServiceRequest.addRelationship('requester', $rootScope.currentUser, 'contact');
                        scope.device.primaryContact = scope.device.requestedByContact;
                        ServiceRequest.addRelationship('primaryContact', scope.device.requestedByContact, 'self');
                        scope.requestedByContactFormatted =
                        FormatterService.formatContact(scope.device.requestedByContact);
                    });
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

            function resetAddressPicker(){
                rootScope.returnPickerObjectAddress = undefined;
                rootScope.returnPickerSRObjectAddress = undefined;
                rootScope.selectedAddress = undefined;
            }

            function resetAddressBillToPicker(){
                rootScope.returnPickerObjectAddressBillTo = undefined;
                rootScope.returnPickerSRObjectAddress = undefined;
                rootScope.selectedBillToAddress = undefined;
            }
            function resetAddressShipToPicker(){
                rootScope.returnPickerObjectAddressBillTo = undefined;
                rootScope.returnPickerSRObjectAddress = undefined;
                rootScope.selectedShipToAddress = undefined;
            }

            function resetContactPicker(){
                rootScope.returnPickerObject = undefined;
                rootScope.returnPickerSRObject = undefined;
                rootScope.selectedContact = undefined;
                rootScope.currentSelected = undefined;
            }

            function resetDevicePicker(){
                rootScope.returnPickerObjectDevice = undefined;
                rootScope.returnPickerSRObjectDevice = undefined;
                rootScope.selectedDevice = undefined;
            }

            function setStatusBar(currentStatus, statusDate, statusBarLevels){
                var statusBarList = [];
                var statusItem = {};

                var formattedStatusDate = FormatterService.formatDate(statusDate);

                statusItem["'label'"] = '';
                statusItem["'date'"] = '';
                statusItem["'current'"] = false;

                for(var i=0; i<statusBarLevels.length; i++){
                    var statusItemClone = angular.copy(statusItem);
                    if(currentStatus === statusBarLevels[i].value){
                        statusItemClone.date = formattedStatusDate;
                        statusItemClone.current = true;
                    }
                    statusItemClone.label = statusBarLevels[i].name;
                    statusBarList.push(statusItemClone);
                }
                console.log(statusBarList);
                return statusBarList;
            }

            function setupPhysicalLocations(address, building, floor, office) {
                address.building = building;
                address.floor = floor;
                address.office = office;
            }

            function addMethods(halObject, $scope, $rootScope){
                halObj = halObject;
                scope = $scope;
                rootScope = $rootScope;

                if(scope){
                    scope.goToContactPicker = goToContactPicker;
                    scope.goToAddressPicker = goToAddressPicker;
                    scope.goToDevicePicker = goToDevicePicker;
                    scope.redirectToList = redirectToList;
                    scope.getRequestor = getRequestor;
                    scope.formatReceiptData = formatReceiptData;
                    scope.setupTemplates = setupTemplates;
                    scope.setupSR = setupSR;
                    scope.setupPhysicalLocations = setupPhysicalLocations;
                    scope.resetAddressPicker = resetAddressPicker;
                    scope.resetContactPicker = resetContactPicker;
                    scope.resetDevicePicker = resetDevicePicker;
                    scope.resetAddressBillToPicker = resetAddressBillToPicker;
                    scope.resetAddressShipToPicker = resetAddressShipToPicker;
                    scope.goToAddressBillToPicker = goToAddressBillToPicker;
                    scope.goToAddressShipToPicker = goToAddressShipToPicker;
                    scope.setStatusBar = setStatusBar;
                    scope.setTransactionAccount = setTransactionAccount;
                    scope.inTransactionalAccountContext = inTransactionalAccountContext;
                }else{
                    throw 'scope was not passed in to addMethods';
                }
            }

        return  {
            addMethods: addMethods
        };
    }]);
});

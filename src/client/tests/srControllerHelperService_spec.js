define(['angular','angular-mocks', 'serviceRequest','serviceRequest.controllerHelperService', 'hateoasFactory'],
    function(angular, mocks, serviceRequest, SRControllerHelperService) {
    describe('Service Request Module', function() {
        beforeEach(module('mps'));
        describe('SRControllerHelperService', function() {
            var scope,
            rootScope,
            service,
            ServiceRequestMock,
            location;

            beforeEach(inject(function($rootScope, $location, SRControllerHelperService, HATEOASFactory) {
                scope = $rootScope.$new();
                rootScope = $rootScope.$new();
                location = $location;
                service = SRControllerHelperService;
                 var hateoasConfig = {
                        serviceName: 'ServiceRequests',
                        embeddedName: 'ServiceRequest',
                        params: {page: 0, size: 20, sort: null},
                        columns: [
                            {
                                'name': 'fullname',
                                'field': '',
                                'cellTemplate':
                                    '<div>' +
                                        '<a href="" ng-click="grid.appScope.goToUpdate(row.entity)" ' +
                                        'ng-bind="row.entity.lastName + \', \' +  row.entity.firstName"></a>' +
                                    '</div>'
                            },
                            {'name': 'address', 'field': 'address'},
                            {'name': 'work phone', 'field': 'workPhone'},
                            {'name': 'alternate phone', 'field': 'alternatePhone'},
                            {'name': 'email', 'field': 'email'}
                        ],
                        route: ''
                    };

                    ServiceRequestMock = new HATEOASFactory(hateoasConfig);

            }));
            describe('redirectToList', function(){
                it('should go to the hal Objects root list', function(){
                    var halObj = {
                        route: '/dark'
                    };
                    spyOn(location, 'path').and.returnValue('/dark/');
                    service.addMethods(halObj, scope, rootScope);
                    scope.redirectToList();
                    expect(location.path).toHaveBeenCalledWith('/dark/');
                });
                it('halObj null and should go to the root ', function(){
                    spyOn(location, 'path').and.returnValue('/');
                    service.addMethods(null, scope, rootScope);
                    scope.redirectToList();
                    expect(location.path).toHaveBeenCalledWith('/');
                });
                it('halObject Route missing should go to the root', function(){
                    var halObj = {
                    };
                    spyOn(location, 'path').and.returnValue('/');
                    service.addMethods(halObj, scope, rootScope);
                    scope.redirectToList();
                    expect(location.path).toHaveBeenCalledWith('/');
                });
            });
            describe('goToContactPicker', function(){
                it('should go to the hal contact pick list', function(){
                    var halObj = {
                        route: '/dark'
                    },
                    source = 'testPath',
                    currentSelected = 'deviceContact';
                    scope.device = {
                        cat:true
                    };
                    scope.sr = {
                        dog:false
                    };

                    spyOn(location, 'path').and.returnValue('/dark/pick_contact');
                    service.addMethods(halObj, scope, rootScope);
                    scope.goToContactPicker(source, currentSelected, scope.device);
                    expect(location.path).toHaveBeenCalledWith('/dark/pick_contact/testPath');
                    expect(rootScope.returnPickerObject).toBe(scope.device);
                    expect(rootScope.returnPickerSRObject).toBe(scope.sr);
                    expect(rootScope.currentSelected).toBe('deviceContact');
                });
                it('pickerObject is null, should produce an error', function(){
                    var halObj = {
                        route: '/dark'
                    },
                    source = 'testPath',
                    currentSelected = 'deviceContact';
                    scope.sr = {
                        dog:false
                    };
                    var actual = function(){
                        scope.goToContactPicker(source, currentSelected);
                    };
                    service.addMethods(halObj, scope, rootScope);
                    expect(actual)
                        .toThrow('Failed to route to pick a contact either pickerObject or sr object are empty');
                });
                it('sr object is null, should produce an error', function(){
                    var halObj = {
                        route: '/dark'
                    },
                    source = 'testPath',
                    currentSelected = 'deviceContact';
                    scope.device = {
                        cat:true
                    };
                    scope.sr = null;
                    var actual = function(){
                        scope.goToContactPicker(source, currentSelected, scope.device);
                    };
                    service.addMethods(halObj, scope, rootScope);
                    expect(actual)
                        .toThrow('Failed to route to pick a contact either pickerObject or sr object are empty');
                });
            });
            describe('goToAddressPicker', function(){
                it('should go to the hal address pick list', function(){
                    var halObj = {
                        route: '/dark'
                    },
                    source = 'testPath';
                    scope.device = {
                        cat:true
                    };
                    scope.sr = {
                        dog:false
                    };

                    spyOn(location, 'path').and.returnValue('/dark/pick_address');
                    service.addMethods(halObj, scope, rootScope);
                    scope.goToAddressPicker(source, scope.device);
                    expect(location.path).toHaveBeenCalledWith('/dark/pick_address/testPath');
                    expect(rootScope.returnPickerObjectAddress).toBe(scope.device);
                    expect(rootScope.returnPickerSRObjectAddress).toBe(scope.sr);
                });
                it('pickerObject is null, should produce an error', function(){
                    var halObj = {
                        route: '/dark'
                    },
                    source = 'testPath';
                    scope.sr = {
                        dog:false
                    };
                    var actual = function(){
                        scope.goToAddressPicker(source);
                    };
                    service.addMethods(halObj, scope, rootScope);
                    expect(actual)
                        .toThrow('Failed to route to pick an Address either pickerObject or sr object are empty');
                });
                it('sr object is null, should produce an error', function(){
                    var halObj = {
                        route: '/dark'
                    },
                    source = 'testPath';
                    scope.device = {
                        cat:true
                    };
                    scope.sr = null;
                    var actual = function(){
                        scope.goToAddressPicker(source, scope.device);
                    };
                    service.addMethods(halObj, scope, rootScope);
                    expect(actual)
                        .toThrow('Failed to route to pick an Address either pickerObject or sr object are empty');
                });
            });
            describe('goToDevicePicker', function(){
                it('should go to the hal device pick list', function(){
                    var halObj = {
                        route: '/dark'
                    },
                    source = 'testPath';
                    scope.device = {
                        cat:true
                    };
                    scope.sr = {
                        dog:false
                    };

                    spyOn(location, 'path').and.returnValue('/dark/pick_device');
                    service.addMethods(halObj, scope, rootScope);
                    scope.goToDevicePicker(source, scope.device);
                    expect(location.path).toHaveBeenCalledWith('/dark/pick_device/testPath');
                    expect(rootScope.returnPickerObjectDevice).toBe(scope.device);
                    expect(rootScope.returnPickerSRObjectDevice).toBe(scope.sr);
                });
                it('pickerObject is null, should produce an error', function(){
                    var halObj = {
                        route: '/dark'
                    },
                    source = 'testPath';
                    scope.sr = {
                        dog:false
                    };
                    var actual = function(){
                        scope.goToDevicePicker(source);
                    };
                    service.addMethods(halObj, scope, rootScope);
                    expect(actual)
                        .toThrow('Failed to route to pick a Device either pickerObject or sr object are empty');
                });
                it('sr object is null, should produce an error', function(){
                    var halObj = {
                        route: '/dark'
                    },
                    source = 'testPath';
                    scope.device = {
                        cat:true
                    };
                    scope.sr = null;
                    var actual = function(){
                        scope.goToDevicePicker(source, scope.device);
                    };
                    service.addMethods(halObj, scope, rootScope);
                    expect(actual)
                        .toThrow('Failed to route to pick a Device either pickerObject or sr object are empty');
                });
            });
            describe('setupSR', function(){
                it('should setup an basic sr message', function(){
                    var halObj = {
                        route: '/dark'
                    };

                    var itemFunc = function(sr){
                    };
                    service.addMethods(halObj, scope, rootScope);
                    scope.setupSR(ServiceRequestMock, itemFunc);
                    expect(scope.sr).toBeDefined();
                });
                it('should setup an basic sr message with filled in attributes', function(){
                    var halObj = {
                        route: '/dark'
                    };

                    var itemFunc = function(sr){
                        sr.addField('cat', '123');
                    };
                    service.addMethods(halObj, scope, rootScope);
                    scope.setupSR(ServiceRequestMock, itemFunc);
                    expect(scope.sr).toBeDefined();
                    expect(scope.sr.cat).toBe('123');
                });
                it('should reload sr stored in Service to scope', function(){
                    var halObj = {
                        route: '/dark'
                    };
                    ServiceRequestMock.item = {
                        'dog':'4 legs'
                    };
                    var itemFunc = function(sr){
                        sr.addField('cat', '123');
                    };
                    service.addMethods(halObj, scope, rootScope);
                    scope.setupSR(ServiceRequestMock, itemFunc);
                    expect(scope.sr).toBeDefined();
                    expect(scope.sr.cat).toBeUndefined();
                    expect(scope.sr.dog).toBe('4 legs');
                });
                 it('should throw exception ServiceRequestObject is required', function(){
                    var halObj = {
                        route: '/dark'
                    };
                    var itemFunc = function(sr){
                        sr.addField('cat', '123');
                    };
                    service.addMethods(halObj, scope, rootScope);
                    var actual = function(){
                       scope.setupSR(null, itemFunc);
                    };
                    expect(actual)
                        .toThrow('setupSR needs a ServiceRequest Factory to perform this function');
                });
                it('should perform correctly if itemFunc is null', function(){
                    var halObj = {
                        route: '/dark'
                    };
                    ServiceRequestMock.item = {
                        'dog':'4 legs'
                    };
                    var itemFunc = function(sr){
                        sr.addField('cat', '123');
                    };
                    service.addMethods(halObj, scope, rootScope);
                    scope.setupSR(ServiceRequestMock);
                    expect(scope.sr).toBeDefined();
                    expect(scope.sr.cat).toBeUndefined();
                    expect(scope.sr.dog).toBe('4 legs');
                });
            });
            describe('addMethods', function(){
                it('should setup all functions', function(){
                    var halObj = {
                        route: '/dark'
                    };
                    service.addMethods(halObj, scope, rootScope);
                    expect(scope.goToContactPicker).toBeDefined();
                    expect(scope.redirectToList).toBeDefined();
                    expect(scope.getRequestor).toBeDefined();
                    expect(scope.formatReceiptData).toBeDefined();
                    expect(scope.setupTemplates).toBeDefined();
                    expect(scope.setupSR).toBeDefined();
                    expect(scope.setupPhysicalLocations).toBeDefined();
                    expect(scope.resetAddressPicker).toBeDefined();
                    expect(scope.resetContactPicker).toBeDefined();
                });
                it('should setup all functions', function(){
                    var halObj = {
                        route: '/dark'
                    };
                    var actual = function(){
                        service.addMethods(halObj, undefined, rootScope);
                    };
                    expect(actual)
                        .toThrow('scope was not passed in to addMethods');
                });
            });
            describe('setupTemplates', function(){
                it('should setup primary template only', function(){
                    var main = function(){
                        scope.main = true;
                        scope.receipt = false;
                        scope.review = false;
                    };
                    var receipt = function(){
                        scope.receipt = true;
                    };
                    var review = function(){
                        scope.review = true;
                    };
                    spyOn(location, 'path').and.returnValue('/cat/');
                     service.addMethods(null, scope, rootScope);
                     scope.setupTemplates(main,receipt,review);
                     expect(scope.main).toBe(true);
                     expect(scope.receipt).toBe(false);
                     expect(scope.review).toBe(false);

                });
                it('should setup primary template and receipt', function(){
                    var main = function(){
                        scope.main = true;
                        scope.receipt = false;
                        scope.review = false;
                    };
                    var receipt = function(){
                        scope.receipt = true;
                    };
                    var review = function(){
                        scope.review = true;
                    };
                    spyOn(location, 'path').and.returnValue('/dog/cat/receipt/');
                    service.addMethods(null, scope, rootScope);
                     scope.setupTemplates(main,receipt,review);
                     expect(scope.main).toBe(true);
                     expect(scope.receipt).toBe(true);
                     expect(scope.review).toBe(false);
                });
                it('should setup primary template and review', function(){
                    var main = function(){
                        scope.main = true;
                        scope.receipt = false;
                        scope.review = false;
                    };
                    var receipt = function(){
                        scope.receipt = true;
                    };
                    var review = function(){
                        scope.review = true;
                    };
                    spyOn(location, 'path').and.returnValue('/dog/cat/review/blag/');
                    service.addMethods(null, scope, rootScope);
                     scope.setupTemplates(main,receipt,review);
                     expect(scope.main).toBe(true);
                     expect(scope.receipt).toBe(false);
                     expect(scope.review).toBe(true);
                });
                it('should throw error for main template function not passed in', function(){
                    var main = function(){
                        scope.main = true;
                        scope.receipt = false;
                        scope.review = false;
                    };
                    var receipt = function(){
                        scope.receipt = true;
                    };
                    var review = function(){
                        scope.review = true;
                    };
                    spyOn(location, 'path').and.returnValue('/cat/');
                    service.addMethods(null, scope, rootScope);
                    var actual = function(){
                        scope.setupTemplates(null,receipt,review);
                    };
                    expect(actual)
                        .toThrow('mainTemplate function was not passed into setupTemplates');
                });
                it('should throw error for receipt template function not passed in', function(){
                    var main = function(){
                        scope.main = true;
                        scope.receipt = false;
                        scope.review = false;
                    };
                    var receipt = function(){
                        scope.receipt = true;
                    };
                    var review = function(){
                        scope.review = true;
                    };
                    spyOn(location, 'path').and.returnValue('/cat/receipt');
                    service.addMethods(null, scope, rootScope);
                    var actual = function(){
                        scope.setupTemplates(main,undefined,review);
                    };
                    expect(actual)
                        .toThrow('recieptTemplate function was not passed into setupTemplates');
                });
                 it('should throw error for review template function not passed in', function(){
                    var main = function(){
                        scope.main = true;
                        scope.receipt = false;
                        scope.review = false;
                    };
                    var receipt = function(){
                        scope.receipt = true;
                    };
                    var review = function(){
                        scope.review = true;
                    };
                    spyOn(location, 'path').and.returnValue('/cat/review');
                    service.addMethods(null, scope, rootScope);
                    var actual = function(){
                        scope.setupTemplates(main,receipt,null);
                    };
                    expect(actual)
                        .toThrow('reviewTemplate function was not passed into setupTemplates');
                });

            });
            describe('formatReceiptData', function(){
                it('should setup all functions', function(){
                    var halObj = {
                        route: '/dark'
                    };
                    scope.sr = {};
                    service.addMethods(halObj, scope, rootScope);
                    scope.formatReceiptData();
                    expect(scope.formattedNotes).toBe('LABEL.NONE');
                    expect(scope.formattedReferenceId).toBe('LABEL.NONE');
                    expect(scope.formattedCostCenter).toBe('LABEL.NONE');
                    expect(scope.formattedAttachments).toBe('LABEL.NONE');
                });
                it('should setup all functions', function(){
                    var halObj = {
                        route: '/dark'
                    };
                    var test = function(){
                        scope.cat = 'sam';
                    };
                    scope.sr = {};
                    service.addMethods(halObj, scope, rootScope);
                    scope.formatReceiptData(test);
                    expect(scope.formattedNotes).toBe('LABEL.NONE');
                    expect(scope.formattedReferenceId).toBe('LABEL.NONE');
                    expect(scope.formattedCostCenter).toBe('LABEL.NONE');
                    expect(scope.formattedAttachments).toBe('LABEL.NONE');
                    expect(scope.cat).toBe('sam');
                });
            });
            describe('resetAddressPicker', function(){
                it('should reset all the rootscope objects created for Address picker', function(){
                    rootScope.returnPickerObjectAddress = {
                        id: '123'
                    };
                    rootScope.returnPickerSRObjectAddress = {
                        requestNumber: '123456'
                    };
                    rootScope.selectedAddress = {
                        addressLine1: '740 W New Circle Rd'
                    };
                    var halObj = {
                        route: '/dark'
                    };
                    service.addMethods(halObj, scope, rootScope);
                    scope.resetAddressPicker();
                    expect(rootScope.returnPickerObjectAddress).toBe(undefined);
                    expect(rootScope.returnPickerSRObjectAddress).toBe(undefined);
                    expect(rootScope.selectedAddress).toBe(undefined);
                });
            });
            describe('resetContactPicker', function(){
                it('should reset all the rootscope objects created for Contact picker', function(){
                    rootScope.returnPickerObject = {
                        id: '123'
                    };
                    rootScope.returnPickerSRObject = {
                        requestNumber: '123456'
                    };
                    rootScope.selectedContact = {
                        firstName: 'test'
                    };
                    rootScope.currentSelected = 'testContact';
                    var halObj = {
                        route: '/dark'
                    };
                    service.addMethods(halObj, scope, rootScope);
                    scope.resetContactPicker();
                    expect(rootScope.returnPickerObject).toBe(undefined);
                    expect(rootScope.returnPickerSRObject).toBe(undefined);
                    expect(rootScope.selectedContact).toBe(undefined);
                    expect(rootScope.currentSelected).toBe(undefined);
                });
            });
            describe('setupPhysicalLocations', function(){
                it('should add building, floor, office to addresses', function(){
                    var address = {
                        id: '123',
                        addressLine1: '740 W N Circle Rd'
                    };
                    var building = 'building1';
                    var floor = 'floor';
                    var office = 'office';
                    var halObj = {
                        route: '/dark'
                    };
                    service.addMethods(halObj, scope, rootScope);
                    scope.setupPhysicalLocations(address,building,floor,office);
                    expect(address.building).toBe('building1');
                    expect(address.floor).toBe('floor');
                    expect(address.office).toBe('office');
                });
            });
        });
    });
});

define(['angular','angular-mocks', 'fixtures', 'deviceServiceRequest', 'hateoasFactory'], function(angular, mocks, fixtures, deviceServiceRequest) {
    describe('Device Service Request Module', function() {
        beforeEach(module('mps'));

        describe('DeviceAddController', function() {
            var scope, ctrl, location;

            beforeEach(inject(function($rootScope, $controller, $location) {
                scope = $rootScope.$new();
                rootScope = $rootScope;
                location = $location;
                ctrl = $controller('DeviceAddController', {$scope: scope});
            }));

            describe('goToBrowse', function() {
                it('should take to device picker page', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    var device = [{id: 1}];
                    scope.goToBrowse(device);
                    expect(location.path).toHaveBeenCalledWith('/device_management/pick_device');
                });
            });

            describe('goToContactPicker', function() {
                it('should take to contact picker page', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    var device = [{id: 1}];
                    scope.goToContactPicker(device);
                    expect(location.path).toHaveBeenCalledWith('/service_requests/devices/pick_contact');
                });
            });

            describe('isDeviceSelected', function() {
                beforeEach(inject(function($routeParams, $controller){
                    $routeParams.return = 'return';
                    ctrl = $controller('DeviceAddController', {$scope: scope});
                }));
                it('should decide whether device selected or not', function() {
                    rootScope.currentRowList = [{ entity: {
                            id: 1
                        }
                    }];
                    var checkOutput = scope.isDeviceSelected();
                    expect(checkOutput).toBe(true);
                });
            });

            describe('goToReview', function() {
                it('should decide review page should be displayed', function() {
                    scope.isReview = false;
                    scope.goToReview();
                    expect(scope.isReview).toBe(true);
                });
            });

            describe('goToAdd', function() {
                it('should decide add page should be displayed', function() {
                    scope.isReview = true;
                    scope.goToAdd();
                    expect(scope.isReview).toBe(false);
                });
            });

            describe('goToSubmit', function() {
                it('should decide submit page should be displayed', function() {
                    scope.isSubmitted = false;
                    scope.goToSubmit();
                    expect(scope.isSubmitted).toBe(true);
                });
            });

            describe('goToCreate', function() {
                it('should navigate to add a new device page', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    scope.goToCreate();
                    expect(location.path).toHaveBeenCalledWith('/service_requests/devices/new');
                });
            });
        });


        describe('DeviceSearchController', function() {
            var scope, ctrl, location;

            beforeEach(inject(function($rootScope, $controller, $location) {
                scope = $rootScope.$new();
                rootScope = $rootScope;
                location = $location;
                ctrl = $controller('DeviceSearchController', {$scope: scope});
            }));


            describe('goToSubmit', function() {
                it('should handle the submit request', function() {

                });
            });

            describe('queryBySerial', function() {
                it('should perform a query based on serial', function() {
                    var serial = 'DEVICE_SERIAL';
                    spyOn(scope, 'queryBySerial');
                    scope.serial = serial;
                    scope.queryBySerial(scope.serial);
                    expect(scope.queryBySerial).toHaveBeenCalledWith(serial);
                });
            });
        });

        describe('DeviceDecommissionController', function() {
            var scope, ctrl, location;

            beforeEach(inject(function($rootScope, $controller, $location) {
                scope = $rootScope.$new();
                rootScope = $rootScope;
                location = $location;
                ctrl = $controller('DeviceDecommissionController', {$scope: scope});
            }));
            //Commenting until implementation
            /*describe('goToReview', function() {
                it('should handle the review request', function() {

                });
            });

            describe('goToSubmit', function() {
                it('should handle the submit request', function() {

                });
            });*/
        });

        describe('DeviceUpdateController', function() {
            var scope, ctrl, location, form, deferred, blankCheck, mockedFactory, $httpBackend,
            MockDeviceServiceRequest, mockContacts, mockSRControllerHelperService, compile;

            beforeEach(inject(function($rootScope, $controller, $location, $compile, $q, BlankCheck, HATEOASFactory, $httpBackend,
                Devices, DeviceServiceRequest, Contacts, SRControllerHelperService) {
                scope = $rootScope.$new();
                rootScope = $rootScope;
                location = $location;
                compile = $compile;
                deferred = $q.defer();
                blankCheck = BlankCheck;
                MockDeviceServiceRequest = DeviceServiceRequest;
                mockDevices = Devices;
                mockSRControllerHelperService = SRControllerHelperService;

                mockDevices.url = 'http://127.0.0.1/test';
                mockDevices.setItem(fixtures.devices.regular);

                httpBackend = $httpBackend;
                MockDeviceServiceRequest.route = 'http://127.0.0.1/request';

                mockContacts = Contacts;
                mockContacts.serviceName = 'contact';

                $rootScope.currentUser = fixtures.users.regular;
                $rootScope.currentUser.deferred = $q.defer();

                scope.device = mockDevices.item;

                element = angular.element(
                    '<form name="updateDevice">' +
                    '   <input name="myFirst" ng-model="myFirst"></input>' +
                    '   <input name="mySecond" ng-model="mySecond"></input>' +
                    '</form>'
                );
                element = compile(element)(scope);

                ctrl = $controller('DeviceUpdateController', {$scope: scope, $rootScope: rootScope, Devices:mockDevices,
                    DeviceServiceRequest:MockDeviceServiceRequest, Contacts:mockContacts, 
                    SRControllerHelperService:mockSRControllerHelperService});
            }));

            describe('goToReview', function() {
                it('should take the user to the review page based on device id', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    
                    scope.device.id='1234';
                    scope.goToReview();
                    
                    expect(location.path).toHaveBeenCalledWith('http://127.0.0.1/request/update/1234/review');
                });
            });

            describe('revertAddress', function(){
                it('should reset the address values to an existing address', function(){
                    scope.device.addressSelected = true;
                    scope.device.currentInstalledAddress = {
                        addressLine1: '740 W New Circle Rd'
                    }
                    scope.revertAddress();
                    expect(scope.device.addressSelected).toBe(false);
                    expect(scope.device.updatedInstallAddress).toEqual(scope.device.currentInstalledAddress);
                });
            });

            describe('getChangedValues', function() {
                it('should return all the values changed in a form', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    var currentSelected = 'updateDeviceContact',
                    expectedArr = ['myFirst'];
                    scope.updateDevice.myFirst.$pristine = false;
                    var updateArr = scope.getChangedValues();
                    expect(updateArr).toEqual(expectedArr);
                });
            });
        });

        describe('Routes', function(){
            it('should map routes to controllers', function() {
                inject(function($route) {
                    expect($route.routes['/service_requests/devices/new'].controller).toBe('DeviceAddController');
                    expect($route.routes['/service_requests/devices/new'].templateUrl).toEqual('/app/device_service_requests/templates/new.html');
                    expect($route.routes['/service_requests/devices/search'].controller).toBe('DeviceSearchController');
                    expect($route.routes['/service_requests/devices/search'].templateUrl).toEqual('/app/device_service_requests/templates/search.html');
                });
            });
        });
    });
});

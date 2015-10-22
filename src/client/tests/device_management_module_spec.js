/* global describe it beforeEach inject expect */
define(['angular','angular-mocks', 'deviceManagement'], function(angular, mocks, deviceManagement) {
    describe('Device Management Module', function() {
        beforeEach(module('mps'));


        describe('DeviceListController', function(){

            var scope,
            httpBackend,
            mockDeviceListCtrl,
            location,
            deferred,
            mockDeviceFactory;

            beforeEach(inject(function($rootScope, $httpBackend, $controller, $location, Devices, $q) {
                scope = $rootScope.$new();
                deferred= $q.defer();
                httpBackend = $httpBackend;
                location = $location;

                mockDeviceFactory = Devices;

                mockDeviceFactory.get = function(device) {
                    return deferred.promise;
                };

                mockDeviceFactory.save = function(device) {
                    device.id = 'assigned';
                    return deferred.promise;
                };

                mockDeviceFactory.update = function(device) {
                    return deferred.promise;
                };

                mockDeviceFactory.item = {id:'123', _links: {self: {href: '/assets/123'}}};
                mockDeviceFactory.route = '/device_management';

                mockDeviceListCtrl = $controller('DeviceListController', {$scope: scope, Devices: mockDeviceFactory});

                httpBackend.when('GET', 'etc/resources/i18n/en.json').respond({it: 'works'});
                httpBackend.when('GET', '/').respond({it: 'works'});
            }));

            it('should go to a full device view', function(){
                    spyOn(scope, 'view').and.callThrough();
                    spyOn(location, 'path').and.returnValue('/');

                    scope.device = mockDeviceFactory.item;

                    deferred.resolve();
                    scope.view(scope.device);

                    scope.$digest();
                    expect(location.path).toHaveBeenCalledWith(mockDeviceFactory.route + '/123/review');
            });

        });

        describe('DeviceController', function() {
            var scope, ctrl, location, mockedFactory;

            beforeEach(function (){
                mockedFactory = {
                    resource: jasmine.createSpy(),
                    devices: jasmine.createSpy()
                };

                module(function($provide) {
                    $provide.value('Devices', mockedFactory);
                });
            });

            beforeEach(inject(function($rootScope, $controller, $location, BlankCheck) {
                scope = $rootScope.$new();
                location = $location;
                blankCheck = BlankCheck;
                ctrl = $controller('DeviceController', {$scope: scope});
            }));

            describe('goToReview', function() {
                it('should navigate to device review page', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    var device = {id: '12345'};
                    scope.goToReview(device);
                    expect(location.path).toHaveBeenCalledWith('/device_management/12345/review');
                });
            });
        });

        describe('DeviceInformationController', function() {
            var scope, ctrl, location, blankCheck, mockedFactory;

            beforeEach(function (){
                mockedFactory = {
                    get: jasmine.createSpy(),
                    devices: jasmine.createSpy()
                };

                module(function($provide) {
                    $provide.value('Devices', mockedFactory);
                });
            });

            beforeEach(inject(function($rootScope, $controller, $location, BlankCheck) {
                scope = $rootScope.$new();
                location = $location;
                blankCheck = BlankCheck;
                ctrl = $controller('DeviceInformationController', {$scope: scope});
            }));


            describe('formatAddress', function() {
                it('should be empty if install Address is null', function() {
                    scope.formattedAddress = '';
                    scope.installAddress = null;
                    scope.formatAddress();
                    expect(scope.formattedAddress).toBe('');
                });
            });

            describe('btnRequestService', function() {
                it('should direct user to device service request review page', function() {
                    spyOn(location, 'path');
                    var device = [{id: '1-ACCT-ID'}];
                    scope.btnRequestService(device);
                    expect(location.path).toHaveBeenCalledWith('/service_requests/devices/'+device.id +'/review');
                });
            });
        });

        describe('DevicePageCountsController', function() {
            var scope, ctrl, location;

            beforeEach(inject(function($rootScope, $controller, $location) {
                scope = $rootScope.$new();
                location = $location;
                ctrl = $controller('DevicePageCountsController', {$scope: scope});
            }));

            describe('toggleDisplay', function() {
                it('should toggle the value of showLess', function() {
                    scope.showLess = false;
                    scope.toggleDisplay();
                    expect(scope.showLess).toBe(true);
                });
            });

            describe('filterByIds', function() {
                it('should check whether an id for a Page Count belong to a list', function() {
                    var selectedType = {'id': 'lifetime-1'};
                    var checkOutput = scope.filterByIds(selectedType);
                    expect(checkOutput).toBe(true);
                });
            });

            describe('selectPageCount', function() {
                it('should return an object from an array based on id', function() {
                    var pageCountArr = [{'id':'123','count':'789'},{'id':'456','count':'444'}];
                    var id = '123';
                    var checkOutput = scope.selectPageCount(id,pageCountArr);
                    expect(checkOutput.count).toBe('789');
                });
            });

        });

        describe('Routes', function(){
            it('should map routes to controllers', function() {
                inject(function($route) {
                    expect($route.routes['/device_management'].controller).toBe('DeviceListController');
                    expect($route.routes['/device_management'].templateUrl)
                                .toEqual('/app/device_management/templates/view.html');
                });
            });
        });
    });
});

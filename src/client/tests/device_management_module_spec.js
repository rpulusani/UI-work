/* global describe it beforeEach inject expect */
define(['angular','angular-mocks', 'deviceManagement'], function(angular, mocks, deviceManagement) {
    describe('Device Management Module', function() {
        beforeEach(module('mps'));    

        describe('DeviceManagementController', function() {
            var scope, ctrl, location, blankCheck, mockedFactory;
            beforeEach(function (){
                mockedFactory = {
                    query: jasmine.createSpy(),
                    get: jasmine.createSpy(),
                    devices: jasmine.createSpy()
                };

                module(function($provide) {
                    $provide.value('Device', mockedFactory);
                });
            });
            beforeEach(inject(function($rootScope, $controller, $location, BlankCheck) {
                scope = $rootScope.$new();
                location = $location;
                blankCheck = BlankCheck;
                ctrl = $controller('DeviceManagementController', {$scope: scope});
            }));

            describe('at init', function() {
                describe('when routeParam.id is available', function() {
                    beforeEach(inject(function($routeParams, $controller){
                        $routeParams.id = 'device-1';
                        ctrl = $controller('DeviceManagementController', {$scope: scope});
                    }));
                    it('should get device', function() {
                        expect(mockedFactory.get.calls.count()).toBe(1);
                    });
                });

                describe('when routeParam.id not available', function() {
                    it('should not get device', function() {
                        expect(mockedFactory.get.calls.count()).toBe(0);
                    });
                });
            });

            describe('formatAddress', function() {
                it('should call BlankCheck', function() {
                    scope.formatAddress();
                    expect(blankCheck.path).toBeCalled;
                });
            });              

            describe('Routes', function(){
                it('should map routes to controllers', function() {
                    inject(function($route) {
                        expect($route.routes['/device_management'].controller).toBe('DeviceManagementController');
                        expect($route.routes['/device_management'].templateUrl)
                                    .toEqual('/app/device_management/templates/device-management-home.html');
                    });
                });             
            });
        });
    });
});

/* global describe it beforeEach inject expect */
define(['angular','angular-mocks', 'deviceManagement'], function(angular, mocks, deviceManagement) {
    describe('Device Management Module', function() {
        beforeEach(module('mps'));    

        describe('DeviceManagementController', function() {
            var scope, ctrl, location, history, mockedFactory;
            beforeEach(function (){
                mockedFactory = {
                    query: jasmine.createSpy(),
                    getById: jasmine.createSpy()
                };

                module(function($provide) {
                    $provide.value('Device', mockedFactory);
                });
            });
            beforeEach(inject(function($rootScope, $controller, $location, History) {
                scope = $rootScope.$new();
                location = $location;
                history = History;
                ctrl = $controller('DeviceManagementController', {$scope: scope});
            }));

            describe('at init', function() {
                describe('when routeParam.id is available', function() {
                    beforeEach(inject(function($routeParams, $controller){
                        $routeParams.id = 'device-1';
                        ctrl = $controller('DeviceManagementController', {$scope: scope});
                    }));
                    it('should get device', function() {
                        expect(mockedFactory.getById.calls.count()).toBe(1);
                    });
                });

                describe('when routeParam.id not available', function() {
                    it('should not get device', function() {
                        expect(mockedFactory.getById.calls.count()).toBe(0);
                    });
                });
            });

            describe('goToRead', function() {
                it('should take to the device view page based on device ID', function() {
                    var deviceId = 'device-1';
                    spyOn(location, 'path').and.returnValue('/');
                    scope.goToRead(deviceId);
                    expect(location.path).toHaveBeenCalledWith('/device_management/device-1/review');
                });
            });            

            describe('Routes', function(){
                it('should map routes to controllers', function() {
                    inject(function($route) {
                        expect($route.routes['/device_management'].controller).toBe('DeviceManagementController');
                        expect($route.routes['/DeviceManagementController'].templateUrl)
                                    .toEqual('/app/device_management/templates/device-management-home.html');
                    });
                });             
            });
    });
});

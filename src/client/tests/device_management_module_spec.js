/* global describe it beforeEach inject expect */
define(['angular','angular-mocks', 'deviceManagement'], function(angular, mocks, deviceManagement) {
    describe('Device Management Module', function() {
        beforeEach(module('mps'));    

        describe('DeviceManagementController', function() {
            var scope, ctrl, location, history, mockedFactory;
            beforeEach(function (){
                mockedFactory = {
                    query: jasmine.createSpy(),
                    getById: jasmine.createSpy(),
                    devices: jasmine.createSpy()
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

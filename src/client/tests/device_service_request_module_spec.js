define(['angular','angular-mocks', 'deviceServiceRequest'], function(angular, mocks, deviceServiceRequest) {
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
                it('should decide whether device selected or not', function() {
                    rootScope.currentRowList = [{ entity: {
                            id: 1
                        }
                    }];
                    var checkOutput = scope.isDeviceSelected();
                    expect(checkOutput).toBe(true);
                });
            });
        });
    
    describe('Routes', function(){
            it('should map routes to controllers', function() {
                inject(function($route) {
                    expect($route.routes['/service_requests/devices/new'].controller).toBe('DeviceAddController');
                    expect($route.routes['/service_requests/devices/new'].templateUrl).toEqual('/app/device_service_requests/templates/new.html');
                    expect($route.routes['/service_requests/devices/pick_contact'].controller).toBe('ContactPickerController');
                    expect($route.routes['/service_requests/devices/pick_contact'].templateUrl).toEqual('/app/device_service_requests/templates/contact-picker.html');
                });
            });
        });
    });
});

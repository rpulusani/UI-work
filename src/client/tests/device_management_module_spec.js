/* global describe it beforeEach inject expect */
define(['angular','angular-mocks', 'deviceManagement'], function(angular, mocks, deviceManagement) {
    describe('Device Management Module', function() {
        beforeEach(module('mps'));    

        describe('DeviceManagementController', function() {
            var scope, ctrl, location, mockedFactory;
            beforeEach(function (){
                mockedFactory = {
                    query: jasmine.createSpy(),
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
                it('should query for all devices', function() {
                    expect(mockedFactory.query.calls.count()).toBe(1);
                });
            });

            describe('goToRead', function() {
                it('should take to the Device related pages', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    var id = '12345';
                    scope.goToRead(id);
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
                    $provide.value('Device', mockedFactory);
                });
            });
            beforeEach(inject(function($rootScope, $controller, $location, BlankCheck) {
                scope = $rootScope.$new();
                location = $location;
                blankCheck = BlankCheck;
                ctrl = $controller('DeviceInformationController', {$scope: scope});
            }));

            describe('at init', function() {
                describe('when routeParam.id is available', function() {
                    beforeEach(inject(function($routeParams, $controller){
                        $routeParams.id = 'device-1';
                        ctrl = $controller('DeviceInformationController', {$scope: scope});
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
            
        });

        describe('DevicePageCountsController', function() {
            var scope, ctrl, location;
            
            beforeEach(inject(function($rootScope, $controller, $location) {
                scope = $rootScope.$new();
                location = $location;
                ctrl = $controller('DevicePageCountsController', {$scope: scope});
            })); 

            describe('viewLess', function() {
                it('should set showLess to be true', function() {
                    scope.viewLess();
                    expect(scope.showLess).toBe(true);
                });
            });

            describe('showMore', function() {
                it('should set showLess to be false', function() {
                    scope.showMore();
                    expect(scope.showLess).toBe(false);
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
                    expect($route.routes['/device_management'].controller).toBe('DeviceManagementController');
                    expect($route.routes['/device_management'].templateUrl)
                                .toEqual('/app/device_management/templates/device-management-home.html');
                });
            });             
        });
    });
});

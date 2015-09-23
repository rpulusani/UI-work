// Unit tests for Service Request Addresses module
define(['angular','angular-mocks', 'address'], function(angular, mocks, address) {
    describe('Address Service Request Module', function() {
        beforeEach(module('mps'));


        describe('AddressListController', function(){
            var scope, ctrl, location, history, mockedAddressesFactory;
            beforeEach(function (){
                mockedAddressesFactory = {
                    get: function(address, resolve) {
                        resolve(true);
                    },
                    query: jasmine.createSpy(),
                    getColumnDefinition: function(type){
                        return {'defaultSet':[] };
                    }
                };


                module(function($provide) {
                    $provide.value('Addresses', mockedAddressesFactory);
                });
            });

            beforeEach(inject(function($rootScope, $controller, $location, History) {
                scope = $rootScope.$new();
                location = $location;
                history = History;
                ctrl = $controller('AddressListController', {$scope: scope});
            }));

            describe('goToCreate', function() {
                it('should take to new page', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    scope.goToCreate();
                    expect(location.path).toHaveBeenCalledWith('/service_requests/addresses/new');
                });
            });

        });

        describe('AddressesController', function() {
            var scope, ctrl, location, history, mockedAddressesFactory;

            beforeEach(function (){
                mockedAddressesFactory = {
                    remove: function(address, resolve) {
                        resolve(true);
                    },
                    query: jasmine.createSpy()
                };

                module(function($provide) {
                    $provide.value('Addresses', mockedAddressesFactory);
                });
            });

            beforeEach(inject(function($rootScope, $controller, $location, History) {
                scope = $rootScope.$new();
                location = $location;
                history = History;
                ctrl = $controller('AddressesController', {$scope: scope});
            }));

            describe('goToUpdate', function() {
                it('should take to update page', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    scope.goToUpdate({id: 1});
                    expect(location.path).toHaveBeenCalledWith('/service_requests/addresses/1/update');
                });
            });

            describe('goToReview', function() {
                it('should take to review page', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    scope.goToReview({id: 1});
                    expect(location.path).toHaveBeenCalledWith('/service_requests/addresses/1/review');
                });
            });

            describe('setStoreFrontName', function() {
                it('should take to review page', function() {
                    scope.address = {name: 'Test Name', id: 1, accountId: '1-74XV2R'};

                    spyOn(scope, 'setStoreFrontName').and.callThrough();

                    scope.setStoreFrontName();

                    expect(scope.setStoreFrontName).toHaveBeenCalled();
                    expect(scope.address.storeFrontName).toEqual(scope.address.name);
                });
            });

            describe('removeAddress', function() {
                it('should remove an item in $scope.addresses', function() {
                    scope.address = {id: 1, accountId: '1-74XV2R'}; // Address to be removed

                    scope.addresses = [{id: 1, accoundId: '1-74XV2R'}, {id:  2, accountId: '1-74XV2R'}];

                    spyOn(mockedAddressesFactory, 'remove').and.callThrough();
                    scope.removeAddress(scope.addresses[0]);

                    expect(mockedAddressesFactory.remove.calls.count()).toBe(1);
                    expect(mockedAddressesFactory.remove).toHaveBeenCalled();
                    expect(scope.addresses[0]).toEqual({id:  2, accountId: '1-74XV2R'});
                    expect(scope.addresses.length).toEqual(1);
                });
            });
        });

        describe('Routes', function(){
            it('should map routes to controllers', function() {
                inject(function($route) {
                    expect($route.routes['/service_requests/addresses'].controller).toBe('AddressListController');
                    expect($route.routes['/service_requests/addresses'].templateUrl).toEqual('/app/address_service_requests/templates/view.html');
                    expect($route.routes['/service_requests/addresses/new'].templateUrl).toEqual('/app/address_service_requests/templates/new.html');
                });
            });
        });
    });
});

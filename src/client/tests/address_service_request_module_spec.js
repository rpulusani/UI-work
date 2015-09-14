// Unit tests for Service Request Addresses module
define(['angular','angular-mocks', 'address'], function(angular, mocks, address) {
    describe('Address Service Request Module', function() {
        beforeEach(module('mps'));

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
                    $provide.value('Addressses', mockedAddressesFactory);
                });
            });

            beforeEach(inject(function($rootScope, $controller, $location, History) {
                scope = $rootScope.$new();
                location = $location;
                history = History;
                ctrl = $controller('AddressesController', {$scope: scope});
            }));

            describe('back', function() {
                it('should call history back', function() {
                    scope.back();
                    expect(history.path).toBeCalled;
                });
            });

            describe('goToCreate', function() {
                it('should take to new page', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    scope.goToCreate();
                    expect(location.path).toHaveBeenCalledWith('/service_requests/addresses/new');
                });
            });

            describe('goToUpdate', function() {
                it('should take to update page', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    scope.goToUpdate(1);
                    expect(location.path).toHaveBeenCalledWith('/service_requests/addresses/1/update');
                });
            });

            describe('goToReview', function() {
                it('should take to review page', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    scope.goToReview(1);
                    expect(location.path).toHaveBeenCalledWith('/service_requests/addresses/1/review');
                });
            });

            describe('removeAddress', function() {
                it('should remove an item in $scope.addresses', function() {
                    var address = {id: 1, accountId: 1}; // Address to be removed
                    
                    scope.addresses = [{id: 1, accoundId: 1}, {id:  2, accountId: 1}];
                    spyOn(scope, 'removeAddress');
                    spyOn(mockedAddressesFactory, 'remove');
                    
                    scope.removeAddress(address);

                    expect(scope.removeAddress).toHaveBeenCalledWith(1); 
                    expect(mockedAddressesFactory.remove).toHaveBeenCalledWith(address);
                    expect(mockedAddressesFactory.remove.calls.argsFor(0)[0]).toEqual(address);
                    expect(scope.addresses.length).toEqual(1);
                });
            });
        });

        describe('Routes', function(){
            it('should map routes to controllers', function() {
                inject(function($route) {
                    expect($route.routes['/service_requests/addresses'].controller).toBe('AddressesController');
                    expect($route.routes['/service_requests/addresses'].templateUrl).toEqual('/app/address_service_requests/templates/view.html');
                    expect($route.routes['/service_requests/addresses/new'].templateUrl).toEqual('/app/address_service_requests/templates/new.html');
                });
            });
        });
    });
});

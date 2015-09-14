/* global describe it beforeEach inject expect */
define(['angular','angular-mocks', 'address'], function(angular, mocks, address) {
describe('Address Service Request Module', function() {
    beforeEach(module('mps'));
    describe('Controllers', function(){
        var scope, ctrl, location, addresses, window, history;
        beforeEach(inject(function($rootScope, $controller, $location, Addresses, History, $window) {
            scope = $rootScope.$new();
            location = $location;
            window = $window;
            history = History;
            ctrl = $controller('AddressesController', {$scope: scope});
            addresses = Addresses;
        }));

        /** Cover all business Logic **/

        describe('when Set Store Front Name is chosen', function(){
                it('should set the address name to the store front name', function(){
                    addresses.new();
                    scope.address = addresses.address;

                    expect(scope.address.storeName).toBe(undefined);
                    scope.address.addName = 'Cat';
                    scope.setStoreFrontName();
                    expect(scope.address.storeName).toBe('Cat');
                });
        });

        describe('when saved', function() {
            var httpBackend;
            beforeEach(inject(function (_$httpBackend_) {

                    httpBackend = _$httpBackend_;
                    $httpBackend.when('GET', '/service_requests/addresses/0/submitted').respond(200);

            }));

            it('should redirect to submitted page', function(){
                addresses.new();
                scope.address = addresses.address;
                expect(addresses.address).not.toBe(undefined);
                expect(addresses.address.addName).toBe(undefined);
                scope.address.addName = 'bad';
                $httpBackend.expectGET('/service_requests/addresses/0/submitted').respond(200);
                scope.save();
                expect(addresses.address.addName).toBe('bad');
            });

            it('should redirect to submitted page', function(){
                addresses.new();
                scope.address = addresses.address;
                expect(addresses.address).not.toBe(undefined);
                expect(addresses.address.addName).toBe(undefined);
                scope.address.addName = 'bad';
                $httpBackend.expectGET('/service_requests/addresses/0/submitted').respond(200);
                scope.save();
                expect(addresses.address.addName).toBe('bad');
            });


        });


        describe('when cancelled', function() {
            it('should return to home', function(){
                spyOn(location, 'path').and.returnValue('/');
                scope.cancel();
                expect(location.path).toHaveBeenCalledWith('/service_requests/addresses');
            });
        });

        describe('when continued', function() {
          it('should set continueForm to be true', function() {
              scope.continue();
              expect(scope.continueForm).toBe(true);
          });
        });

        describe('when toggled', function() {
            describe('with attachmentIsShown was originally true', function() {
                it('should set attachmentIsShown to be false', function() {
                    scope.attachmentIsShown = true;
                    scope.attachmentToggle();
                    expect(scope.attachmentIsShown).toBe(false);
                });
            });

            describe('with attachmentIsShown was originally false', function() {
                it('should set attachmentIsShown to be true', function() {
                    scope.attachmentIsShown = false;
                    scope.attachmentToggle();
                    expect(scope.attachmentIsShown).toBe(true);
                });
            });

        });


        describe('when a delete request is cancelled', function() {
            it('should return to the all addresses view', function() {
                spyOn(location, 'path').and.returnValue('/service_requests/addresses');
                scope.cancel();
                expect(location.path).toHaveBeenCalledWith('/service_requests/addresses');
            });
        });

        describe('when a new address needs to be created', function(){
            var scope, ctrl, location, addresses;
            beforeEach(inject(function($rootScope, $controller, $location, Addresses) {
                scope = $rootScope.$new();
                location = $location;
                ctrl = $controller('AddressesController', {$scope: scope});
                addresses = Addresses;
            }));

            it('should have an id of zero', function(){
                spyOn(location,'path').and.returnValue('/service_requests/addresses/new');
                scope.getAddress();
                expect(scope.address).toBeDefined();
                expect(scope.address.id).toBeDefined();
                expect(scope.address.id).toBe(0);
            });
        });
    });
    describe("Directives", function(){
        //only test logic examples nothing more
    });
    describe("Services", function(){
        //Test things like Required or other validations

    });

    describe("Routes", function(){

    });

         // Tests for testing directives
        describe('directive: new-form-fields.html', function() {
            var element, scope;

            beforeEach(module('mps'));

            beforeEach(inject(function($rootScope, $compile) {
                scope = $rootScope.$new();

                element = '<div address-new-fields></div>';
                element = $compile(element)(scope);

                scope.$digest();
            }));
        });
    });
});

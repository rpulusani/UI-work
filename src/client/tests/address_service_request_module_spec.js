/* global describe it beforeEach inject expect */

describe('Address Service Request Module', function() {
    beforeEach(module('mps'));
    describe('Controllers', function(){
        var scope, ctrl, location, addresses;
        beforeEach(inject(function($rootScope, $controller, $location, Addresses) {
            scope = $rootScope.$new();
            location = $location;
            ctrl = $controller('AddressesController', {$scope: scope});
            addresses = Addresses;
        }));

        it('is defined', function() {
            expect(ctrl).toBeDefined();
        });

        it('can get an instance of Addresses', function() {
            expect(addresses).toBeDefined();
        });

        it('has a contact', function() {
            expect(scope.contact).toBeDefined();
        });

        it('has a name in contact', function() {
            expect(scope.contact.name).toBeDefined();
        });

        it('has a phoneNumber in contact', function() {
            expect(scope.contact.phoneNumber).toBeDefined();
        });

        it('has a emailAddress in contact', function() {
            expect(scope.contact.emailAddress).toBeDefined();
        });

        it('has a list of addresses', function() {
            expect(scope.addresses).toBeDefined();
        });
/*
        it('has a selected address', function() {
            expect(scope.currentAddress).toBeDefined();
        });
*/
        describe('when test data is loaded', function(){
            beforeEach(function() { scope.loadTestData(); });

            it('has Vickers PetsAtHome as name in contact', function() {
                expect(scope.contact.name).toBe('Vickers PetsAtHome');
            });

            it('has 9992882222 as phoneNumber in contact', function() {
                expect(scope.contact.phoneNumber).toBe('9992882222');
            });

            it('has vickerspets@test.com as emailAddress in contact', function() {
                expect(scope.contact.emailAddress).toBe('vickerspets@test.com');
            });
        });
/*
        describe('when saved', function() {
            var httpBackend;
            beforeEach(function () {
                angular.mock.inject(function ($injector) {
                    httpBackend = $injector.get('$httpBackend');
                });
            });

            describe('when POST request failed', function() {
                it('should set add_success to be false', function() {
                    //TODO: this mock needs to be POST for real
                    httpBackend.expectGET('/test').respond(500);
                    scope.save(function() {
                      expect(scope.add_success).toBe(false);
                    });
                    expect(httpBackend.flush).not.toThrow();
                });
            });

            describe('when POST request success', function() {
                it('should set add_success to be true', function() {
                    //TODO: this mock needs to be POST for real
                    httpBackend.expectGET('/test').respond(200);
                    scope.save(function() {
                      expect(scope.add_success).toBe(false);
                    });
                    expect(httpBackend.flush).not.toThrow();
                });
            });
        });

        describe('when backed up', function() {
            describe('when continueForm is true', function() {
                it('should set continueForm to be false', function() {
                    scope.back();
                    expect(scope.continueForm).toBe(false);
                });
            });

            describe('when continueForm is false', function() {
                it('should return to home', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    scope.back();
                    expect(location.path).toHaveBeenCalledWith('/');
                });
            });
        });

        describe('when cancelled', function() {
            it('should return to home', function(){
                spyOn(location, 'path').and.returnValue('/');
                scope.cancel();
                expect(location.path).toHaveBeenCalledWith('/');
            });
        });

        describe('when continued', function() {
          it('should set continueForm to be true', function() {
              scope.continue();
              expect(scope.continueForm).toBe(true);
          });
        });
*/
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

/*
        describe('when address foo/1 is selected', function() {
            it('should return an address', function() {
                var address = scope.getAddress('foo/1');
                expect(address).toBeDefined();
            });
        });
        
        describe('when a delete request is cancelled', function() {
            it('should return to the all addresses view', function() {
                spyOn(location, 'path').and.returnValue('/service_requests/addresses');
                scope.cancelDelete();
                expect(location.path).toHaveBeenCalledWith('/service_requests/addresses');
            });
        });

        describe('when a delete request is made for foo/1', function() {
            it('should ask for confirmation of the delete request', function() {
                spyOn(location, 'path').and.returnValue('/service_requests/addresses/delete');
                scope.deleteAddress('foo/1');
                expect(location.path).toHaveBeenCalledWith('/service_requests/addresses/delete');
                expect(addresses.currentAddress).toEqual(scope.getAddress('foo/1'));
            });
        });

        describe('when a delete request is confirmed', function() {
            it('should confirm the delete request', function() {
                spyOn(location, 'path').and.returnValue('/service_requests/addresses/delete/review');
                scope.requestDelete();
                expect(location.path).toHaveBeenCalledWith('/service_requests/addresses/delete/review');
            });
        }); 
*/
    });
    describe("Directives", function(){
    });
    describe("Routes", function(){
        it('should map routes to controllers', function() {
            inject(function($route) {
                expect($route.routes['/service_requests/addresses'].controller).toBe('AddressesController');
                expect($route.routes['/service_requests/addresses'].templateUrl).toEqual('/js/service_requests/addresses/view.html');
            });
        });
    });
});

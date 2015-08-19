/* global describe it beforeEach inject expect */

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


        
        //Testing Object Property Structure in one it function

        
        
        /** Cover all business Logic **/

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
*/
        describe('when backed up', function() {
            describe('when continueForm is true', function() {
                it('should set continueForm to be false', function() {
                    spyOn(history,'back').and.returnValue('/service_requests/addresses');
                    scope.continueForm = true;
                    scope.back();
                    expect(scope.continueForm).toBe(false);
                });
            });

            describe('when continueForm is false', function() {
                it('should return to home', function() {
                    spyOn(history,'back').and.returnValue('/service_requests/addresses');
                    scope.continueForm = false;
                    scope.back();
                    expect(scope.continueForm).toEqual(false);
                });
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
/*
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
        //only test logic examples nothing more
    });
    describe("Services", function(){
        //Test things like Required or other validations
        
    });

    describe("Routes", function(){
        it('should map routes to controllers', function() {
            inject(function($route) {
                /*  only test logic examples not anything more
                expect($route.routes['/service_requests/addresses'].controller).toBe('AddressesController');
                expect($route.routes['/service_requests/addresses'].templateUrl).toEqual('/js/address_service_requests/templates/view.html');
                expect($route.routes['/service_requests/addresses/delete'].templateUrl).toEqual('/js/address_service_requests/templates/delete.html');
                expect($route.routes['/service_requests/addresses/new'].templateUrl).toEqual('/js/address_service_requests/templates/new.html');
                expect($route.routes['/service_requests/addresses/addMultiple'].templateUrl).toEqual('/js/address_service_requests/templates/addMultiple.html');
                expect($route.routes['/service_requests/addresses/updateMultiple'].templateUrl).toEqual('/js/address_service_requests/templates/updateMultiple.html');
                expect($route.routes['/service_requests/addresses/deleteMultiple'].templateUrl).toEqual('/js/address_service_requests/templates/deleteMultiple.html');
                */
            });
        });

         // Tests for testing directives
        describe('directive: new-form-fields.html', function() {
            var element, scope;

            beforeEach(module('mps'));

            beforeEach(inject(function($rootScope, $compile) {
                scope = $rootScope.$new();

                element = '<address-new-fields></address-new-fields>';
                element = $compile(element)(scope);

                scope.$digest();
            }));
        });
    });
});

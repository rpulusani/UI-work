/* global describe it beforeEach inject expect */

describe('Contact Service Request Module', function() {
    beforeEach(module('mps'));

    describe('Controllers', function(){
        var scope, ctrl, location, contacts, window, history;

        beforeEach(inject(function($rootScope, $controller, $location, Contacts, History, $window) {
            scope = $rootScope.$new();
            location = $location;
            window = $window;
            history = History;
            ctrl = $controller('ContactsController', {$scope: scope});
            contacts = Contacts;
        }));

         describe('when backed up', function() {
            describe('when continueForm is true', function() {
                it('should set continueForm to be false', function() {
                    spyOn(history,'back').and.returnValue('/service_requests/contacts');
                    scope.continueForm = true;
                    scope.back();
                    expect(scope.continueForm).toBe(false);
                });
            });

            describe('when continueForm is false', function() {
                it('should return to home', function() {
                    spyOn(history,'back').and.returnValue('/service_requests/contacts');
                    scope.continueForm = false;
                    scope.back();
                    expect(scope.continueForm).toEqual(false);
                });
            });

            describe('when cancelled', function() {
            it('should return to home', function(){
                spyOn(location, 'path').and.returnValue('/');
                scope.cancel();
                expect(location.path).toHaveBeenCalledWith('/service_requests/contacts');
                });
            });

            describe('when continued', function() {
              it('should set continueForm to be true', function() {
                  scope.continue();
                  expect(scope.continueForm).toBe(true);
              });
            });

            describe('when a delete request is cancelled', function() {
                it('should return to the all contacts view', function() {
                    spyOn(location, 'path').and.returnValue('/service_requests/contacts');
                    scope.cancel();
                    expect(location.path).toHaveBeenCalledWith('/service_requests/contacts');
                });
            });
        });
    });

    describe('Routes', function(){
        it('should map routes to controllers', function() {
            inject(function($route) {
                expect($route.routes['/service_requests/contacts'].controller).toBe('ContactsController');
                expect($route.routes['/service_requests/contacts'].templateUrl).toEqual('/app/contact_service_requests/templates/view.html');
                expect($route.routes['/service_requests/contacts/new'].templateUrl).toEqual('/app/contact_service_requests/templates/new.html');
            });
        });

         // Tests for testing directives
        describe('directive: new-form-fields.html', function() {
            var element, scope;

            beforeEach(module('mps'));

            beforeEach(inject(function($rootScope, $compile) {
                scope = $rootScope.$new();

                element = '<contact-new-fields></contact-new-fields>';
                element = $compile(element)(scope);

                scope.$digest();
            }));
        });
    });
});

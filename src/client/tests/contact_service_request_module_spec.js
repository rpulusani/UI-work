/* global describe it beforeEach inject expect */

describe('Contact Service Request Module', function() {
    beforeEach(module('mps'));

    describe('ContactsController', function() {
        var scope, ctrl, location, window, history;
        beforeEach(inject(function($rootScope, $controller, $location, History, $window) {
            scope = $rootScope.$new();
            location = $location;
            window = $window;
            history = History;
            ctrl = $controller('ContactsController', {$scope: scope});
        }));

        describe('when back() is called', function() {
            it('should call history back', function() {
                scope.back();
                expect(history.path).toBeCalled;
            });
        });

        describe('when goToCreate() is called', function() {
            it('should take to new page', function() {
                spyOn(location, 'path').and.returnValue('/');
                scope.goToCreate();
                expect(location.path).toHaveBeenCalledWith('/service_requests/contacts/new');
            });
        });

        describe('when goToUpdate() is called', function() {
            it('should take to update page', function() {
                var contact = {id: '1'};
                spyOn(location, 'path').and.returnValue('/');
                scope.goToUpdate(contact);
                expect(location.path).toHaveBeenCalledWith('/service_requests/contacts/1/update');
            });

        });

        // describe('when remove() is called', function() {
        //     it('should remove an item in $scope.contacts', function() {

        //     });
        // });
    });

    describe('ContactController', function() {
        var scope, ctrl, location, window, history;
        beforeEach(inject(function($rootScope, $controller, $location, History, $window) {
            scope = $rootScope.$new();
            location = $location;
            window = $window;
            history = History;
            ctrl = $controller('ContactController', {$scope: scope});
        }));

        describe('when review() is called', function() {
            it('should set reviewing to be true', function() {
                scope.review();
                expect(scope.reviewing).toBe(true);
            });
        });

        describe('when edit() is called', function() {
            it('should set reviewing to be false', function() {
                scope.edit();
                expect(scope.reviewing).toBe(false);
            });
        });

        describe('when back() is called', function() {
            it('should call history back', function() {
                scope.back();
                expect(history.path).toBeCalled;
            });
        });

        describe('when cancel() is called', function() {
            it('should redirect to list', function() {
                spyOn(location, 'path').and.returnValue('/');
                scope.cancel();
                expect(location.path).toHaveBeenCalledWith('/service_requests/contacts');
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

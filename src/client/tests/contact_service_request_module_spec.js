/* global describe it beforeEach inject expect */
define(['angular','angular-mocks', 'contact'], function(angular, mocks, contact) {
describe('Contact Service Request Module', function() {
    beforeEach(module('mps'));

    describe('ContactsController', function() {
        var scope, ctrl, location, history, mockedContactFactory;

        beforeEach(function (){
            mockedContactFactory = {
                delete: function(contact, resolve) {
                    resolve(true);
                },
                getHAL: jasmine.createSpy()
            };

            module(function($provide) {
                $provide.value('ContactService', mockedContactFactory);
            });
        });
        beforeEach(inject(function($rootScope, $controller, $location, History) {
            scope = $rootScope.$new();
            location = $location;
            history = History;
            ctrl = $controller('ContactsController', {$scope: scope});
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
                expect(location.path).toHaveBeenCalledWith('/service_requests/contacts/new');
            });
        });

        describe('goToUpdate', function() {
            it('should take to update page', function() {
                var contact = { _links: { self: { href: 'accounts/1/contacts/1'} } };
                spyOn(location, 'path').and.returnValue('/');
                scope.goToUpdate(contact);
                expect(location.path).toHaveBeenCalledWith('/service_requests/contacts/1/update');
            });

        });

        describe('goToReview', function() {
            it('should take to review page', function() {
                var contact = { _links: { self: { href: 'accounts/1/contacts/1'} } };
                spyOn(location, 'path').and.returnValue('/');
                scope.goToReview(contact);
                expect(location.path).toHaveBeenCalledWith('/service_requests/contacts/1/review');
            });

        });

        // describe('remove', function() {
        //     it('should remove an item in $scope.contacts', function(){
        //         scope.contacts = [{id: '1'}, {id: '2'}];
        //         var contact = {id: '1'};
        //         spyOn(mockedContactFactory, 'delete').and.callThrough();
        //         scope.remove(contact);
        //         //expect(mockedContactFactory.delete.calls.count()).toBe(1);
        //         expect(mockedContactFactory.delete).toHaveBeenCalled();
        //         expect(mockedContactFactory.delete.calls.argsFor(0)[0]).toEqual(contact);
        //         expect(scope.contacts.length).toEqual(1);
        //     });
        // });
    });

    describe('ContactController', function() {
        var scope, ctrl, location, history, mockedContactFactory;
        beforeEach(function (){
            mockedContactFactory = {
                get: jasmine.createSpy(),
                save: jasmine.createSpy(),
                update: jasmine.createSpy()
            };

            mockedServiceRequestFactory = {
                save: jasmine.createSpy()
            };

            module(function($provide) {
                $provide.value('ContactService', mockedContactFactory);
                $provide.value('ServiceRequestService', mockedServiceRequestFactory);
            });
        });
        beforeEach(inject(function($rootScope, $controller, $location, History) {
            scope = $rootScope.$new();
            location = $location;
            history = History;
            ctrl = $controller('ContactController', {$scope: scope});
        }));

        describe('at init', function() {
            describe('when routeParam.id exists', function() {
                beforeEach(inject(function($routeParams, $controller){
                    $routeParams.id = 1;
                    ctrl = $controller('ContactController', {$scope: scope});
                }));
                it('should get contact', function() {
                    expect(mockedContactFactory.get.calls.count()).toBe(1);
                });
            });

            describe('when routeParam.id not available', function() {
                it('should not get contact', function() {
                    expect(mockedContactFactory.get.calls.count()).toBe(0);
                });
            });
        });

        describe('review', function() {
            it('should set reviewing to be true', function() {
                scope.review();
                expect(scope.reviewing).toBe(true);
            });
        });

        describe('edit', function() {
            it('should set reviewing to be false', function() {
                scope.edit();
                expect(scope.reviewing).toBe(false);
            });
        });

        describe('save', function() {
            describe('when scope.contact.id exists', function() {
                it('should update contact', function() {
                    scope.contact.id = 1;
                    scope.save();
                    expect(mockedContactFactory.update.calls.count()).toBe(1);
                });
            });

            describe('when scope.contact.id not available', function() {
                it('should save contact', function() {
                    scope.save();
                    expect(mockedContactFactory.save.calls.count()).toBe(1);
                });
            });
        });

        describe('saveServiceRequest', function() {
            it('should save service request', function() {
                scope.saveServiceRequest();
                expect(mockedServiceRequestFactory.save.calls.count()).toBe(1);
            });
        });

        describe('back', function() {
            it('should call history back', function() {
                scope.back();
                expect(history.path).toBeCalled;
            });
        });

        describe('cancel', function() {
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
});

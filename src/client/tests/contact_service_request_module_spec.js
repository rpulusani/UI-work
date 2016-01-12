define(['angular', 'angular-mocks', 'contact', 'fixtures'],
    function(angular, mocks, contact, fixtures) {
        describe('Contact Module', function() {
            var scope,
            httpBackend,
            mockContactListCtrl,
            mockContactCtrl,
            location,
            deferred,
            mockContactFactory;

            beforeEach(module('mps'));

            beforeEach(inject(function($rootScope, $httpBackend, $controller, $location, Contacts, $q) {
                scope = $rootScope.$new();
                deferred= $q.defer();
                httpBackend = $httpBackend;
                location = $location;

                mockContactFactory = Contacts;

                mockContactFactory.get = function(contact) {
                    return deferred.promise;
                };

                mockContactFactory.save = function(contact) {
                    contact.id = 'assigned';
                    return deferred.promise;
                };

                mockContactFactory.update = function(contact) {
                    return deferred.promise;
                };

                mockContactFactory.item = {id:'123', _links: {self: {href: '/contacts/123'}}};
                mockContactFactory.route = '/service_requests/contacts';

                scope.contacts = mockContactFactory;

                mockContactListCtrl = $controller('ContactListController', {$scope: scope, Contacts: mockContactFactory});
                mockContactCtrl = $controller('ContactController', {$scope: scope, Contacts: mockContactFactory, translationPlaceHolder:  {}});

                httpBackend.when('GET', 'etc/resources/i18n/en.json').respond({it: 'works'});
                httpBackend.when('GET', '/').respond({it: 'works'});
            }));

            describe('Contact List Controller', function() {
                it('scope.contacts.goToCreate() - route to /new', function() {
                    spyOn(scope.contacts, 'goToCreate').and.callThrough();
                    spyOn(location, 'path').and.returnValue('/');

                    scope.contacts.goToCreate();

                    expect(scope.contacts.item.firstName).toEqual(mockContactFactory.getModel().firstName);
                    expect(location.path).toHaveBeenCalledWith(mockContactFactory.route + '/new');
                 });

                it('scope.contacts.goToUpdate() - route to /update', function() {
                    spyOn(scope.contacts, 'goToUpdate').and.callThrough();
                    spyOn(location, 'path').and.returnValue('/');

                    scope.contacts.goToUpdate(scope.contacts.item);

                    expect(location.path).toHaveBeenCalledWith(mockContactFactory.route + '/123/update');
                 });
            });
            describe('ContactController', function() {
                describe('scope.contacts.goToReview', function() {
                    it('should take to review page', function() {
                        spyOn(scope.contacts, 'goToReview').and.callThrough();
                        spyOn(location, 'path').and.returnValue('/');

                        scope.contacts.goToReview(scope.contacts.item);

                        expect(scope.contacts.item.id).toEqual('123');
                        expect(location.path).toHaveBeenCalledWith('/service_requests/contacts/' + scope.contact.id + '/review');
                    });
                });

                describe('scope.conctacts.saveContact()', function() {
                    describe('when scope.contact.id is not found', function() {
                        it('it should save a new contact', function() {
                            spyOn(scope, 'save').and.callThrough();
                            spyOn(location, 'path').and.returnValue('/');

                            deferred.resolve();

                            scope.contacts.item = {
                                firstName: 'test',
                                lastName:'test',
                                email: 'test'
                            };

                            scope.save();
                            scope.$digest();

                            expect(scope.contacts.saveContact).toHaveBeenCalled();
                            expect(scopes.contacts.item.id).toEqual('assigned');
                            expect(location.path).toHaveBeenCalled();
                        });
                    });

                    describe('when scope.contact.id is defined', function() {
                        it('it should save contact', function() {
                            spyOn(scope, 'save').and.callThrough();
                            spyOn(location, 'path').and.returnValue('/');

                            deferred.resolve();

                            scope.save();
                            scope.$digest();

                            expect(scope.save).toHaveBeenCalled();
                            expect(scope.contact.id).toEqual('123');
                            expect(location.path).toHaveBeenCalled();
                        });
                    });
                });

                describe('cancel', function() {
                    it('should redirect to list', function() {
                        spyOn(location, 'path').and.returnValue('/');
                        scope.cancel();
                        expect(location.path).toHaveBeenCalledWith(mockContactFactory.route + '/');
                    });
                });
            });

            describe('Routes', function(){
                it('should map routes to controllers', function() {
                    inject(function($route) {
                        expect($route.routes['/service_requests/contacts'].controller).toBe('ContactListController');
                        expect($route.routes['/service_requests/contacts'].templateUrl).toEqual('/app/contact_service_requests/templates/view.html');
                        expect($route.routes['/service_requests/contacts/new'].templateUrl).toEqual('/app/contact_service_requests/templates/new.html');
                    });
                });

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
    }
);

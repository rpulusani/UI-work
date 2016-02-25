define(['angular', 'angular-mocks', 'contact', 'fixtures'],
    function(angular, mocks, contact, fixtures) {
        describe('Contact Module', function() {
            var scope,
            httpBackend,
            mockContactListCtrl,
            location,
            deferred,
            mockContactFactory;

            beforeEach(module('mps'));

            beforeEach(inject(function($rootScope, $httpBackend, $controller, $location, Contacts, $q) {
                scope = $rootScope.$new();
                deferred= $q.defer();
                httpBackend = $httpBackend;
                location = $location;
                config.portal.adminUrl = 'abcd';
                mockContactFactory = Contacts;

                mockContactFactory.item = {id:'123', _links: {self: {href: '/contacts/123'}}};
                mockContactFactory.route = '/service_requests/contacts';

                scope.contacts = mockContactFactory;

                mockContactListCtrl = $controller('ContactListController', {$scope: scope, Contacts: mockContactFactory});
                httpBackend.when('GET', 'abcd/localizations/en.json').respond({it: 'works'});
                httpBackend.when('GET', '/').respond({it: 'works'});
            }));

            describe('Contact List Controller', function() {
                it('goToCreate() - route to /new', function() {
                    spyOn(scope, 'goToCreate').and.callThrough();
                    spyOn(location, 'path').and.returnValue('/');
                    scope.goToCreate();
                    expect(mockContactFactory.item).toEqual(undefined);
                    expect(location.path).toHaveBeenCalledWith(mockContactFactory.route + '/new');
                 });

                it('scope.contacts.goToUpdate() - route to /update', function() {
                    spyOn(scope.contacts, 'goToUpdate').and.callThrough();
                    spyOn(location, 'path').and.returnValue('/');

                    scope.contacts.goToUpdate(scope.contacts.item);

                    expect(location.path).toHaveBeenCalledWith(mockContactFactory.route + '/123/update');
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

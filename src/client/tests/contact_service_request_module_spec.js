define(['angular', 'angular-mocks', 'contact', 'fixtures'],
    function(angular, mocks, contact, fixtures) {
        describe('Contact Module', function() {
            var scope,
            httpBackend,
            mockContactListCtrl,
            location,
            q,
            deferred,
            mockContactFactory;

            beforeEach(module('mps'));

            beforeEach(inject(function($rootScope, $httpBackend, $controller, $location, Contacts, $q) {
                scope = $rootScope.$new();
                deferred= $q.defer();
                httpBackend = $httpBackend;
                location = $location;
                
                mockContactFactory = Contacts;
                mockContactFactory.get = function() {
                    return deferred.promise;
                }

                mockContactFactory.item = {id:'123', _links: {self: {href: '/contacts/123'}}};
                mockContactFactory.route = '/service_requests/contacts';

                scope.contact = mockContactFactory.item;
                
                mockContactListCtrl = $controller('ContactListController', {$scope: scope, Contacts: mockContactFactory});

                httpBackend.when('GET', 'etc/resources/i18n/en.json').respond({it: 'works'});
                httpBackend.when('GET', '/').respond({it: 'works'});
            }));

            describe('Contact List Controller', function() {
                it('goToCreate() - route to /new', function() {
                    spyOn(scope, 'goToCreate').and.callThrough();
                    spyOn(location, 'path').and.returnValue('/');

                    scope.goToCreate();
                    expect(mockContactFactory.item).toEqual({});
                    expect(location.path).toHaveBeenCalledWith('/service_requests/contacts/new');
                 });

                it('goToUpdate() - route to /update', function() {
                    spyOn(scope, 'goToUpdate').and.callThrough();
                    spyOn(location, 'path').and.returnValue('/');
                    
                    deferred.resolve();
                    scope.goToUpdate(scope.contact);

                    scope.$digest();
                    expect(location.path).toHaveBeenCalledWith(mockContactFactory.route + '/123/update');
                 });
            });
        });
    }
);

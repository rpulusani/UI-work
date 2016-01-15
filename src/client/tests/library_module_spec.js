// Unit tests for Library module
define(['angular', 'angular-mocks', 'library'], function(angular, mocks, library) {
  describe('Library Module', function() {
      var scope,
      rootScope,
      httpBackend,
      ctrl,
      location,
      deferred,
      mockLibraryFactory;

      beforeEach(module('mps'));

      describe('LibraryListController', function(){

          beforeEach (
              inject(function($rootScope, $httpBackend, $controller, $location, Documents, $q) {
              scope = $rootScope.$new();
              rootScope = $rootScope.$new();
              deferred = $q.defer();
              httpBackend = $httpBackend;
              location = $location;

              mockLibraryFactory = Documents;

              mockLibraryFactory.documents = [
                  {
                      id: 1024,
                      name: 'customer_success_with_mps.pdf',
                      title: 'Customer success with MPS',
                      description: 'With thousands of successful MPS engagements, we understand your challenges from front line to back office.',
                      _links: {
                          self: { href: 'https://api.venus-dev.lexmark.com/mps/documents/1024' }
                      }
                  },
                  {
                      id: 2048,
                      name: 'is_less_really_more_rethinking_managed_print_services.pdf',
                      title: 'Is less really more? Rethinking managed print services',
                      description: '\"Print less\" strategies move from revolution to evolution as organizations look for new ways to manage information.',
                      _links: {
                          self: { href: 'https://api.venus-dev.lexmark.com/mps/documents/2048' }
                      }
                  }
              ];

              mockLibraryFactory.route = '/library';

              ctrl = $controller('LibraryListController', {$scope: scope, Documents: mockLibraryFactory});

              })
          );

          describe('goToNew', function() {
              it('should direct the user to upload a new document', function() {
                  spyOn(location, 'path').and.returnValue('/');

                  scope.goToNew();
                  expect(location.path).toHaveBeenCalledWith('/library/new');
              });
          });
      });

      describe('LibraryAddController', function(){

          beforeEach (
              inject(function($rootScope, $httpBackend, $controller, $location, Documents, $q) {
              scope = $rootScope.$new();
              rootScope = $rootScope.$new();
              deferred = $q.defer();
              httpBackend = $httpBackend;
              location = $location;

              mockLibraryFactory = Documents;

              mockLibraryFactory.route = '/library';

              ctrl = $controller('LibraryAddController', {$scope: scope, Documents: mockLibraryFactory});

              })
          );

      });

      describe('Routes', function() {
          it('should map routes to controllers', function() {
              inject(function($route) {
                  expect($route.routes['/library'].controller).toBe('LibraryListController');
                  expect($route.routes['/library'].templateUrl)
                              .toEqual('/app/library/templates/view.html');
              });
          });
      });
  });
});

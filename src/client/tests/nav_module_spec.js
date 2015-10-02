define(['angular', 'angular-mocks', 'nav', 'fixtures'], 
    function(angular, mocks, nav, fixtures) {
        describe('Nav Module', function() {
            var scope,
            httpBackend,
            mockCtrl,
            mockNavFactory;

            beforeEach(module('mps'));

            beforeEach(inject(function($rootScope, $httpBackend, $controller, Nav) {
                scope = $rootScope.$new();
                httpBackend = $httpBackend;
                mockNavFactory = Nav;
                mockCtrl = $controller('NavController', {$scope: scope});

                scope.items = [{
                    "id": "1",
                    "action": "/",
                    "text": "DASHBOARD.TITLE",
                    "description": "Some description of this link",
                    "icon": "icon icon--lxk-ui icon--error",
                    "tags":["primary"]
                }, {
                    "id": "2",
                    "action": "/",
                    "text": "DASHBOARD.TITLE",
                    "description": "Some description of this link",
                    "icon": "icon icon--lxk-ui icon--error",
                    "tags":["device"]
                }];

                httpBackend.when('GET', '/etc/resources/i18n/en.json').respond({it: 'works'});
                httpBackend.when('GET', '/users?idpId=1').respond(fixtures.users.regular);
                httpBackend.when('GET', 'app/nav/data/navigation.json').respond(200, scope.items);
            }));

            describe('Nav Factory', function() {
                it('factory should be mocked', function() {
                    expect(mockNavFactory).toBeDefined();
                });

                it('query() - should get the navigation outline from a flat file', function() {
                    spyOn(mockNavFactory, 'query').and.callThrough();

                    mockNavFactory.query(function(i) {
                        mockNavFactory.items = i;
                    });

                    httpBackend.flush();

                    expect(mockNavFactory.query).toHaveBeenCalled();
                    expect(mockNavFactory.items).toBeDefined();
                    expect(mockNavFactory.items.length).toBe(2);
                    expect(mockNavFactory.items[0].id).toBe('1');
                });

                it('getItemsByTag() - pass in a tag and return the item', function() {
                    mockNavFactory.items = scope.items;

                    spyOn(mockNavFactory, 'getItemsByTag').and.callThrough();
                    
                    var tags = mockNavFactory.getItemsByTag('device');

                    httpBackend.flush();

                    expect(mockNavFactory.getItemsByTag).toHaveBeenCalled();
                    expect(mockNavFactory.items.length).toBe(2);
                    expect(tags.length).toBe(1);
                    expect(tags[0].id).toBe('2');
                });

                it('getTags() - obtain a full collection of the tags in the factory item array', function() {
                    mockNavFactory.items = scope.items;

                    spyOn(mockNavFactory, 'getTags').and.callThrough();
                    
                    var tags = mockNavFactory.getTags();

                    httpBackend.flush();

                    expect(mockNavFactory.getTags).toHaveBeenCalled();
                    expect(mockNavFactory.tags.length).toBe(2);
                    expect(mockNavFactory.tags[0]).toBe('primary');
                    expect(mockNavFactory.tags[1]).toBe('device');
                 });
            });

            describe('Nav Controller', function() {
                it('getItemsByTag() - pass in a tag and get the wanted items', function() {
                    mockNavFactory.items = scope.items;

                    spyOn(scope, 'getItemsByTag').and.callThrough();
                    
                    var items = scope.getItemsByTag('device');
                    expect(scope.getItemsByTag).toHaveBeenCalled();
                    expect(items.length).toBe(1);
                    expect(items[0].tags[0]).toBe('device');
                 });
            });
        });
    }
);

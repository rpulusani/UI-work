define(['angular', 'angular-mocks', 'nav', 'fixtures'], 
    function(angular, mocks, nav, fixtures) {
        describe('Nav Module', function() {
            beforeEach(module('mps'));

            describe('Nav Factory', function() {
                var scope,
                httpBackend,
                mockNavFactory;

                beforeEach(inject(function($rootScope, $httpBackend, Nav) {
                    scope = $rootScope.$new();
                    httpBackend = $httpBackend;
                    mockNavFactory = Nav;

                    // AJAX mocks
                    httpBackend.when('GET', '/etc/resources/i18n/en.json').respond({it: 'works'});
                    httpBackend.when('GET', '/users?idpId=1').respond(fixtures.users.regular);
                    httpBackend.whenGET('app/nav/data/navigation.json').respond(200, [{
                        "id": "1",
                        "action": "/",
                        "text": "DASHBOARD.TITLE",
                        "description": "Some description of this link",
                        "icon": "icon icon--lxk-ui icon--error",
                        "tags":["primary"]
                    }]);
                }));

                it('factory should be mocked', function() {
                    expect(mockNavFactory).toBeDefined();
                    expect(mockNavFactory.query).toBeDefined();
                });

                it('query() - should get the navigation outline from a flat file', function() {
                    spyOn(mockNavFactory, 'query').and.callThrough();

                    mockNavFactory.query(function(i) {
                        mockNavFactory.items = i;
                    });

                    httpBackend.flush();

                    expect(mockNavFactory.query).toHaveBeenCalled();
                    expect(mockNavFactory.items).toBeDefined();
                    expect(mockNavFactory.items.length).toBe(1);
                    expect(mockNavFactory.items[0].id).toBe('1');
                });
            });
        });
    }
);

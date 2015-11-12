define(['angular', 'angular-mocks', 'utility.hateaosConfig', 'fixtures'],
    function(angular, mocks) {
        describe('HATEAOSConfig.js', function() {
            var scope,
            httpBackend,
            deferred,
            serviceUrl,
            mockFactory;

            beforeEach(module('mps'));

            beforeEach(inject(function(serviceUrl, $httpBackend, HATEAOSConfig, $q) {
                httpBackend = $httpBackend;
                mockFactory = HATEAOSConfig;
                mockFactory.serviceMap = {
                    test: {
                        href: '', // Response from end point
                        url: 'https://api.venus-dev.lexmark.com/mps/test', // Formatted URL
                        params: {} // Formatted params object
                    }
                }

                httpBackend.when('GET', 'etc/resources/i18n/en.json').respond({it: 'works'});
                httpBackend.when('GET', '/').respond({
                    _links : {
                        test : {
                          href : "https://api.venus-dev.lexmark.com/mps/test{?page,size,sort}",
                          templated : true
                        },
                        anotherTest : {
                            href : "https://api.venus-dev.lexmark.com/mps/anotherTest{?page,size,sort}",
                            templated : true
                        }
                    }
                });
            }));

            describe('createParams()', function() {
                it('creates a param object', function() {
                    spyOn(mockFactory, 'getApi').and.callThrough();
                   
                    mockFactory.serviceMap.test.params = mockFactory.createParams(['page', 'size', 'test']);
                    
                    expect(mockFactory.serviceMap.test.params.page).toEqual(0);
                    expect(mockFactory.serviceMap.test.params.size).toEqual(20);
                    expect(mockFactory.serviceMap.test.params.test).toEqual(null);
                });
            });

            describe('getApi()', function() {
                it('get an api object from the default endpoint', function() {
                    var apiObj;

                    spyOn(mockFactory, 'getApi').and.callThrough();

                    mockFactory.getApi('anotherTest');

                    httpBackend.flush();

                    expect(mockFactory.serviceMap.test.url).toEqual('https://api.venus-dev.lexmark.com/mps/test');
                    expect(mockFactory.serviceMap.anotherTest.url).toEqual('https://api.venus-dev.lexmark.com/mps/anotherTest');
                });
            });
        });
    }
);

define(['angular', 'angular-mocks', 'utility.hateaosFactory', 'fixtures'],
    function(angular, mocks) {
        describe('HATEAOSFactory.js', function() {
            var scope,
            httpBackend,
            mockServiceDefinition,
            testItem,
            mockFactory,
            rootScope;

            beforeEach(module('mps'));

            beforeEach(inject(function($rootScope, $httpBackend, HATEAOSFactory, $q) {
                var hateaosConfig = {
                    serviceName: 'test',
                    embeddedName: 'test',
                    columns: [
                        {
                            'name': 'fullname',
                            'field': '',
                            'cellTemplate':
                                '<div>' +
                                    '<a href="" ng-click="grid.appScope.goToUpdate(row.entity)" ' +
                                    'ng-bind="row.entity.lastName + \', \' +  row.entity.firstName"></a>' +
                                '</div>'
                        },
                        {'name': 'address', 'field': 'address'},
                        {'name': 'work phone', 'field': 'workPhone'},
                        {'name': 'alternate phone', 'field': 'alternatePhone'},
                        {'name': 'email', 'field': 'email'}
                    ],
                    route: ''
                };

                $rootScope.currentUser = {
                    item: {
                        accounts: [
                            {
                                accountId: '1-21AYVOT',
                                level: 'GLOBAL'
                            }
                        ],
                    },
                    deferred: $q.defer()
                };

                rootScope = $rootScope;

                mockFactory = new HATEAOSFactory(hateaosConfig);
                mockFactory.url = 'http://127.0.0.1/test';

                testItem = {
                    "name" : "test2",
                    "id" : "1-TEST",
                    "_links" : {
                        "self" : {
                            "href" : mockFactory.url + '/1-TEST'
                        }
                    }
                };

                httpBackend = $httpBackend;
                //httpBackend.when('GET', )

                httpBackend.when('GET', 'etc/resources/i18n/en.json').respond({it: 'works'});
                httpBackend.when('GET', '/').respond({
                    _links : {
                        test : {
                          href :  mockFactory.url + "{?page,size,sort}",
                          templated : true
                        },
                        anotherTest : {
                            href : mockFactory.url + "/anotherTest{?page,size,sort}",
                            templated : true
                        }
                    }
                });

                httpBackend.when('POST', mockFactory.url + '?accountId=1-21AYVOT&accountLevel=GLOBAL').respond({
                    "name" : "test2",
                    "id" : "1-TEST",
                    "saved": true,
                    "_links" : {
                        "self" : {
                            "href" : mockFactory.url + "test/1-TEST"
                        }
                    }
                });

                httpBackend.when('PUT', mockFactory.url + '/1-TEST?accountId=1-21AYVOT&accountLevel=GLOBAL').respond({
                    "name" : "test2",
                    "id" : "1-TEST",
                    "updated": true,
                    "_links" : {
                        "self" : {
                            "href" : mockFactory.url + "/1-TEST"
                        }
                    }
                });

                httpBackend.when('GET', mockFactory.url + '/1-TEST').respond({
                    "name" : "test2",
                    "id" : "1-TEST",
                    "newProp": 'nice!',
                    "_links" : {
                        "self" : {
                            "href" : mockFactory.url + '/1-TEST'
                        }
                    }
                });

                httpBackend.when('GET', mockFactory.url + '?page=0&size=20&accountId=1-21AYVOT&accountLevel=GLOBAL').respond({
                  "_links" : {
                    "self" : {
                      "href" : mockFactory.url + '/{?page,size,sort}',
                      "templated" : true
                    },
                    "next" : {
                      "href" :  mockFactory.url + '?page=1&size=20{&sort}',
                      "templated" : true
                    }
                  },
                  "_embedded" : {
                    "test" : [{
                      "name" : "test",
                      "id" : "1-6PCRP71",
                      "_links" : {
                        "self" : {
                          "href" : mockFactory.url +  '/1-6PCRP71'
                        }
                      }
                    }]},
                    "page" : {
                        "size" : 20,
                        "totalElements" : 519,
                        "totalPages" : 26,
                        "number" : 0
                    }
                });
            }));

            describe('getPage()', function() {
                it('gets a paged collection from the service and puts them in this.data', function() {
                    spyOn(mockFactory, 'getPage').and.callThrough();

                    mockFactory.getPage();
                    rootScope.currentUser.deferred.resolve();
                    httpBackend.flush();

                    expect(mockFactory.data.length).toEqual(1);
                    expect(mockFactory.data[0].id).toEqual('1-6PCRP71');
                    expect(mockFactory.page.number).toEqual(0);
                    expect(mockFactory.params.page).toEqual(0);
                    expect(mockFactory.processedResponse).toBeDefined();
                });
            });

            describe('get()', function() {
                it('gets a single service item', function() {
                    spyOn(mockFactory, 'get').and.callThrough();

                    mockFactory.get(testItem);
                    rootScope.currentUser.deferred.resolve();
                    httpBackend.flush();

                    expect(mockFactory.item.id).toEqual('1-TEST');
                    expect(mockFactory.item.newProp).toEqual('nice!');
                    expect(mockFactory.processedResponse).toBeDefined();
                });
            });

            describe('save()', function() {
                it('saves a new service item', function() {
                    spyOn(mockFactory, 'save').and.callThrough();

                    mockFactory.save(testItem);
                    rootScope.currentUser.deferred.resolve();
                    httpBackend.flush();

                    expect(mockFactory.item.id).toEqual('1-TEST');
                    expect(mockFactory.item.saved).toEqual(true);
                    expect(mockFactory.processedResponse).toBeDefined();
                });
            });

            describe('update()', function() {
                it('updates a service item', function() {
                    spyOn(mockFactory, 'update').and.callThrough();

                    mockFactory.update(testItem);
                    rootScope.currentUser.deferred.resolve();
                    httpBackend.flush();

                    expect(mockFactory.item.id).toEqual('1-TEST');
                    expect(mockFactory.item.updated).toEqual(true);
                    expect(mockFactory.processedResponse).toBeDefined();
                });
            });
            describe('buildUrl', function(){
                it('should provide the same url passed in if no required params and no additional params passed in',
                    function(){
                    url='http://www.google.com';
                    requiredParams = undefined;
                    additonalParams = undefined;
                    var result = mockFactory.buildUrl(url, requiredParams, additonalParams);

                    expect(result).toEqual('http://www.google.com');
                });
                it('should provide the same url passed in if no required params and no additional params passed in',
                    function(){
                    url='http://www.google.com';
                    requiredParams = null;
                    additonalParams = null;
                    var result = mockFactory.buildUrl(url, requiredParams, additonalParams);

                    expect(result).toEqual('http://www.google.com');
                });
                it('should provide the new url passed in  required params, sort is empty and no additional params passed in',
                    function(){
                    url='http://www.google.com';
                    requiredParams = {
                        sort: '',
                        size: 40,
                        page: 3
                    };
                    additonalParams = undefined;
                    var result = mockFactory.buildUrl(url, requiredParams, additonalParams);

                    expect(result).toEqual('http://www.google.com?size=40&page=3');
                });
                it('should provide the new url passed in required params, sort filled out and no additional params passed in',
                    function(){
                    url='http://www.google.com';
                    requiredParams = {
                        sort: 'green:Desc',
                        size: 40,
                        page: 3
                    };
                    additonalParams = undefined;
                    var result = mockFactory.buildUrl(url, requiredParams, additonalParams);

                    expect(result).toEqual('http://www.google.com?sort=green:Desc&size=40&page=3');
                });
                it('should provide the new url passed in required params, sort filled out and additional params passed in',
                    function(){
                    url='http://www.google.com';
                    requiredParams = {
                        sort: 'green:Desc',
                        size: 40,
                        page: 3
                    };
                    additonalParams = [{
                        'name':'bat',
                        'value': 'ball',
                    },
                    {
                        'name': 'string',
                        'value': 'knot'
                    }];
                    var result = mockFactory.buildUrl(url, requiredParams, additonalParams);

                    expect(result).toEqual('http://www.google.com?sort=green:Desc&size=40&page=3&bat=ball&string=knot');
                });
                it('should provide the new url passed in required params is empty out and additional params passed in',
                    function(){
                    url='http://www.google.com';
                    requiredParams = undefined;
                    additonalParams = [{
                        'name':'bat',
                        'value': 'ball',
                    },
                    {
                        'name': 'string',
                        'value': 'knot'
                    }];
                    var result = mockFactory.buildUrl(url, requiredParams, additonalParams);

                    expect(result).toEqual('http://www.google.com?bat=ball&string=knot');
                });
            });
        });
    }
);

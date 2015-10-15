define(['angular', 'angular-mocks', 'utility.hateaosFactory', 'fixtures'],
    function(angular, mocks) {
        describe('HATEAOSFactory.js', function() {
            var scope,
            httpBackend,
            mockServiceDefinition,
            testItem,
            mockFactory;

            beforeEach(module('mps'));

            beforeEach(inject(function($rootScope, $httpBackend, HATEAOSFactory, $q) {
                var hateaosConfig = {
                    serviceName: 'test',
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

                httpBackend.when('POST', mockFactory.url + '?accountId=1-21AYVOT').respond({
                    "name" : "test2",
                    "id" : "1-TEST",
                    "saved": true,
                    "_links" : {
                        "self" : {
                            "href" : mockFactory.url + "test/1-TEST"
                        }
                    }
                });
            
                httpBackend.when('PUT', mockFactory.url + '/1-TEST?accountId=1-21AYVOT').respond({
                    "name" : "test2",
                    "id" : "1-TEST",
                    "updated": true,
                    "_links" : {
                        "self" : {
                            "href" : mockFactory.url + "/1-TEST"
                        }
                    }
                });

                httpBackend.when('GET', mockFactory.url + '/1-TEST?accountId=1-21AYVOT').respond({
                    "name" : "test2",
                    "id" : "1-TEST",
                    "newProp": 'nice!',
                    "_links" : {
                        "self" : {
                            "href" : mockFactory.url + '/1-TEST'
                        }
                    }
                });

                httpBackend.when('GET', mockFactory.url + '?accountId=1-21AYVOT&page=0&size=20').respond({
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
                    "tests" : [{
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

            describe('getList()', function() {
                it('gets a paged collection from the service and puts them in this.data', function() {
                    spyOn(mockFactory, 'getList').and.callThrough();

                    mockFactory.getList();

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

                    httpBackend.flush();

                    expect(mockFactory.item.id).toEqual('1-TEST');
                    expect(mockFactory.item.updated).toEqual(true);
                    expect(mockFactory.processedResponse).toBeDefined();
                });
            });
        });
    }
);

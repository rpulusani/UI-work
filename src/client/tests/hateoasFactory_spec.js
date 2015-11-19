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
                    params: {page: 0, size: 20, sort: ''},
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
        });
    }
);

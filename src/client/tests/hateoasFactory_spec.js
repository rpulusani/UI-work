define(['angular', 'angular-mocks', 'fixtures', 'hateoasFactory'],
    function(angular, mocks, fixtures) {
        describe('HATEOASFactory.js', function() {
            var scope,
            httpBackend,
            testItem,
            mockFactory,
            secondMockFactory, // Used to test getAdditional()
            rootScope;

            beforeEach(module('mps'));

            beforeEach(inject(function($rootScope, $httpBackend, HATEOASFactory, $q) {
                var hateoasConfig = {
                    serviceName: 'test',
                    embeddedName: 'test',
                    params: {page: 0, size: 20, sort: null},
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
                                accountLevel: 'GLOBAL'
                            }
                        ],
                    },
                    deferred: $q.defer()
                };

                rootScope = $rootScope;

                mockFactory.params.accountId = rootScope.currentUser.item.accounts[0].accountId;
                mockFactory.params.accountLevel = rootScope.currentUser.item.accounts[0].accountLevel;

                $httpBackend.when('GET', '/users?idpId=1').respond(fixtures.users.regular);

                mockFactory = new HATEOASFactory(hateoasConfig);
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
                httpBackend.when('GET', mockFactory.url + '?page=1&size=20&accountId=1-21AYVOT&accountLevel=GLOBAL').respond(fixtures.api.test.pageTwo);
            }));

            describe('column properties', function() {
                it('makes sure we have required column properties defined', function() {
                    expect(mockFactory.columns).toEqual('defaultSet');
                    expect(mockFactory.columnDefs.defaultSet.length).toEqual(5);
                });
            });

            describe('getPage()', function() {
                it('gets a paged collection from the service and puts them in this.data', function() {
                    spyOn(mockFactory, 'getPage').and.callThrough();

                    mockFactory.getPage(1);
                    rootScope.currentUser.deferred.resolve();
                    httpBackend.flush();

                    expect(mockFactory.data.length).toEqual(2);
                    expect(mockFactory.data[1].id).toEqual('itemTwo');
                    expect(mockFactory.page.number).toEqual(1);
                    expect(mockFactory.params.page).toEqual(1);
                    expect(mockFactory.processedResponse).toBeDefined();
                });
            });
/*
            describe('get()', function() {
                it('is ageneralized query service, with a number of different options', function() {
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

                    mockFactory.params = {};

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

                    mockFactory.params = {};

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
*/
        });
    }
);

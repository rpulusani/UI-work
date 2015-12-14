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

                $rootScope.currentUser = fixtures.users.regular;
                $rootScope.currentUser.deferred = $q.defer();

                rootScope = $rootScope;

                mockFactory = new HATEOASFactory(hateoasConfig);
                mockFactory.url = 'http://127.0.0.1/test';
                mockFactory.params.accountId = rootScope.currentUser.item.accounts[0].accountId;
                mockFactory.params.accountLevel = rootScope.currentUser.item.accounts[0].accountLevel;

                httpBackend = $httpBackend;

                // General queries we expect to answer, test specific mocks are in the related it()
                httpBackend.when('GET', '/users?idpId=1').respond(fixtures.users.regular);
                httpBackend.when('GET', 'etc/resources/i18n/en.json').respond({it: 'works'});
                httpBackend.when('GET', mockFactory.url + '?page=0&size=20&accountId=1-21AYVOT&accountLevel=GLOBAL').respond(fixtures.api.test.pageOne);
                httpBackend.when('GET', mockFactory.url + '?page=1&size=20&accountId=1-21AYVOT&accountLevel=GLOBAL').respond(fixtures.api.test.pageTwo);
            }));

            describe('column properties', function() {
                it('makes sure we have required column properties defined', function() {
                    expect(mockFactory.columns).toEqual('defaultSet');
                    expect(mockFactory.columnDefs.defaultSet.length).toEqual(5);
                });
            });

            describe('setItem(halEnvelope) attaches an item to Service.item and sets up the wanted functions' , function() {
                it('must process a valid hal envelope', function() {
                    mockFactory.setItem(fixtures.api.test.itemOne);

                    rootScope.currentUser.deferred.resolve();
                    httpBackend.flush();

                    expect(mockFactory.url).toEqual('http://127.0.0.1/test');
                    expect(mockFactory.item.id).toEqual('itemOne');
                    expect(typeof mockFactory.item.links.itemTwo).toEqual('function');
                });
            });

            describe('testing embedded items' , function() {
                it('a call to a service with embeds=name,name2 should return those items attached to the response', function() {
                    httpBackend
                        .when('GET', mockFactory.url + '?page=0&size=20&accountId=1-21AYVOT&accountLevel=GLOBAL&embeds=device')
                        .respond(fixtures.api.test.embedItem);

                    mockFactory.get({
                        params: {
                            embeds: 'device'
                        }
                    });

                    rootScope.currentUser.deferred.resolve();
                    httpBackend.flush();

                    expect(mockFactory.item.device.item.name).toEqual('testDevice');
                    expect(typeof mockFactory.item.device.item.links.itemOne).toEqual('function');
                    expect(typeof mockFactory.item.device.item.links.itemTwo).toEqual('function');
                });
            });

            describe('createItem(halEnvelope) returns an item and sets up the wanted functions' , function() {
                it('must process a valid hal envelope', function() {
                    var item = mockFactory.createItem(fixtures.api.test.itemTwo);

                    rootScope.currentUser.deferred.resolve();
                    httpBackend.flush();

                    expect(mockFactory.url).toEqual('http://127.0.0.1/test');
                    expect(mockFactory.item).toEqual(null); // create item does not set the item!!
                    expect(item.id).toEqual('itemTwo');
                    expect(typeof item.links.itemOne).toEqual('function');
                });
            });

            describe('getPage()', function() {
                it('gets a paged collection from page 1 of the service and puts them in this.data', function() {
                    mockFactory.getPage();
                    rootScope.currentUser.deferred.resolve();
                    httpBackend.flush();

                    expect(mockFactory.data.length).toEqual(1);
                    expect(mockFactory.data[0].id).toEqual('itemOne');
                    expect(mockFactory.page.number).toEqual(0);
                    expect(mockFactory.params.page).toEqual(0);
                    expect(mockFactory.processedResponse).toBeDefined();
                });
            });

            describe('getPage()', function() {
                it('gets a paged collection from page 2 of the service and puts them in this.data', function() {
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

            describe('get({params: {key:value}}) options check against the generalized query service' , function() {
                it('passing in options.params = {key:value} should modify current parameters', function() {
                    httpBackend
                    .when('GET', mockFactory.url + '?page=0&size=20&accountId=1-21AYVOT&accountLevel=GLOBAL&key=value')
                    .respond(fixtures.api.test.pageTwo);

                    mockFactory.get({
                        params:{
                           key: 'value'
                        }
                    });

                    rootScope.currentUser.deferred.resolve();
                    httpBackend.flush();
                    expect(mockFactory.params.key).toEqual('value');
                });
            });

            describe('get({preventDefaultParams: true}) options check against the generalized query service' , function() {
                it('passing in options.preventDefaultParams = true should set all current params to null so they dont attach to url. Params should reattach when call completes', function() {
                    httpBackend.when('GET', mockFactory.url).respond(fixtures.api.test.pageOne);

                    mockFactory.get({
                        preventDefaultParams: true
                    });

                    rootScope.currentUser.deferred.resolve();
                    httpBackend.flush();

                    expect(mockFactory.params.page).toEqual(0);
                });
            });

            describe('get({url: ""}) options check against the generalized query service' , function() {
                it('passing in options.url = "www.google.com" should make the next call with a base url of www.google.com', function() {
                    var overrideURL = 'www.google.com';

                    httpBackend.when('GET', overrideURL).respond(fixtures.api.test.pageOne);

                    mockFactory.get({
                        preventDefaultParams: true,
                        url: overrideURL
                    });

                    rootScope.currentUser.deferred.resolve();
                    httpBackend.flush();

                    expect(mockFactory.url).toEqual('http://127.0.0.1/test');
                });
            });

            describe('get({method: ""}) options check against the generalized query service' , function() {
                it('passing in options.method = "post" should make the next call with POST', function() {
                    httpBackend.when('POST', mockFactory.url + '?page=0&size=20&accountId=1-21AYVOT&accountLevel=GLOBAL').respond(fixtures.api.test.itemOne);

                    mockFactory.get({
                        method: 'post'
                    });

                    rootScope.currentUser.deferred.resolve();
                    httpBackend.flush();

                    expect(mockFactory.url).toEqual('http://127.0.0.1/test');
                });
            });

            describe('get({page: 1, size: 20}) options check against the generalized query service' , function() {
                it('passing in options.page = 2 should make a call for the second page and update our params', function() {
                    mockFactory.get({
                        page: 1,
                        size: 20
                    });
                    
                    rootScope.currentUser.deferred.resolve();
                    httpBackend.flush();

                    expect(mockFactory.url).toEqual('http://127.0.0.1/test');
                    expect(mockFactory.params.page).toEqual(1);
                    expect(mockFactory.params.size).toEqual(20);
                });
            });

            describe('buildUrl(stringUrl, params)', function(){
                it('should provide the same url passed in if no required params and no additional params passed in',
                    function() {
                    var url = 'http://www.google.com',
                    requiredParams = undefined,
                    additonalParams = undefined,
                    result = mockFactory.buildUrl(url, requiredParams);

                    expect(result).toEqual('http://www.google.com');
                });

                it('should provide the same url passed in if no required params and no additional params passed in',
                    function() {
                    var url = 'http://www.google.com',
                    requiredParams = null,
                    additonalParams = null,
                    result = mockFactory.buildUrl(url, requiredParams);

                    expect(result).toEqual('http://www.google.com');
                });

                it('should provide the new url passed in  required params, sort is empty and no additional params passed in',
                    function() {
                    var url='http://www.google.com';
                    requiredParams = {
                        sort: null,
                        size: 40,
                        page: 3
                    },
                    additonalParams = undefined,
                    result = mockFactory.buildUrl(url, requiredParams);

                    expect(result).toEqual('http://www.google.com?size=40&page=3');
                });

                it('should provide the new url passed in required params object, sort filled out and no additional params passed in',
                    function( ){
                    var url='http://www.google.com',
                    requiredParams = {
                        sort: 'green:Desc',
                        size: 40,
                        page: 3
                    },
                    result = mockFactory.buildUrl(url, requiredParams);

                    expect(result).toEqual('http://www.google.com?sort=green:Desc&size=40&page=3');
                });

                it('should provide the new url passed in required params, sort filled out and additional params passed in',
                    function() {
                    var url='http://www.google.com',
                    requiredParams = {
                        sort: 'green:Desc',
                        size: 40,
                        page: 3
                    },
                    result = mockFactory.buildUrl(url, requiredParams);

                    expect(result).toEqual('http://www.google.com?sort=green:Desc&size=40&page=3');
                });

                it('should provide the new url passed in required params is empty out and additional params passed in',
                    function() {
                    var url='http://www.google.com',
                    requiredParams = undefined,
                    result = mockFactory.buildUrl(url, requiredParams);

                    expect(result).toEqual('http://www.google.com');
                });
            });
        });
    }
);

define(['angular', 'angular-mocks', 'filterSearch', 'hateoasFactory'], function(angular, mocks) {
     describe('Filter Search Module', function() {
        beforeEach(module('mps'));
        describe('FilterSearchService', function(){
             var mockFactory, scope, rootScope, personal;
            beforeEach(inject(['$rootScope', 'HATEOASFactory', 'PersonalizationServiceFactory',
             function($rootScope, HATEOASFactory, Personalize){
                scope = $rootScope.$new();
                rootScope = $rootScope.$new();
                personal = new Personalize('/',0);
                scope.optionParams = {};
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
                mockFactory = new HATEOASFactory(hateaosConfig);
            }]));
            describe('Constructor', function(){
                it('should setup with all values', inject(['FilterSearchService', function(FilterSearchService){
                    var filterSearch = new FilterSearchService(mockFactory, scope, rootScope, personal,'catColumnSet');
                    expect(filterSearch).toBeDefined();
                    expect(filterSearch.service).toBeDefined();
                    expect(filterSearch.display).toBeDefined();
                    expect(filterSearch.failure).toBeDefined();
                    expect(filterSearch.columnSet).toBeDefined();
                    expect(filterSearch.personalization).toBeDefined();

                    expect(filterSearch.addBasicFilter).toBeDefined();
                    expect(filterSearch.addPanelFilter).toBeDefined();
                    expect(filterSearch.clearParameters).toBeDefined();

                    expect(scope.searchFunctionDef).toBeDefined();
                    expect(scope.optionParams).toBeDefined();
                    expect(scope.filterOptions).toBeDefined();
                    expect(scope.visibleColumns).toBeDefined();
                    expect(scope.gridOptions).toBeDefined();
                    expect(scope.gridOptions.onRegisterApi).toBeDefined();
                }]));
                 it('should setup with all values execpt columnSet', inject(['FilterSearchService', function(FilterSearchService){
                    var filterSearch = new FilterSearchService(mockFactory, scope, rootScope, personal);
                    expect(filterSearch).toBeDefined();
                    expect(filterSearch.service).toBeDefined();
                    expect(filterSearch.display).toBeDefined();
                    expect(filterSearch.failure).toBeDefined();
                    expect(filterSearch.columnSet).not.toBeDefined();
                    expect(filterSearch.personalization).toBeDefined();

                    expect(filterSearch.addBasicFilter).toBeDefined();
                    expect(filterSearch.addPanelFilter).toBeDefined();
                    expect(filterSearch.clearParameters).toBeDefined();

                    expect(scope.searchFunctionDef).toBeDefined();
                    expect(scope.optionParams).toBeDefined();
                    expect(scope.filterOptions).toBeDefined();
                    expect(scope.visibleColumns).toBeDefined();
                    expect(scope.gridOptions).toBeDefined();
                    expect(scope.gridOptions.onRegisterApi).toBeDefined();
                }]));
                it('should throw exception if personalization is not setup', inject(['FilterSearchService', function(FilterSearchService){
                    var message = "Grid Options onRegisterAPI was not setup, possibly missing rootScope, Service Definition or Personalization";
                    expect(function() { new FilterSearchService(mockFactory, scope, rootScope, undefined,'catColumnSet'); }).toThrow(new Error(message));
                }]));
                it('should throw exception if rootScope is not setup', inject(['FilterSearchService', function(FilterSearchService){
                    var message = "Grid Options onRegisterAPI was not setup, possibly missing rootScope, Service Definition or Personalization";
                    expect(function() { new FilterSearchService(mockFactory, scope, undefined, personal,'catColumnSet'); }).toThrow(new Error(message));
                }]));
                it('should throw an exception if serviceDefinition is not passed in', inject(['FilterSearchService', function(FilterSearchService){
                    var message = "Service Definition is Required!";
                    expect(function() { new FilterSearchService(undefined, scope, rootScope, personal,'catColumnSet'); }).toThrow(new Error(message));
                }]));
                it('should throw an exception if serviceDefinition is not a HATEAOSFactory service', inject(['FilterSearchService', function(FilterSearchService){
                    var message = "Only Services of type HATEOASFactory allowed!";
                    expect(function() { new FilterSearchService({}, scope, rootScope, personal,'catColumnSet'); }).toThrow(new Error(message));
                }]));
                it('should throw exception if scope is not setup', inject(['FilterSearchService', function(FilterSearchService){
                    var message = "Scope is required!";
                    expect(function() { new FilterSearchService(mockFactory, undefined, rootScope, personal,'catColumnSet'); }).toThrow(new Error(message));
                }]));
            });
            describe('addBasicFilter', function(){
                it('should throw exception if display text is missing', inject(['FilterSearchService', function(FilterSearchService){
                    var message = 'DisplayText is required';
                    var filterSearch = new FilterSearchService(mockFactory, scope, rootScope, personal,'catColumnSet');
                    expect(function() { filterSearch.addBasicFilter(); }).toThrow(new Error(message));

                }]));
                it('should add a single filter with display text and parameters', inject(['FilterSearchService', function(FilterSearchService){
                    var filterSearch = new FilterSearchService(mockFactory, scope, rootScope, personal,'catColumnSet');
                    filterSearch.addBasicFilter('Test',{'cat':'dog'});
                    expect(scope.filterOptions).toBeDefined();
                    expect(scope.filterOptions.length).toBe(1);
                    expect(scope.filterOptions[0]).toBeDefined();
                    expect(scope.filterOptions[0].display).toBe('Test');
                    expect(scope.filterOptions[0].params).toBeDefined();
                    expect(scope.filterOptions[0].functionDef).toBeDefined();
                }]));
                it('should add a single filter with display text and parameters', inject(['FilterSearchService','$q',
                 function(FilterSearchService, $q){
                    var filterSearch = new FilterSearchService(mockFactory, scope, rootScope, personal,'catColumnSet');
                    filterSearch.addBasicFilter('Test',{'cat':'dog'});
                    expect(scope.filterOptions).toBeDefined();
                    expect(scope.filterOptions.length).toBe(1);
                    expect(scope.filterOptions[0]).toBeDefined();
                    expect(scope.filterOptions[0].functionDef).toBeDefined();

                    spyOn(filterSearch.service, 'getPage').and.callFake(
                        function(item1, item2, item3){
                            expect(item1).toBe(0);
                            expect(item2).toBe(20);
                            expect(item3).toBeDefined();
                            expect(item3.params).toBeDefined();
                            expect(item3.params.cat).toBeDefined();
                            expect(item3.params.cat).toBe('dog');
                            return $q.defer().promise;
                        }
                    );
                    scope.filterOptions[0].functionDef({});
                }]));
                it('should add a single filter with display text and parameters and incoming params is added', inject(['FilterSearchService','$q',
                 function(FilterSearchService, $q){
                    var filterSearch = new FilterSearchService(mockFactory, scope, rootScope, personal,'catColumnSet');
                    filterSearch.addBasicFilter('Test',{'cat':'dog'});
                    expect(scope.filterOptions).toBeDefined();
                    expect(scope.filterOptions.length).toBe(1);
                    expect(scope.filterOptions[0]).toBeDefined();
                    expect(scope.filterOptions[0].functionDef).toBeDefined();

                    spyOn(filterSearch.service, 'getPage').and.callFake(
                        function(item1, item2, item3){
                            expect(item1).toBe(0);
                            expect(item2).toBe(20);
                            expect(item3).toBeDefined();
                            expect(item3.params).toBeDefined();
                            expect(item3.params.cat).toBeDefined();
                            expect(item3.params.cat).toBe('dog');
                            expect(item3.params.bird).toBeDefined();
                            expect(item3.params.bird).toBe('snake');
                            return $q.defer().promise;
                        }
                    );
                    scope.filterOptions[0].functionDef({'bird':'snake'});
                }]));
                it('should add a single filter with display text and no configuredParams', inject(['FilterSearchService','$q',
                 function(FilterSearchService, $q){
                    var filterSearch = new FilterSearchService(mockFactory, scope, rootScope, personal,'catColumnSet');
                    filterSearch.addBasicFilter('Test');
                    expect(scope.filterOptions).toBeDefined();
                    expect(scope.filterOptions.length).toBe(1);
                    expect(scope.filterOptions[0]).toBeDefined();
                    expect(scope.filterOptions[0].functionDef).toBeDefined();

                    spyOn(filterSearch.service, 'getPage').and.callFake(
                        function(item1, item2, item3){
                            expect(item1).toBe(0);
                            expect(item2).toBe(20);
                            expect(item3).toBeDefined();
                            expect(item3.params).toBeDefined();
                            expect(item3.params.cat).not.toBeDefined();
                            expect(item3.params.bird).toBeDefined();
                            expect(item3.params.bird).toBe('snake');
                            return $q.defer().promise;
                        }
                    );
                    scope.filterOptions[0].functionDef({'bird':'snake'});
                }]));
            });
            describe('addPanelFilter', function(){
                it('should throw exception if display text is missing', inject(['FilterSearchService', function(FilterSearchService){
                    var message = 'DisplayText is required';
                    var filterSearch = new FilterSearchService(mockFactory, scope, rootScope, personal,'catColumnSet');
                    expect(function() { filterSearch.addPanelFilter(undefined, 'somePanel', {'cat':'dog'}); }).toThrow(new Error(message));

                }]));
                it('should throw exception if display text is missing', inject(['FilterSearchService', function(FilterSearchService){
                    var message = 'OptionsPanel is required';
                    var filterSearch = new FilterSearchService(mockFactory, scope, rootScope, personal,'catColumnSet');
                    expect(function() { filterSearch.addPanelFilter('Test'); }).toThrow(new Error(message));

                }]));
                it('should add a single filter with display text, optionsPanel and parameters', inject(['FilterSearchService', function(FilterSearchService){
                    var filterSearch = new FilterSearchService(mockFactory, scope, rootScope, personal,'catColumnSet');
                    filterSearch.addPanelFilter('Test', 'somePanel', {'cat':'dog'});
                    expect(scope.filterOptions).toBeDefined();
                    expect(scope.filterOptions.length).toBe(1);
                    expect(scope.filterOptions[0]).toBeDefined();
                    expect(scope.filterOptions[0].display).toBe('Test');
                    expect(scope.filterOptions[0].params).toBeDefined();
                    expect(scope.filterOptions[0].functionDef).toBeDefined();
                    expect(scope.filterOptions[0].optionsPanel).toBeDefined();
                    expect(scope.filterOptions[0].optionsPanel).toBe('somePanel');
                }]));
                it('should add a single filter with display text and parameters', inject(['FilterSearchService','$q',
                 function(FilterSearchService, $q){
                    var filterSearch = new FilterSearchService(mockFactory, scope, rootScope, personal,'catColumnSet');
                    filterSearch.addPanelFilter('Test', 'somePanel', {'cat':'dog'});
                    expect(scope.filterOptions).toBeDefined();
                    expect(scope.filterOptions.length).toBe(1);
                    expect(scope.filterOptions[0]).toBeDefined();
                    expect(scope.filterOptions[0].functionDef).toBeDefined();
                    expect(scope.filterOptions[0].optionsPanel).toBeDefined();
                    expect(scope.filterOptions[0].optionsPanel).toBe('somePanel');

                    spyOn(filterSearch.service, 'getPage').and.callFake(
                        function(item1, item2, item3){
                            expect(item1).toBe(0);
                            expect(item2).toBe(20);
                            expect(item3).toBeDefined();
                            expect(item3.params).toBeDefined();
                            expect(item3.params.cat).toBeDefined();
                            expect(item3.params.cat).toBe('dog');
                            return $q.defer().promise;
                        }
                    );
                    scope.filterOptions[0].functionDef({});
                }]));
                it('should add a single filter with display text and parameters and incoming params is added', inject(['FilterSearchService','$q',
                 function(FilterSearchService, $q){
                    var filterSearch = new FilterSearchService(mockFactory, scope, rootScope, personal,'catColumnSet');
                    filterSearch.addPanelFilter('Test', 'somePanel', {'cat':'dog'});
                    expect(scope.filterOptions).toBeDefined();
                    expect(scope.filterOptions.length).toBe(1);
                    expect(scope.filterOptions[0]).toBeDefined();
                    expect(scope.filterOptions[0].functionDef).toBeDefined();
                    expect(scope.filterOptions[0].optionsPanel).toBeDefined();
                    expect(scope.filterOptions[0].optionsPanel).toBe('somePanel');

                    spyOn(filterSearch.service, 'getPage').and.callFake(
                        function(item1, item2, item3){
                            expect(item1).toBe(0);
                            expect(item2).toBe(20);
                            expect(item3).toBeDefined();
                            expect(item3.params).toBeDefined();
                            expect(item3.params.cat).toBeDefined();
                            expect(item3.params.cat).toBe('dog');
                            expect(item3.params.bird).toBeDefined();
                            expect(item3.params.bird).toBe('snake');
                            return $q.defer().promise;
                        }
                    );
                    scope.filterOptions[0].functionDef({'bird':'snake'});
                }]));
                it('should add a single filter with display text and no configuredParams', inject(['FilterSearchService','$q',
                 function(FilterSearchService, $q){
                    var filterSearch = new FilterSearchService(mockFactory, scope, rootScope, personal,'catColumnSet');
                    filterSearch.addPanelFilter('Test', 'somePanel');
                    expect(scope.filterOptions).toBeDefined();
                    expect(scope.filterOptions.length).toBe(1);
                    expect(scope.filterOptions[0]).toBeDefined();
                    expect(scope.filterOptions[0].functionDef).toBeDefined();
                    expect(scope.filterOptions[0].optionsPanel).toBeDefined();
                    expect(scope.filterOptions[0].optionsPanel).toBe('somePanel');

                    spyOn(filterSearch.service, 'getPage').and.callFake(
                        function(item1, item2, item3){
                            expect(item1).toBe(0);
                            expect(item2).toBe(20);
                            expect(item3).toBeDefined();
                            expect(item3.params).toBeDefined();
                            expect(item3.params.cat).not.toBeDefined();
                            expect(item3.params.bird).toBeDefined();
                            expect(item3.params.bird).toBe('snake');
                            return $q.defer().promise;
                        }
                    );
                    scope.filterOptions[0].functionDef({'bird':'snake'});
                }]));
            });
           describe('clearParameters', function(){
                it('should clear parameters', inject(['FilterSearchService',function(FilterSearchService){
                     var filterSearch = new FilterSearchService(mockFactory, scope, rootScope, personal,'catColumnSet');
                     filterSearch.service.params.cat = 'dog';
                     expect(filterSearch.service.params).toBeDefined();
                     expect(filterSearch.service.params.cat).toBeDefined();
                     filterSearch.clearParameters(['cat']);

                     expect(filterSearch.service.params).toBeDefined();
                     expect(filterSearch.service.params.cat).not.toBeDefined();
                }]));
                it('should clear parameters longer list', inject(['FilterSearchService',function(FilterSearchService){
                     var filterSearch = new FilterSearchService(mockFactory, scope, rootScope, personal,'catColumnSet');
                     filterSearch.service.params.cat = 'dog';
                     filterSearch.service.params.bird = 'snake';
                     expect(filterSearch.service.params).toBeDefined();
                     expect(filterSearch.service.params.cat).toBeDefined();
                     expect(filterSearch.service.params.bird).toBeDefined();
                     filterSearch.clearParameters(['cat','bird']);

                     expect(filterSearch.service.params).toBeDefined();
                     expect(filterSearch.service.params.cat).not.toBeDefined();
                     expect(filterSearch.service.params.bird).not.toBeDefined();
                }]));
                it('should not clear parameters if array is empty', inject(['FilterSearchService',function(FilterSearchService){
                     var filterSearch = new FilterSearchService(mockFactory, scope, rootScope, personal,'catColumnSet');
                     filterSearch.service.params.cat = 'dog';
                     filterSearch.service.params.bird = 'snake';
                     expect(filterSearch.service.params).toBeDefined();
                     expect(filterSearch.service.params.cat).toBeDefined();
                     expect(filterSearch.service.params.bird).toBeDefined();
                     filterSearch.clearParameters([]);

                     expect(filterSearch.service.params).toBeDefined();
                     expect(filterSearch.service.params.cat).toBeDefined();
                     expect(filterSearch.service.params.bird).toBeDefined();
                }]));
                it('should not clear parameters if array is undefined/null', inject(['FilterSearchService',function(FilterSearchService){
                     var filterSearch = new FilterSearchService(mockFactory, scope, rootScope, personal,'catColumnSet');
                     filterSearch.service.params.cat = 'dog';
                     filterSearch.service.params.bird = 'snake';
                     expect(filterSearch.service.params).toBeDefined();
                     expect(filterSearch.service.params.cat).toBeDefined();
                     expect(filterSearch.service.params.bird).toBeDefined();
                     filterSearch.clearParameters();

                     expect(filterSearch.service.params).toBeDefined();
                     expect(filterSearch.service.params.cat).toBeDefined();
                     expect(filterSearch.service.params.bird).toBeDefined();
                }]));

            });
        });
        describe('gridFilterController', function(){
            var mockedGridFilterController, scope;
            beforeEach(inject(['$rootScope','$controller', function($rootScope, $controller){
                scope = $rootScope.$new();
                scope.optionParams = {};
            }]));
            describe('selectedFilter', function(){
                it('should perform a function call if options panel is not selected',
                    inject(['$controller', function($controller){
                        var called = false;
                        scope.options = [
                            {
                                display:'CAT is DOG',
                                functionDef: function(params){
                                    var options  = {
                                        'params':{
                                          'type': 'CAT IS DOG'
                                        }
                                    };
                                    called = true;
                                },
                                params: scope.optionParams
                            }
                        ];
                        mockedGridFilterController = $controller('GridFilterController',{$scope: scope});
                        expect(scope.selectedFilter).toBeDefined();
                        scope.selectedFilter(scope.options[0]);
                        expect(called).toBe(true);
                    }])
                );
                it('should perform a optionPanel setup',
                    inject(['$controller', function($controller){
                        var called = false;
                        scope.options = [
                            {
                                display:'CAT is DOG',
                                optionsPanel: 'CAT',
                                functionDef: function(params){
                                    var options  = {
                                        'params':{
                                          'type': 'CAT IS DOG'
                                        }
                                    };
                                    called = true;
                                },
                                params: scope.optionParams
                            }
                        ];
                        expect(undefined).toEqual(scope.currentFilterPanel);
                        mockedGridFilterController = $controller('GridFilterController',{$scope: scope});
                        expect(scope.selectedFilter).toBeDefined();
                        scope.selectedFilter(scope.options[0]);
                        expect('CAT').toEqual(scope.currentFilterPanel);
                    }])
                );

            });
            it('should have filterBy and selectedFiltered called if options is not empty',
                    inject(['$controller', function($controller){
                        scope.options = [
                            {
                                display:'CAT is DOG',
                                optionsPanel: 'CAT',
                                functionDef: function(params){
                                    var options  = {
                                        'params':{
                                          'type': 'CAT IS DOG'
                                        }
                                    };
                                    called = true;
                                },
                                params: scope.optionParams
                            }
                        ];
                        expect(undefined).toEqual(scope.filterBy);
                        mockedGridFilterController = $controller('GridFilterController',{$scope: scope});
                        scope.selectedFilter(scope.options[0]);
                        expect('CAT is DOG').toEqual(scope.filterBy);
                    }])
                );
        });
        describe('gridSearchController', function(){
             var mockedGridSearchController, scope;
            beforeEach(inject(['$rootScope','$controller', function($rootScope, $controller){
                scope = $rootScope.$new();
                scope.optionParams = {};
            }]));
            describe('gridSearch', function(){
                it('should call search external function and setup params',
                    inject(['$controller', function($controller){
                        var called = false;
                        var params = undefined;
                        scope.columns = [
                            { dispaly: 'CAT', field: 'cat'},
                            { display: 'DOG', field: 'dog'}
                        ];
                        scope.params = {};
                        scope.search = function(options){
                            called = true;
                            params = options;
                        };
                        mockedGridSearchController = $controller('GridSearchController',{$scope: scope});
                        scope.searchByValue = 'CAT';
                        scope.searchBy = 'IS COOL';
                        scope.gridSearch();
                        expect(called).toBe(true);
                        expect(params).toBeDefined();
                        expect(params.search).toBeDefined();
                        expect(params.searchOn).toBeDefined();
                        expect(params.search).toBe('CAT');
                        expect(params.searchOn).toBe('IS COOL');
                }])
                );
                it('should call search external function and setup params even if search is empty',
                    inject(['$controller', function($controller){
                        var called = false;
                        var params = undefined;
                        scope.columns = [
                            { dispaly: 'CAT', field: 'cat'},
                            { display: 'DOG', field: 'dog'}
                        ];
                        scope.params = {};
                        scope.search = function(options){
                            called = true;
                            params = options;
                        };
                        mockedGridSearchController = $controller('GridSearchController',{$scope: scope});
                        scope.searchByValue = '';
                        scope.searchBy = 'IS COOL';
                        scope.gridSearch();
                        expect(called).toBe(true);
                        expect(params).toBeDefined();
                        expect(params.search).not.toBeDefined();
                        expect(params.searchOn).not. toBeDefined();
                }])
                );
                it('should not call search external function if searchBy is not defined',
                    inject(['$controller', function($controller){
                        var called = false;
                        var params = undefined;
                        scope.columns = [
                            { dispaly: 'CAT'},
                            { display: 'DOG', field: 'dog'}
                        ];
                        scope.params = {};
                        scope.search = function(options){
                            called = true;
                            params = options;
                        };
                        mockedGridSearchController = $controller('GridSearchController',{$scope: scope});
                        scope.gridSearch();
                        expect(called).toBe(true);
                        expect(params).toBeDefined();
                        expect(params.search).not.toBeDefined();
                        expect(params.searchOn).not. toBeDefined();
                    }])
                );
            });
            describe('searchByColumn', function(){
                 it('should store searchBy Column',
                    inject(['$controller', function($controller){
                        scope.columns = [
                            { dispaly: 'CAT', searchOn: 'cat'},
                            { display: 'DOG', searchOn: 'dog'}
                        ];
                        scope.params = {};
                        mockedGridSearchController = $controller('GridSearchController',{$scope: scope});
                        scope.searchByColumn(scope.columns[1]);
                        expect(scope.searchBy).toBeDefined();
                        expect(scope.searchBy).toBe('dog');
                }])
                );
            });
            it('should display first selected column',
                    inject(['$controller', function($controller){
                         var called = false;
                        var params = undefined;
                        scope.columns = [
                            { dispaly: 'COW', searchOn: 'cow'},
                            { display: 'DOG', searchOn: 'dog'}
                        ];
                        scope.params = {};
                        scope.search = function(options){
                            called = true;
                            params = options;
                        };
                        mockedGridSearchController = $controller('GridSearchController',{$scope: scope});
                        expect(scope.searchBy).toBe('cow');
                }])
                );

        });
        describe('CHLFilterController', function(){
             var mockedCHLFilterController, scope;
            beforeEach(inject(['$rootScope', function($rootScope){
                scope = $rootScope.$new();
                scope.optionParams = {};
            }]));
            describe('chlFilter', function(){
                it('should create a comma delimited list and call a function', inject(['$controller',
                    function($controller){
                         var csv = 'apple,banana,pear';
                         var array = ['apple', 'banana', 'pear'];
                         var expected = undefined;
                         var called = false;
                         scope.params = {};
                         scope.filterDef = function(params){
                            called = true;
                            expected = params;
                         };
                        mockedCHLFilterController = $controller('CHLFilterController',{$scope: scope});
                        expect(scope.chlFilter).toBeDefined();
                        expect(scope.filterDef).toBeDefined();
                        expect(scope.params).toBeDefined();

                        scope.chlFilter(array);

                        expect(called).toBe(true);
                        expect(expected.chlFilter).toBeDefined();
                        expect(expected.chlFilter).toBe(csv);
                }])
                );
                it('should  not create a comma delimited list and call a function because function call is missing',
                    inject(['$controller',
                    function($controller){
                         var csv = 'apple,banana,pear';
                         var array = ['apple', 'banana', 'pear'];
                         var expected = undefined;
                         var called = false;
                         scope.params = {};
                         scope.filterDef = undefined;
                        mockedCHLFilterController = $controller('CHLFilterController',{$scope: scope});
                        expect(scope.chlFilter).toBeDefined();
                        expect(scope.filterDef).not.toBeDefined();
                        expect(scope.params).toBeDefined();

                        scope.chlFilter(array);

                        expect(called).toBe(false);
                        expect(expected).not.toBeDefined();
                }])
                );
                it('should  not create a comma delimited list and call a function because function call is not a function',
                    inject(['$controller',
                    function($controller){
                         var csv = 'apple,banana,pear';
                         var array = ['apple', 'banana', 'pear'];
                         var expected = undefined;
                         var called = false;
                         scope.params = {};
                         scope.filterDef = 'cat';
                        mockedCHLFilterController = $controller('CHLFilterController',{$scope: scope});
                        expect(scope.chlFilter).toBeDefined();
                        expect(scope.filterDef).toBeDefined();
                        expect(scope.params).toBeDefined();

                        scope.chlFilter(array);

                        expect(called).toBe(false);
                        expect(expected).not.toBeDefined();
                }])
                );
                it('should  not create a comma delimited list and call a function because selected list is undefined',
                 inject(['$controller',
                    function($controller){
                         var csv = 'apple,banana,pear';
                         var array = undefined;
                         var expected = undefined;
                         var called = false;
                         scope.params = {};
                         scope.filterDef = function(params){
                            called = true;
                            expected = params;
                         };
                        mockedCHLFilterController = $controller('CHLFilterController',{$scope: scope});
                        expect(scope.chlFilter).toBeDefined();
                        expect(scope.filterDef).toBeDefined();
                        expect(scope.params).toBeDefined();

                        scope.chlFilter(array);

                        expect(called).toBe(false);
                        expect(expected).not.toBeDefined();
                }])
                );
                it('should  not create a comma delimited list and should call function because selected list has zero items',
                 inject(['$controller',
                    function($controller){
                         var csv = '';
                         var array = [];
                         var expected = undefined;
                         var called = false;
                         scope.params = {};
                         scope.filterDef = function(params){
                            called = true;
                            expected = params;
                         };
                        mockedCHLFilterController = $controller('CHLFilterController',{$scope: scope});
                        expect(scope.chlFilter).toBeDefined();
                        expect(scope.filterDef).toBeDefined();
                        expect(scope.params).toBeDefined();

                        scope.chlFilter(array);

                        expect(called).toBe(true);
                        expect(expected).toBeDefined();
                        expect(expected.chlFilter).toBe(csv);
                }])
                );
            });
        });
     });
});

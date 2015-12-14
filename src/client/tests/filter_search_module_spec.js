define(['angular', 'angular-mocks', 'filterSearch'], function(angular, mocks) {
     describe('Filter Search Module', function() {
        beforeEach(module('mps'));

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
                        expect(params.search).toBeDefined();
                        expect(params.searchOn).toBeDefined();
                        expect(params.search).toBe('');
                        expect(params.searchOn).toBe('IS COOL');
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
                        expect(called).toBe(false);
                        expect(params).not.toBeDefined();
                    }])
                );
            });
            describe('searchByColumn', function(){
                 it('should store searchBy Column',
                    inject(['$controller', function($controller){
                        scope.columns = [
                            { dispaly: 'CAT', field: 'cat'},
                            { display: 'DOG', field: 'dog'}
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
                            { dispaly: 'COW', field: 'cow'},
                            { display: 'DOG', field: 'dog'}
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

define(['angular','angular-mocks', 'fixtures', 'utility.grid'], function(angular, mocks, fixtures) {
    describe('columnpicker directive', function() {
        var ele,
        scope,
        mockService,
        mockGrid,
        compile;

        beforeEach(module('mps'));

        beforeEach(inject(function($rootScope, $compile, HATEOASFactory) {
            var serviceDef = fixtures.services.test;

            scope = $rootScope;
            compile = $compile;

            mockService = new HATEOASFactory(serviceDef);
            mockService.url = 'http://127.0.0.1/test';
            mockService.data = fixtures.api.test.pageTwo._embedded.test;

            scope.gridOptions = {

            }

            ele = compile('<div columnpicker></div>')(scope);
        }));

        beforeEach(inject(['grid', function(Grid) {
            mockGrid = Grid;
        }]));

        it('is setup by broadcasting setupColumnPicker', function () {
            
            mockGrid.display(mockService, scope);

            scope.$broadcast('setupColumnPicker', mockGrid);

            expect(ele.html()).toContain('dropdown');
        });

        it('should have a listing of available columns', function () {           
            mockGrid.display(mockService, scope);

            scope.$broadcast('setupColumnPicker', mockGrid);

            expect(ele.html()).toContain('data-column-count="3"');
        });
    });
});

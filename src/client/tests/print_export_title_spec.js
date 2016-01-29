define(['angular', 'angular-mocks', 'fixtures', 'utility.grid', 'utility.printExportTitleController'], function(angular, mocks, fixtures) {
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

            scope.gridOptions = {};

            ele = compile('<div print-export-title title="ADDRESS.BOOK"></div>')(scope);
        }));

        beforeEach(inject(['grid', function(Grid) {
            mockGrid = new Grid();
        }]));

        it('is setup by broadcasting setupPrintAndExport', function () {
            mockGrid.display(mockService, scope);

            scope.$broadcast('setupPrintAndExport', scope);

            expect(ele.html()).toContain('print-export-header');
        });
    });
});

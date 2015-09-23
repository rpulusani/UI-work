define(['angular','angular-mocks', 'utility.gridService'], function(angular, mocks, gridService) {
    describe('Grid Service  Utility Module', function() {
        beforeEach(module('mps'));
            var scope, mockedAddressesFactory;
            beforeEach(function(){
                mockedAddressesFactory = {
                    getColumnDefinition: function(type){
                        return {'defaultSet':[] };
                    },
                    page: {
                            "size" : 20,
                            "totalElements" : 39,
                            "totalPages" : 2,
                            "number" : 0
                        }
                };
                module(function($provide) {
                    $provide.value('Addresses', mockedAddressesFactory);
                });
            });

            beforeEach(inject(function($rootScope) {
                scope = $rootScope.$new();
            }));
        describe('GridOptions', function() {
            it('should validates that a service exists with the expected functions', function(){
                /*gridService.getGridOptions(mockedAddressesFactory, '').then(
                    function(options){
                        $timeout.flush();
                        console.log("timed out!");
                        expect(options).toBeDefined();
                        expect(options.enableRowSelection).toBe(true);

                    }
                );*/
            });
        });
        describe('Pagination', function() {
             describe('pageArray', function() {
             });
             describe('totalItems', function() {
                /*it('should have no items', function(){
                    mockedAddressesFactory.page.totalItems = 0;
                    console.log(mockedAddressesFactory);
                    console.log(gridService);
                    var pagination = gridService.pagination(mockedAddressesFactory, scope);
                    expect(pagination.totalItems()).toEqual(-1);
                });*/
             });
             describe('pageSize', function() {
             });
             describe('totalPages', function() {
             });
             describe('currentPage', function() {
             });
             describe('isCurrent', function() {
             });
             describe('canNotPrev', function() {
             });
             describe('canNotNext', function() {
             });
             describe('gotoPage', function() {
             });
             describe('nextPage', function() {
             });
             describe('prevPage', function() {
             });
        });
    });
});

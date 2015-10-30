define(['angular', 'angular-mocks', 'utility.grid'], function(angular, mocks, Grid) {
    describe('Grid Service Utility Module', function() {
            var scope, mockedAddressesFactory, grid;

            beforeEach(module('mps'));

            beforeEach(inject(function($rootScope, HATEAOSFactory, Grid) {
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
                    columnDefs: {
                        testCol: [
                            {'name': 'test', 'field': 'test'}
                        ]
                    },
                    route: '',
                    getColumnDefinition: function(type){
                        return {'defaultSet': []};
                    },
                    page: {
                        "size" : 20,
                        "totalElements" : 39,
                        "totalPages" : 2,
                        "number" : 0
                    }
                };

                mockedAddressesFactory =  new HATEAOSFactory(hateaosConfig);

                scope = $rootScope.$new();
            }));

            beforeEach(inject(['grid', function(Grid){
                gridService = Grid;
            }]));

            describe('setColumnDefaults()', function() {
                it('should return an array of columns', function() {
                    var columns;

                    spyOn(gridService, 'setColumnDefaults').and.callThrough();

                    columns = gridService.setColumnDefaults(mockedAddressesFactory);

                    expect(mockedAddressesFactory.columns).toEqual('defaultSet');
                    expect(columns.length).toEqual(5);
                });

                it('should return an array of columns that we define', function() {
                    var columns;

                    spyOn(gridService, 'setColumnDefaults').and.callThrough();

                    mockedAddressesFactory.columns = 'testCol';

                    columns = gridService.setColumnDefaults(mockedAddressesFactory);

                    expect(mockedAddressesFactory.columns).toEqual('testCol');
                    expect(columns.length).toEqual(1);
                });
            });

            describe('getCurrentEntityId', function() {
                it('should return null', function(){
                    var result = gridService.getCurrentEntityId(undefined);
                    expect(result).toEqual(null);
                });
                it('should return null', function(){
                    var result = gridService.getCurrentEntityId(null);
                    expect(result).toEqual(null);
                });
                
                it('should return null', function(){
                    var row = {

                    };
                    var result = gridService.getCurrentEntityId(row);
                    expect(result).toEqual(null);
                });
                it('should return null', function(){
                    var row = {
                        entity: {

                        }
                    };
                    var result = gridService.getCurrentEntityId(row);
                    expect(result).toEqual(null);
                });
                it('should return null', function(){
                    var row = {
                        entity:{
                            id: null
                        }
                    };
                    var result = gridService.getCurrentEntityId(row);
                    expect(result).toEqual(null);
                });
               it('should not return null but return the id', function(){
                    var row = {
                        entity:{
                            id: 5
                        }
                    };
                    var result = gridService.getCurrentEntityId(row);
                    expect(result).toEqual(5);
                });
            });

            describe('GridOptions', function() {
                it('should validates that a service exists with the expected functions', function(){

                });
            });

        describe('Pagination', function() {
             describe('validatePaginationDataExists', function(){
                it(' should return false for undefined Service',function(){
                    var pagination = gridService.pagination(undefined, undefined, undefined);
                    expect(pagination.validatePaginationDataExists()).toBe(false);
                });
                it(' should return false for null Service',function(){
                    var pagination = gridService.pagination(null, undefined, undefined);
                    expect(pagination.validatePaginationDataExists()).toBe(false);
                });
                it(' should return true for defined Service and defined page',function(){
                    var service = {
                        page:'blah'
                    };
                    var pagination = gridService.pagination(service, undefined, undefined);
                    expect(pagination.validatePaginationDataExists()).toBe(true);
                });
                it(' should return false for defined Service and undefined page',function(){
                    var service = {
                    };
                    var pagination = gridService.pagination(service, undefined, undefined);
                    expect(pagination.validatePaginationDataExists()).toBe(false);
                });
                it(' should return false for defined Service and null page',function(){
                    var service = {
                        page: null
                    };
                    var pagination = gridService.pagination(service, undefined, undefined);
                    expect(pagination.validatePaginationDataExists()).toBe(false);
                });
             });
            describe('pageProps', function(){
                it('should show a length of 3 and a page of 0 with a current page of 0', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 3;
                    mock.page.number = 0;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageProps()).toEqual({page: 0, length: 3});
                });
                it('should show a length of 5 and a page of 0 with a current page of 0', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 10;
                    mock.page.number = 0;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageProps()).toEqual({page: 0, length: 5});
                });
                it('should show a length of 5 and a page of 0 with a current page of 1', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 10;
                    mock.page.number = 1;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageProps()).toEqual({page: 0, length: 5});
                });
                it('should show a length of 5 and a page of 0 with a current page of 2', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 10;
                    mock.page.number = 2;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageProps()).toEqual({page: 0, length: 5});
                });
                it('should show a length of 6 and a page of 1 with a current page of 3', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 10;
                    mock.page.number = 3;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageProps()).toEqual({page: 1, length: 6});
                });
                it('should show a length of 7 and a page of 2 with a current page of 4', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 10;
                    mock.page.number = 4;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageProps()).toEqual({page: 2, length: 7});
                });
                it('should show a length of 8 and a page of 3 with a current page of 5', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 10;
                    mock.page.number = 5;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageProps()).toEqual({page: 3, length: 8});
                });
                it('should show a length of 9 and a page of 4 with a current page of 6', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 10;
                    mock.page.number = 6;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageProps()).toEqual({page: 4, length: 9});
                });
                it('should show a length of 10 and a page of 5 with a current page of 7', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 10;
                    mock.page.number = 7;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageProps()).toEqual({page: 5, length: 10});
                });
               it('should show a length of 10 and a page of 5 with a current page of 8', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 10;
                    mock.page.number = 8;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageProps()).toEqual({page: 5, length: 10});
                });
               it('should show a length of 10 and a page of 5 with a current page of 9', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 10;
                    mock.page.number = 9;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageProps()).toEqual({page: 5, length: 10});
                });
            });

             describe('pageArray', function() {
                it('should have show only the first 5 pages', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 10;
                    mock.page.number = 0;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageArray()).toEqual([0,1,2,3,4]);
                });
                it('should have show only the first 5 pages', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 10;
                    mock.page.number = 1;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageArray()).toEqual([0,1,2,3,4]);
                });
                it('should show current page 2 to be in the center of array', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 10;
                    mock.page.number = 2;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageArray()).toEqual([0,1,2,3,4]);
                });
                it('should show current page 3 to be in the center of array', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 10;
                    mock.page.number = 3;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageArray()).toEqual([1,2,3,4,5]);
                });
                it('should show current page 4 to be in the center of array', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 10;
                    mock.page.number = 4;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageArray()).toEqual([2,3,4,5,6]);
                });
                it('should show current page 5 to be in the center of array', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 10;
                    mock.page.number = 5;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageArray()).toEqual([3,4,5,6,7]);
                });
                it('should show current page 6 to be in the center of array', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 10;
                    mock.page.number = 6;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageArray()).toEqual([4,5,6,7,8]);
                });
                it('should show current page 7 to be in the center of array', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 10;
                    mock.page.number = 7;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageArray()).toEqual([5,6,7,8,9]);
                });
                it('should show the last 5 pages', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 10;
                    mock.page.number = 8;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageArray()).toEqual([5,6,7,8,9]);
                });
                it('should show the last 5 pages', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 10;
                    mock.page.number = 9;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageArray()).toEqual([5,6,7,8,9]);
                });
             });
             describe('totalItems', function() {
                it('should have no items', function(){
                    var pagination = gridService.pagination(null, scope, null);
                    expect(pagination.totalItems()).toEqual(-1);
                });
                it('should have no items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page = null;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.totalItems()).toEqual(-1);
                });
                it('should have no items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page = undefined;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.totalItems()).toEqual(-1);
                });
                 it('should have no items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalElements = null;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.totalItems()).toEqual(-1);
                });
                it('should have no items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalElements = undefined;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.totalItems()).toEqual(-1);
                });
                it('should have no items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalElements = 'a';
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.totalItems()).toEqual(-1);
                });
                it('should have  items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.totalItems()).toEqual(39);
                });
             });
             describe('pageSize', function() {
                it('should have no items', function(){
                    var pagination = gridService.pagination(null, scope, null);
                    expect(pagination.pageSize()).toEqual(-1);
                });
                it('should have no items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page = null;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageSize()).toEqual(-1);
                });
                it('should have no items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page = undefined;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageSize()).toEqual(-1);
                });
                 it('should have no items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.size = null;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageSize()).toEqual(-1);
                });
                it('should have no items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.size = undefined;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageSize()).toEqual(-1);
                });
             it('should have no items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.size = 'a';
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageSize()).toEqual(-1);
                });
                it('should have  items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.pageSize()).toEqual(20);
                });
             });
             describe('totalPages', function() {
                it('should have no items', function(){
                    var pagination = gridService.pagination(null, scope, null);
                    expect(pagination.totalPages()).toEqual(-1);
                });
                it('should have no items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page = null;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.totalPages()).toEqual(-1);
                });
                it('should have no items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page = undefined;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.totalPages()).toEqual(-1);
                });
                 it('should have no items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = null;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.totalPages()).toEqual(-1);
                });
                it('should have no items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = undefined;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.totalPages()).toEqual(-1);
                });
                it('should have no items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 'a';
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.totalPages()).toEqual(-1);
                });
                it('should have  items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.totalPages()).toEqual(2);
                });
             });
             describe('currentPage', function() {
                it('should have no items', function(){
                    var pagination = gridService.pagination(null, scope, null);
                    expect(pagination.currentPage()).toEqual(-1);
                });
                it('should have no items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page = null;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.currentPage()).toEqual(-1);
                });
                it('should have no items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page = undefined;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.currentPage()).toEqual(-1);
                });
                 it('should have no items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.number = null;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.currentPage()).toEqual(-1);
                });
                it('should have no items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.number = undefined;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.currentPage()).toEqual(-1);
                });
                it('should have no items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.number = 'a';
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.currentPage()).toEqual(-1);
                });
                it('should have  items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.currentPage()).toEqual(0);
                });
             });
            describe('showTotal', function(){
                it('should return true when total pages is greater than 5 and current page is 0', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 22;
                    mock.page.number = 0;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.showTotal()).toEqual(true);
                });
                it('should return true when total pages is greater than 5 and current page is 13', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 22;
                    mock.page.number = 13;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.showTotal()).toEqual(true);
                });
                it('should return true when total pages is greater than 5 and current page is 17', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 22;
                    mock.page.number = 17;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.showTotal()).toEqual(true);
                });
                it('should return true when total pages is greater than 5 and current page is 19', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 22;
                    mock.page.number = 19;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.showTotal()).toEqual(false);
                });
                it('should return true when total pages is greater than 5 and current page is 20', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 22;
                    mock.page.number = 20;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.showTotal()).toEqual(false);
                });
                it('should return true when total pages is greater than 5 and current page is 22', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = 22;
                    mock.page.number = 22;
                    var pagination = gridService.pagination(mock, scope, null);
                    expect(pagination.showTotal()).toEqual(false);
                });
            });
             describe('isCurrent', function() {
                it('should have matching pages numbers', function(){
                    var pagination = gridService.pagination(mockedAddressesFactory, scope, null);
                    var result = pagination.isCurrent(0);
                    expect(result).toBe(true);
                });
                it('should not have matching pages numbers', function(){
                    var pagination = gridService.pagination(mockedAddressesFactory, scope, null);
                    var result = pagination.isCurrent(5);
                    expect(result).toBe(false);
                });
             });
             describe('canNotPrev', function() {
                it('should be true', function(){
                    var pagination = gridService.pagination(mockedAddressesFactory, scope, null);
                    var result = pagination.canNotPrev();
                    expect(result).toBe(true);
                });
                it('should be false', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.number = 1;
                    var pagination = gridService.pagination(mock, scope, null);
                    var result = pagination.canNotPrev();
                    expect(result).toBe(false);
                });
             });
             describe('canNotNext', function() {
                it('should be true', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.number = 1;
                    var pagination = gridService.pagination(mock, scope, null);
                    var result = pagination.canNotNext();
                    expect(result).toBe(true);
                });
                it('should be false', function(){
                    var pagination = gridService.pagination(mockedAddressesFactory, scope, null);
                    var result = pagination.canNotNext();
                    expect(result).toBe(false);
                });
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

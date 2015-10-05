define(['angular','angular-mocks', 'utility.gridService'], function(angular, mocks, GridService) {
    describe('Grid Service  Utility Module', function() {
            beforeEach(module('mps'));
            var scope, mockedAddressesFactory, gridService;
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
            beforeEach(inject(['gridService', function(GridService){
                gridService = GridService;
            }]));
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
             describe('pageArray', function() {
             });
             describe('totalItems', function() {
                it('should have no items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalElements = 0;
                    var pagination = gridService.pagination(mock, scope);
                    expect(pagination.totalItems()).toEqual(-1);
                });
                it('should have  items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    var pagination = gridService.pagination(mock, scope);
                    expect(pagination.totalItems()).toEqual(39);
                });
             });
             describe('pageSize', function() {
                it('should have no items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.size = undefined;
                    var pagination = gridService.pagination(mock, scope);
                    expect(pagination.pageSize()).toEqual(-1);
                });
                it('should have  items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    var pagination = gridService.pagination(mock, scope);
                    expect(pagination.pageSize()).toEqual(20);
                });
             });
             describe('totalPages', function() {
                it('should have no items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.totalPages = undefined;
                    var pagination = gridService.pagination(mock, scope);
                    expect(pagination.totalPages()).toEqual(-1);
                });
                it('should have  items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    var pagination = gridService.pagination(mock, scope);
                    expect(pagination.totalPages()).toEqual(2);
                });
             });
             describe('currentPage', function() {
                it('should have no items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.number = undefined;
                    var pagination = gridService.pagination(mock, scope);
                    expect(pagination.currentPage()).toEqual(-1);
                });
                it('should have  items', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    var pagination = gridService.pagination(mock, scope);
                    expect(pagination.currentPage()).toEqual(0);
                });
             });
             describe('isCurrent', function() {
                it('should have matching pages numbers', function(){
                    var pagination = gridService.pagination(mockedAddressesFactory, scope);
                    var result = pagination.isCurrent(0);
                    expect(result).toBe(true);
                });
                it('should not have matching pages numbers', function(){
                    var pagination = gridService.pagination(mockedAddressesFactory, scope);
                    var result = pagination.isCurrent(5);
                    expect(result).toBe(false);
                });
             });
             describe('canNotPrev', function() {
                it('should be true', function(){
                    var pagination = gridService.pagination(mockedAddressesFactory, scope);
                    var result = pagination.canNotPrev();
                    expect(result).toBe(true);
                });
                it('should be false', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.number = 1;
                    var pagination = gridService.pagination(mock, scope);
                    var result = pagination.canNotPrev();
                    expect(result).toBe(false);
                });
             });
             describe('canNotNext', function() {
                it('should be true', function(){
                    var mock = angular.copy(mockedAddressesFactory);
                    mock.page.number = 1;
                    var pagination = gridService.pagination(mock, scope);
                    var result = pagination.canNotNext();
                    expect(result).toBe(true);
                });
                it('should be false', function(){
                    var pagination = gridService.pagination(mockedAddressesFactory, scope);
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

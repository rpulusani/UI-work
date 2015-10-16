define(['angular', 'utility', 'ui.grid'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .factory('grid', ['uiGridConstants',  function(uiGridConstants) {
        var Grid = function() {
            this.itemsPerPageArr = [
                {items: 20},
                {items: 40},
                {items: 60},
                {items: 80},
                {items: 100}
            ];
            this.hasBookmarkCol = false; // has a bookmark column
        };


        Grid.prototype.getGridActions =  function($rootScope, service, personal){
                return function( gridApi ) {
                    $rootScope.gridApi = gridApi;
                    gridApi.selection.on.rowSelectionChanged($rootScope,
                        function(row){
                            if(row.isSelected){
                                //add if not already there
                                $rootScope.currentRowList.push(row);
                            }else{
                                //find and remove
                                var length = $rootScope.currentRowList.length,
                                    items = $rootScope.currentRowList;
                                for(var i = 0; i <  length; ++i){
                                    if(items[i].uid === row.uid){
                                        items = items.splice(i,1);
                                        break;
                                    }
                                }
                            }
                        }
                    );
                };
        };

        Grid.prototype.getCurrentEntityId =  function(row){
                    if(row && row.entity && row.entity.id){
                        return row.entity.id;
                    }else{
                        return null;
                    }
        };

        Grid.prototype.getDataWithDataFormatters = function(incommingData, functionArray){
            var data = angular.copy(incommingData);
            if(functionArray){
                for(var i = 0; i < data.length; ++i){
                    for(var j = 0; j < functionArray.length; ++j){
                        data[i][functionArray[j]['name']] = functionArray[j]['functionDef'];
                    }
                }
            }
            return angular.copy(data);
        };

        Grid.prototype.setColumnDefaults = function(columns, personal){
            //do something with a personal set of columns configured

            //disabled column menu keep last so that it can not be overridden by personal settings.
            for(var i = 0; i < columns.length; ++i){
                     columns[i].enableColumnMenu = false;
            }
            return columns;
        };

        Grid.prototype.display = function(service, scope, personal) {
            scope.gridOptions.data = this.getDataWithDataFormatters(service.data, service.functionArray);
            scope.gridOptions.columnDefs = this.setColumnDefaults(service.columns, personal);
            scope.gridOptions.showGridFooter = false;
            scope.gridOptions.enableRowSelection = true;
            scope.gridOptions.enableSelectAll = true;
            scope.gridOptions.gridCss = 'table';

            // Setup special columns
            if ((!scope.gridOptions.showBookmarkColumn ||
                 scope.gridOptions.showBookmarkColumn === true) &&
                 this.hasBookmarkCol === false) {
                this.hasBookmarkCol = true;

                scope.gridOptions.columnDefs.unshift({
                    name: '',
                    field: 'bookmark',
                    width:'30',
                    headerCellClass: 'no-border',
                    enableSorting: false,
                    cellTemplate: '<i class="icon icon--ui icon--not-favorite" ng-click="grid.appScope.bookmark(row.entity)"></i>',
                    enableColumnMenu: false,
                    cellClass: 'bookmark'
                });
            }

            // Setting up pagination
            if (scope.pagination !== false) {
                scope.pagination = this.pagination(service, scope, personal);
                scope.pagination.itemsPerPageArr = this.itemsPerPageArr;
                scope.itemsPerPage = service.params.size;
            }
        };

        Grid.prototype.pagination = function(service, scope, personal) {
            var self = this;

            return {
                currentPage: service.params.page,
                pageProps: function() {
                    var total = this.totalPages(),
                    props = {
                        page: service.params.page,
                        length: 5
                    };

                    if (props.page < 3) {
                        props.page  = 0;
                    } else if ( props.page >= 3 && props.page + 5 <= total) {
                        props.page = props.page - 2;
                        props.length = props.page + 5;
                    } else if (props.page + 5 - total === 1 && props.page >= 3  ) {
                        props.page = props.page - 2;
                        props.length = props.page + 5;
                    } else if (props.page + 5 > total) {
                        props.page = total - 5;
                        props.length = total;
                    }

                    return props;
                },
                pageArray: function() {
                    var array = [],
                    props = this.pageProps(),
                    i = props.page;

                    for (i; i < props.length; ++i) {
                        array.push(i);
                    }

                    return array;
                },
                itemsPerPageArray: function(){
                    return this.itemsPerPageArr;
                },
                totalItems: function() {
                    if (service.page.totalElements) {
                        return service.page.totalElements;
                    } else {
                        return -1;
                    }
                },
                totalPages:  function(){
                    return service.page.totalPages;
                },
                showTotal: function() {
                    if (this.totalPages() !== -1){
                        return this.totalPages() > 5 &&
                         service.params.page + 4 < this.totalPages();
                    } else {
                        return false;
                    }
                },
                isCurrent: function(page) {
                   return page === service.params.page;
                },
                canNotPrev:  function(){
                    var page = service.params.page - 1;
                    return  page < 0;
                },
                canNotNext: function() {
                    if (service.params.page && this.totalPages()) {
                        return (service.params.page + 1) >= this.totalPages();
                    } else {
                        return false;
                    }
                },
                onChangeItemsCount: function(option) {
                    personal.setPersonalizedConfiguration('itemsPerPage', option['items']);
                    this.gotoPage(0);
                },
                gotoPage: function(pageNumber) {
                    var pageSize = personal.getPersonalizedConfiguration('itemsPerPage');
                    service.getList(pageNumber, pageSize).then(function() {
                       self.display(service, scope, personal);
                    }, function(reason) {
                        NREUM.noticeError('failed Paging: ' + reason);
                    });
                },
                nextPage: function() {
                    if (service.params.page + 1 < this.totalPages()) {
                        this.gotoPage(service.params.page + 1);
                    } else {
                        NREUM.noticeError('Pagination nextPage() has a function undefined!');
                    }
                },
                prevPage: function() {
                    if (this.gotoPage) {
                        if (service.params.page - 1 >= 0) {
                            this.gotoPage(service.params.page - 1);
                        }
                    } else {
                         NREUM.noticeError('Pagination prevPage() has a function undefined!');
                    }
                },
                firstPage: function() {
                    this.gotoPage(0);
                },
                lastPage: function() {
                    this.gotoPage(this.totalPages() - 1);
                },
                useExternalPagination: true
            };
        };


        return new Grid();
    }]);
});

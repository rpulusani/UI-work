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

        Grid.prototype.pagination = function(service, scope) {
            var self = this;
            alert('PAGINATION')
            return {
                currentPage: service.params.page,
                pageProps: function() {
                    var total = service.page.totalPages,
                    length = 5,
                    props = {
                        page: service.params.page,
                        length: length
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
                totalItems: function() {
                    if (service.page.totalElements) {
                        return service.page.totalElements;
                    } else {
                        return -1;
                    }
                },
                totalPages: service.page.totalPages,
                showTotal: function() {
                    if (service.page.totalPages !== -1){
                        return service.page.totalPages > 5 
                            && service.params.page + 4 < service.page.totalPages;
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
                    if (service.params.page && service.page.totalPages) {
                        return (service.params.page + 1) >= service.page.totalPages;
                    } else {
                        return false;
                    }
                },
                onChangeItemsCount: function(option) {
                    service.params.size = option.items;
                    this.gotoPage();
                },
                gotoPage: function(pageNumber) {
                    service.getList(pageNumber).then(function() {
                        scope.gridOptions.data = service.data;
                    }, function(reason) {
                        NREUM.noticeError('failed Paging: ' + reason);
                    });
                },
                nextPage: function() {
                    if (service.params.page + 1 < service.page.totalPages) {
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
                    this.gotoPage(service.params.page - 1);
                },
                useExternalPagination: true
            };
        };

        Grid.prototype.display = function(service, scope) {
            scope.gridOptions.data = service.data;
            scope.gridOptions.columnDefs = service.columns;
            scope.gridOptions.showGridFooter = true;
            scope.gridOptions.enableRowSelection = true;
            scope.gridOptions.enableSelectAll = true;
            scope.gridOptions.gridCss = 'table';
            scope.gridOptions.enableColumnMenu = false;

            // Setup special columns
            if ((!scope.gridOptions.showBookmarkColumn 
                || scope.gridOptions.showBookmarkColumn === true) 
                && this.hasBookmarkCol === false) {

                this.hasBookmarkCol = true;

                scope.gridOptions.columnDefs.unshift({
                    name: '',
                    field: 'bookmark',
                    width:'30',
                    headerCellClass: 'no-border',
                    enableSorting: false,
                    cellTemplate: '<i class="icon icon--ui icon--not-favorite" ng-click="grid.appScope.bookmark(row.entity, $event)"></i>',
                    enableColumnMenu: false,
                    cellClass: 'bookmark'
                });
            }

            // Setting up pagination
            if (scope.gridOptions.pagination !== false) {
                scope.pagination = this.pagination(service, scope);
                scope.pagination.itemsPerPageArr = this.itemsPerPageArr;
                scope.itemsPerPage = service.params.size;
            }
        };

        return new Grid();
    }]);
});

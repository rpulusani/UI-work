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
            
            return {
                currentPage: service.page.number,
                pageProps: function() {
                    var total = service.page.totalPages,
                    props = {
                        page: service.page.number,
                        length: 5
                    };

                    if (props.page < 3) {
                        props.page = 0;
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
                totalItems: service.page.totalElements,
                totalPages: service.page.totalPages,
                showTotal: function() {
                    if (this.totalPages !== -1){
                        return this.totalPages > 5 
                            && this.currentPage + 4 < this.totalPages;
                    } else {
                        return false;
                    }
                },
                isCurrent: function(page) {
                   return page === this.currentPage;
                },
                canNotPrev: function() {
                    return  (this.currentPage - 1) < 0;
                },
                canNotNext: function() {
                    if (this.currentPage && this.totalPages) {
                        return (this.currentPage + 1) >= this.totalPages;
                    } else {
                        return false;
                    }
                },
                onChangeItemsCount: function(option) {
                    this.gotoPage(0, option.items);
                },
                gotoPage: function(pageNumber, size) {
                    var self = this;

                    if (!size) {
                        size = service.page.size;
                    }

                    service.getPage(pageNumber, size).then(function() {
                        self.currentPage = service.page.number;
                        self.totalPages = service.page.totalPages;
                        self.totalElements = service.page.totalElements;
                        angular.copy(20, self.totalPages);
                        scope.gridOptions.data = service.data;
                        scope.total = service.data.length;
                    }, function(reason) {
                        NREUM.noticeError('failed Paging: ' + reason);
                    });
                },
                nextPage: function() {
                    if (this.currentPage + 1 < this.totalPages) {
                        this.gotoPage(service.page.number + 1);
                    } else {
                        NREUM.noticeError('Pagination nextPage() has a function undefined!');
                    }
                },
                prevPage: function() {
                    if (this.gotoPage) {
                        if (this.currentPage - 1 >= 0) {
                            this.gotoPage(service.page.number - 1);
                        }
                    } else {
                         NREUM.noticeError('Pagination prevPage() has a function undefined!');
                    }
                },
                firstPage: function() {
                    this.gotoPage(0);
                },
                lastPage: function() {
                    this.gotoPage(service.page.totalPages - 1);
                }
            };
        };

        Grid.prototype.display = function(service, scope) {
            var i = 0,
            totalColumns = 0;

            scope.gridOptions.data = service.data;
            scope.gridOptions.columnDefs = service.columns;
            scope.gridOptions.showGridFooter = false;
            scope.gridOptions.enableRowSelection = true;
            scope.gridOptions.enableSelectAll = true;
            scope.gridOptions.gridCss = 'table';
            scope.gridOptions.enableColumnMenu = false;
            scope.gridOptions.useExternalPagination = true;
            
            totalColumns = scope.gridOptions.columnDefs.length;

            for (i; i < totalColumns; i += 1) {
                if (!scope.gridOptions.columnDefs[i].enableColumnMenu || 
                    !scope.gridOptions.columnDefs[i].enableColumnMenu === false) {
                    scope.gridOptions.columnDefs[i].enableColumnMenu = false;
                }
            }

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
            }
        };

        return new Grid();
    }]);
});

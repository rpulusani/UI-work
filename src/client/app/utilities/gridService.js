    define(['angular', 'utility', 'ui.grid'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .factory('gridService', ['$q', '$timeout','uiGridConstants',  function($q, $timeout, uiGridConstants) {
        var columnDef = { columnDefs: [] };
            function addColumns(columnObject, returnFN){
                var columns = angular.copy(columnDef);
                var length = columnObject['defaultSet'].length;
                var workingColumns = columnObject['defaultSet'];
                if(columnObject.bookmarkColumn){
                    columns.columnDefs.push({
                        name: '',
                        field: columnObject['bookmarkColumn'],
                        width:'30',
                        headerCellClass: 'no-border',
                        enableSorting: false,
                        cellTemplate: '<i class="icon icon--ui icon--not-favorite"></i>',
                        enableColumnMenu: false,
                        cellClass: 'bookmark'
                    });
                }
                for(var i = 0; i < length; ++i){
                     var item = angular.copy(workingColumns[i]);
                     item.enableColumnMenu = false;
                     columns.columnDefs.push(item);
                }
                returnFN(angular.copy(columns));
            }

            return {
                getCurrentEntityId: function(row){
                    if (row.entity && row.entity.id) {
                        return row.entity.id;
                    } else {
                        return null;
                    }
                },
                getGridActions: function($rootScope, service){
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

                        gridApi.selection.on.rowSelectionChangedBatch($rootScope,
                            function(rows){
                                if(rows.length > 0 && rows[0].isSelected){
                                    $rootScope.currentRowList = rows;
                                }else{
                                   $rootScope.currentRowList = [];
                                }
                            }
                        );
                    };
                },
                getGridOptions: function (service, type){
                    var options = {};
                    var columns = service.getColumnDefinition(type);
                    return $q(function(resolve, reject){
                        addColumns(columns,
                                function(columnArray){
                                    options =  {
                                        enableRowSelection: true,
                                        enableSelectAll: true,
                                        showGridFooter:true,
                                        useExternalPagination: true,
                                        columnDefs: columnArray['columnDefs'],
                                        gridCss: 'table'
                                    };
                                    options.multiSelect = false;
                                    //options.noUnselect = true;
                            });

                        $timeout(function(){
                            console.log("options");
                            if(options !== undefined && options['columnDefs'] !== undefined && options['columnDefs'].length > 0){
                                resolve(options);
                            }else{
                                reject('There were no columns');
                            }
                        }, 1000);
                    });
                },
                pagination: function(service, rootScope){
                    return {
                        pageArray: function(){
                            var array = [],
                            length = this.totalPages();
                            for(var i = 0; i < length; ++i){
                                array.push(i);
                            }
                            return array;
                        },
                        totalItems: function(){
                            if(service && service.page && service.page.totalElements){
                                return service.page.totalElements;
                            }else{
                                return -1;
                            }
                        },
                        pageSize: function(){
                            if(service && service.page && !isNaN(service.page.size)){
                               return service.page.size;
                            }else{
                                return -1;
                            }
                        },
                        totalPages: function(){
                            if(service && service.page && !isNaN(service.page.totalPages)){
                               return service.page.totalPages;
                            }else{
                                return -1;
                            }
                        },
                        currentPage: function(){
                            if(service && service.page && !isNaN(service.page.number)){
                                return service.page.number;
                            }else{
                                return -1;
                            }
                        },
                        isCurrent: function(page){
                            if(this.currentPage){
                               return page === this.currentPage();
                            }else{
                                return false;
                            }
                        },
                        canNotPrev: function(){
                            if(this.currentPage){
                                var page = this.currentPage() - 1;
                                return  page < 0;
                            }else{
                                return false;
                            }
                        },
                        canNotNext: function(){
                            if(this.currentPage && this.totalPages){
                                var page = this.currentPage() + 1;
                                return page >= this.totalPages();
                            }else{
                                return false;
                            }
                        },
                        gotoPage: function(pageNumber, gridOptions){
                            service.resource(rootScope.currentAccount, pageNumber).then(
                                function(response){
                                    if(service.getList){
                                        gridOptions.data = service.getList();
                                    }else{
                                         NREUM.noticeError('service.getList() does not exist.');
                                    }
                                },function(reason){
                                    NREUM.noticeError("failed Paging: " + reason);
                                }
                            );

                        },
                        nextPage: function(gridOptions){
                            if(this.currentPage && this.totalPages && this.currentPage && this.gotoPage &&
                                gridOptions !== undefined){
                                if(this.currentPage() + 1 < this.totalPages()){
                                    this.gotoPage(this.currentPage() + 1, gridOptions);
                                }else{
                                    NREUM.noticeError('Pagination nextPage() has a function undefined!');
                                }
                            }
                        },
                        prevPage: function(gridOptions){
                            if(this.currentPage && this.gotoPage && gridOptions !== undefined){
                                if(this.currentPage() -1 >= 0){
                                    this.gotoPage(this.currentPage() - 1, gridOptions);
                                }
                            }else{
                                 NREUM.noticeError('Pagination prevPage() has a function undefined!');
                            }
                        }


                    };
                }
            };
    }]);
});

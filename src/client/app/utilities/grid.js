angular.module('mps.utility')
.factory('grid', ['uiGridConstants', '$timeout', '$translate', '$rootScope', function(uiGridConstants, $timeout, $translate, $rootScope) {
    var Grid = function() {
        this.itemsPerPageArr = [
            {items: 20},
            {items: 40},
            {items: 60},
            {items: 80},
            {items: 100}
        ];
        this.hasBookmarkCol = false; // has a bookmark column
        this.serviceInfo = {};
        this.optionsName = 'gridOptions';
        this.gridOptions = {};
            this.enableServerSort = true;
    };

    Grid.prototype.setGridOptionsName = function(newName) {
        this.optionsName = newName;
        this[this.optionsName] = {};
    };

    Grid.prototype.clearGridParamsRootScope = function($rootScope){
        $rootScope.gridApi = undefined;
        $rootScope.currentRowList = undefined;
    };

    Grid.prototype.getGridActions =  function($rootScope, service, personal){
        var self = this;
        return function( gridApi ) {
            $rootScope.gridApi = gridApi;

            if (self.enableServerSort) {
                $rootScope.gridApi.core.on.sortChanged($rootScope, function(grid, sortColumns) {
                    var direction,
                    currentDir;

                    if (sortColumns.length == 0) {
                        currentDir = null;
                        service.params.sort = null;
                    } else {
                        currentDir = sortColumns[0].sort.direction.toUpperCase();

                        if (!sortColumns[0].colDef.searchOn) {
                            service.params.sort = sortColumns[0].field;
                        } else {
                            service.params.sort = sortColumns[0].colDef.searchOn;
                        }
                    }

                    service.params.direction = currentDir;

                    if (service.springSorting) {
                        service.params[service.params.sort + '.dir'] = currentDir;
                        service.params.direction = null;
                    }

                    self.gridOptions.data = [];

                    service.get().then(function (data) {
                        self.gridOptions.data = self.getDataWithDataFormatters(service.data, service.functionArray);
                        $rootScope.gridApi.core.refresh();
                    });
                });
            }

            if(gridApi && gridApi.selection){
                gridApi.selection.on.rowSelectionChanged($rootScope,
                    function(row){
                        if(row.isSelected){
                            //add if not already there
                            $rootScope.currentRowList.push(row);
                            $rootScope.currentSelectedRow = row.entity;
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
                            $rootScope.currentSelectedRow = undefined;
                        }
                    }
                );
            }
        };
    };

    Grid.prototype.getCurrentEntityId =  function(row){
        if (row && row.entity && row.entity.id) {
            return row.entity.id;
        } else {
            return null;
        }
    };

    Grid.prototype.getVisibleColumns = function(service){
        var columnList = this.setColumnDefaults(service.columns, service.columnDefs),
        visibleColumns = [];

        for(var i = 0; i < columnList.length; ++i){
            if(!columnList[i]['notSearchable'] && columnList[i]['field']) {
                if (!columnList[i].searchOn) {
                    columnList[i].searchOn = columnList[i].field;
                }

                visibleColumns.push({
                    name: columnList[i]['name'],
                    field: columnList[i]['field'],
                    searchOn: columnList[i].searchOn
                });
            }
        }
        return visibleColumns;
    };

    Grid.prototype.getDataWithDataFormatters = function(incommingData, functionArray) {
        var data = angular.copy(incommingData);
        if(functionArray && data){
            for(var i = 0; i < data.length; ++i){
                for(var j = 0; j < functionArray.length; ++j){
                    data[i][functionArray[j]['name']] = functionArray[j]['functionDef'];
                }
            }
        }
        return angular.copy(data);
    };

    /*
        @columnSet'' is a key pointing to a property in @columnDefs{}.
        @columnSet'' can also be an array of columns.
    */
    Grid.prototype.setColumnDefaults = function(columnSet, columnDefs, enableColumnMenu) {
        var columns = [],
        i = 0;

        if (!angular.isArray(columnSet)) {
            //do something with a personal set of columns configured
            if (columnDefs[columnSet]) {
                if (typeof columnDefs[columnSet] !== 'function') {
                    columns = columnDefs[columnSet];
                } else {
                    columns = columnDefs[columnSet]();
                }
            }
        } else {
            columns = columnSet;
        }

        if (!enableColumnMenu) {
            enableColumnMenu = false;
        }

        //disabled column menu keep last so that it can not be overridden by personal settings.
        for (i; i < columns.length; i += 1) {
            columns[i].enableColumnMenu = enableColumnMenu;
            columns[i].name = $translate.instant(columns[i].name);
        }

        return columns;
    };
    
    Grid.prototype.getSize = function(service){
        var size = 0;
        if(service.params && service.params.size && service && service.data){
            size =  service.data.length < service.params.size? service.data.length: service.params.size;
        }else{
            size = service.data.length;
        }
        return size;
    };


    Grid.prototype.display = function(service, scope, personal, rowHeight, fn) {
        var self = this,
        $ = require('jquery'),
        serviceId = '',
        newHeight = '46',
        baseHeight = 100,
        size = self.getSize(service),

        setClasses = function(tempOptionName) {
                $('[ui-grid="' + tempOptionName + '"] .ui-grid-disable-selection').parent().addClass('selection');
                $('[ui-grid="' + tempOptionName + '"] .favorite').parent().addClass('bookmark');
        };

        scope[self.optionsName].getStyle = function(){

            if (service.data && service.data.length > 0) {
                if (rowHeight) {
                    newHeight = baseHeight + (parseInt(rowHeight, 10) + 1) * size;
                } else {
                    rowHeight = 45;
                    newHeight = baseHeight + (rowHeight * size);
                }
            } else {
                newHeight = baseHeight;
            }

            return {
                height: newHeight
            };
        };

        if (!scope[self.optionsName].showLoader) {
            scope[self.optionsName].showLoader = true;
        }

        setClasses(self.optionsName);

        scope[self.optionsName].columnDefs = self.setColumnDefaults(service.columns, service.columnDefs);
        scope[self.optionsName].showGridFooter = false;
        scope[self.optionsName].enableRowSelection = true;
        scope[self.optionsName].enableSelectAll = true;
        scope[self.optionsName].enableMinHeightCheck = true;
        scope[self.optionsName].minRowsToShow = service.params.size;
        scope[self.optionsName].virtualizationThreshold = service.params.size;
        scope[self.optionsName].enableHorizontalScrollbar = 2;
        scope[self.optionsName].enableVerticalScrollbar = 0;
        //printing Options
        scope[self.optionsName].exporterPdfDefaultStyle = {fontSize: 9};
        scope[self.optionsName].exporterPdfTableStyle = {margin: [30, 30, 30, 30]};
        scope[self.optionsName].exporterPdfTableHeaderStyle = {fontSize: 10, bold: true, italics: true, color: 'black'};
        scope[self.optionsName].exporterPdfPageSize = 'LETTER';
        scope[self.optionsName].exporterPdfMaxGridWidth = 500;
        scope[self.optionsName].rowEditWaitInterval = 0;
        scope[self.optionsName].exporterAllDataFn = function() {
            var size = 300;

            if (scope.printing === false) {
                size = service.page.totalElements;
            }

            scope[self.optionsName].currentGridData = service.data;
            scope[self.optionsName].servicePage = service.page;

            return service.getPage(0, size).then(function() {
                scope[self.optionsName].data = service.data;

                $timeout(function() {
                    service.page = scope[self.optionsName].servicePage;
                    service.data = scope[self.optionsName].currentGridData;

                    scope[self.optionsName].data = service.data;
                }, 0);
            });
        };

        // Setup special columns
        if ((scope[self.optionsName].showBookmarkColumn === undefined ||
            scope[self.optionsName].showBookmarkColumn === true) &&
            (!self.serviceInfo[serviceId] || !self.serviceInfo[serviceId].hasBookmarkCol)) {

            scope[self.optionsName].showBookmarkColumn = true;
            self.serviceInfo[serviceId] = {hasBookmarkCol: true};

            if (typeof scope.bookmark !== 'function' && service.item && service.item.links && service.addBookmarkFn === true) {
                scope.bookmark = function(rowEntity) {
                    var node = angular.element(document.getElementsByClassName('bookmark-' + rowEntity.id)[0].childNodes);


                    service.setItem(rowEntity);

                    if (rowEntity.bookmarked === false) {
                        service.item.links.bookmark({method: 'post'}).then(function() {
                            node.toggleClass('icon--not-favorite');
                            node.toggleClass('icon--favorite');
                        });
                    } else {
                        service.item.links.bookmark({method: 'delete'}).then(function() {
                            node.toggleClass('icon--not-favorite');
                            node.toggleClass('icon--favorite');
                        });
                    }
                };
            }

            if (!service.hideBookmark) {
                scope[self.optionsName].columnDefs.unshift({
                    name: '',
                    field: 'bookmark',
                    width:'30',
                    enableSorting: false,
                    cellTemplate: '<i ng-class="row.entity.bookmarked == true ? \'icon icon--ui icon--favorite favorite\' : \'icon icon--ui icon--not-favorite favorite\' " ng-click="grid.appScope.bookmark(row.entity)"></i>',
                    enableColumnMenu: false,
                    headerCellClass:'bookmark-header',
                    cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                          return 'bookmark bookmark-' + row.entity.id;
                    },
                    notSearchable: true,
                    exporterSuppressExport: true
                });
            }
        }

        var tempOptionName = self.optionsName;
        $timeout(function() {
            var totalItems = scope.pagination.totalItems();

            scope[self.optionsName].showLoader = false;

            if (service.gridName) {
                serviceId = service.gridName;
            } else if (service.serviceName) {
                serviceId = service.serviceName;
            } else {
                serviceId = service.embeddedName;
            }

            if(rowHeight){
                scope[self.optionsName].rowHeight = rowHeight;
            }

            scope[self.optionsName].data = self.getDataWithDataFormatters(service.data, service.functionArray);

            if (totalItems === 0) {
                newHeight = baseHeight;
                scope[self.optionsName].showNoResults = true;
            } else {
                scope[self.optionsName].showNoResults = false;
            }
        }, 100);
        // Setting up pagination
        if (scope.pagination !== false) {
            scope.pagination = self.pagination(service, scope, personal);
            scope.pagination.itemsPerPageArr = self.itemsPerPageArr;
            scope.itemsPerPage = service.params.size;
        }

        self[self.optionsName] = scope[self.optionsName];

        // Generalized row selection
        scope.isSingleSelected = function() {
             if (scope.currentRowList.length === 1) {
                return true;
             } else {
                return false;
             }
        };

        scope.isMultipleSelected = function() {
            if (scope.currentRowList.length >= 1) {
                return true;
            } else {
                return false;
            }
        };

        if (typeof fn === 'function') {
            return fn(self);
        }
    };

    Grid.prototype.pagination = function(service, scope, personal) {
        var self = this;

        return {
            /*
                This function checks to see that service and its child property page exist
            */
            validatePaginationDataExists: function(){
                    var result = false;
                if(service !== null && service !== undefined){
                    if(service.page !== null && service.page !== undefined){
                        result = true;
                    }
                }
                return result;
            },
            currentPage: function(){
                if(this.validatePaginationDataExists() &&
                    service.page.number !== null && service.page.number !== undefined &&
                    !isNaN(service.page.number)){
                    return service.page.number;
                }else{
                    return -1;
                }
            },
            /*
                pageProps holds the logic  for how many items will be allowed for pagination
                    Rules:
                        * No more than 5 sequence items at one time
                        * Move the numbering to the right or left if the current page is greater than 3
                            so that the current page will be in the middle of the number sequence
                        * If total pages is greater than 5 and current page is towards the end of the sequence
                            then allow for sequence range to freeze at max total pages for a full sequence count of
                            5 items
            */
            pageProps: function() {
               var total =  this.totalPages(),
                props = {
                    page: this.currentPage(),
                    length: 5
                };
                if(props.page < 3 && total > 5){
                    props.page  = 0;
                }else if(props.page < 3 && total < 5){
                    props.page = 0;
                    props.length = total;
                }else if( props.page >= 3 && props.page + 5 <= total){
                    props.page = props.page - 2;
                    props.length = props.page + 5;
                }else if(props.page + 5 - total === 1 && props.page >= 3  ){
                    props.page = props.page - 2;
                    props.length = props.page + 5;
                }else if(props.page + 5 > total){
                    props.page = total - 5;
                    if (props.page < 0) {
                        props.page = 0;
                    }
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
            totalPages: function(){
                if(this.validatePaginationDataExists() &&
                    service.page.totalPages !== null && service.page.totalPages !== undefined &&
                    !isNaN(service.page.totalPages)){
                   return service.page.totalPages;
                }else{
                    return -1;
                }
            },
            totalItems: function(){
                if(this.validatePaginationDataExists() &&
                    service.page.totalElements !== null && service.page.totalElements !== undefined &&
                    !isNaN(service.page.totalElements)){
                    return service.page.totalElements;
                }else{
                    return -1;
                }
            },
            pageSize: function(){
                if(this.validatePaginationDataExists() &&
                    service.page.size  !== null && service.page.size  !== undefined &&
                    !isNaN(service.page.size)){
                   return service.page.size;
                }else{
                    return -1;
                }
            },
            showTotal: function() {
                var total = this.totalPages();
                if(total != -1){
                   return total > 5 && this.currentPage() + 4 < total;
                }else{
                    return false;
                }
            },
            isCurrent: function(page) {
               return page === this.currentPage();
            },
            canNotPrev: function() {
                return  (this.currentPage() - 1) < 0;
            },
            canNotNext: function() {
                if (this.currentPage() && this.totalPages()) {
                    return (this.currentPage() + 1) >= this.totalPages();
                } else {
                    return false;
                }
            },
            onChangeItemsCount: function(option) {
                personal.setPersonalizedConfiguration('itemsPerPage', option['items']);
                this.gotoPage(0);
            },
            gotoPage: function(pageNumber, size) {
                var pageSize = personal.getPersonalizedConfiguration('itemsPerPage');
                service.getPage(pageNumber, pageSize, scope.additionalParams).then(function() {
                        self.display(service, scope, personal, scope[self.optionsName].rowHeight );
                    size = service.page.size;
                }, function(reason) {
                    NREUM.noticeError('failed Paging: ' + reason);
                });
            },
            nextPage: function() {
                if (service.params.page + 1 < this.totalPages()) {
                    this.gotoPage(service.page.number + 1);
                } else {
                    NREUM.noticeError('Pagination nextPage() has a function undefined!');
                }
            },
            prevPage: function() {
                if (this.gotoPage) {
                    if (this.currentPage() - 1 >= 0) {
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
                this.gotoPage(this.totalPages() - 1);
            }
        };
    };

    return Grid;
}]);

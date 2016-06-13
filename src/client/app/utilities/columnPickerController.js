/*
Controller for the Column Picker Directive.
Builds a list of links that modify the columns on
a target Grid.
*/
'use strict'
angular.module('mps.utility')
.controller('ColumnPickerController', ['$scope', '$element', '$attrs', '$translate', '$rootScope', '$compile',
    function(scope, element, attrs, translate, $rootScope, $compile) {
        var node = element[0],
        $ = require('jquery'),
        columns = [],
        addColumn = function(column, gridOptions) {
            var i = 0,
            fnd = false;

            for (i; i < gridOptions.columnDefs.length; i += 1) {
                if (gridOptions.columnDefs[i].field === column.field && column.field) {
                    gridOptions.columnDefs[i].visible = true;
                }
            }

            return gridOptions;
        },
        removeColumn = function(column, gridOptions) {
            var i = 0,
            fnd = false;

            for (i; i < gridOptions.columnDefs.length; i += 1) {
                if (gridOptions.columnDefs[i].name === column.name) {
                    gridOptions.columnDefs[i].visible = false;
                }
            }

            return gridOptions;
        },
        createColumnSelection = function(column, gridOptions) {
            var listItem = $('<div class="col-1-3">'),
            checkboxWrapper = $('<div class="form__field form__field--checkbox"></div>'),
            checkbox = $('<input type="checkbox" id="' + column.name.replace(/ /g, '-') + '" name="' + column.field  + '" value="">'),
            checkboxLabel = $('<label for="' + column.name + '"><span></span> ' + column.name.replace(/\s*\(.*?\)\s*/g, '') + '</label>');

            checkboxWrapper.append(checkbox);
            checkboxWrapper.append(checkboxLabel);

            if (column.visible !== false) {
                column.default = true;
                checkbox.checked = true;
                checkboxLabel.addClass('form__field--is-checked');
            } else {
                checkbox.checked = false;
            }

            checkbox.customInput();

            if (checkbox) {
                checkboxWrapper.on('click', function(e) {
                    e.preventDefault();

                    if (checkbox.checked === false) {
                        checkbox.checked = true;
                        gridOptions = addColumn(column, gridOptions);
                        checkboxLabel.toggleClass('form__field--is-checked');

                        $rootScope.$broadcast('columnPickerSelect', column);
                    } else {
                        checkbox.checked = false;
                        gridOptions = removeColumn(column, gridOptions);
                        checkboxLabel.toggleClass('form__field--is-checked');
                    
                        $rootScope.$broadcast('columnPickerDeselect', column);
                    }

                    scope.$root.gridApi.core.refresh();
                    scope.$apply();
                });

                listItem.append(checkboxWrapper);

                return listItem;
            } else {
                return false;
            }
        },
        prop;

        scope.$on('setupColumnPicker', function(e, Grid) {
            // make sure we only answer this call once
            if (!element.hasClass('columnpicker')) {
                var i = 0,
                columnMax = 7,
                list = angular.element('<div class="form"></div>'),
                selectorContent,
                links = [],
                gridOptions = e.targetScope.gridOptions,
                dropdownBtn = $(
                    '<p class="l-visible--lt-laptop"><strong>' + translate.instant('COLUMNPICKER.CUSTOMIZE_COLUMNS') + '</strong></p><div class="dropdown columnpicker" data-column-count="' + Grid.gridOptions.columnDefs.length + '">' +
                        '<button class="btn dropdown__trigger"><i class="icon icon--ui icon--navicon-secondary rotate"></i></button>' +
                    '</div>'),
                dropdownMenu = $('<div class="row l-hidden"><div class="col-lg-3-4 col-md-1-1"><div class="row l-pad columnpicker__menu">' + 
                    '<div class="col-1-2"><h2>' + translate.instant('COLUMNPICKER.TITLE') + '</h2></div>' + 
                    '<div class="col-1-2"><ul>' + 
                        '<li><a href="#" ng-click="selectAll()">Select All</a></li>' + 
                        '<li><a href="#" ng-click="deselectAll()" href="">Select None</a></li>' + 
                        '<li><a href="#" ng-click="resetColumns()" href="">Reset Columns</a></li>' + 
                    '</ul></div>' + 
                    '</div></div></div>');

                scope.selectAll = function() {
                    var i = 0,
                    checkbox,
                    checkboxLabel,
                    column;

                    for (i; i < columns.length; i += 1) {
                        if (columns[i].inColumnSelector) {
                            column = columns[i];
                            
                            checkbox = $('#' + column.name.replace(/ /g, '-'));

                            checkboxLabel = checkbox.parent().find('label');

                            if (checkboxLabel.hasClass('form__field--is-checked') === false) {
                                checkbox.checked = true;

                                gridOptions = addColumn(column, gridOptions);

                                checkboxLabel.toggleClass('form__field--is-checked');
                            }
                        }
                    }
                    
                    scope.$root.gridApi.core.refresh();
                };

                scope.deselectAll = function() {
                    var i = 0,
                    checkbox,
                    checkboxLabel,
                    column;

                    for (i; i < columns.length; i += 1) {
                        if (columns[i].inColumnSelector) {
                            column = columns[i];
                            
                            checkbox = $('#' + column.name.replace(/ /g, '-'));

                            checkboxLabel = checkbox.parent().find('label');

                            if (checkboxLabel.hasClass('form__field--is-checked') === true) {
                                checkbox.checked = false;

                                gridOptions = removeColumn(column, gridOptions);

                                checkboxLabel.toggleClass('form__field--is-checked');
                            }
                        }
                    }
                    
                    scope.$root.gridApi.core.refresh();
                };

                scope.resetColumns = function() {
                    var i = 0,
                    checkbox,
                    checkboxLabel,
                    column;

                    scope.deselectAll();

                    for (i; i < columns.length; i += 1) {
                        if (columns[i].inColumnSelector && columns[i].default) {
                            column = columns[i];
                            
                            checkbox = $('#' + column.name.replace(/ /g, '-'));

                            checkboxLabel = checkbox.parent().find('label');

                            if (checkboxLabel.hasClass('form__field--is-checked') === false) {
                                checkbox.checked = true;

                                gridOptions = addColumn(column, gridOptions);

                                checkboxLabel.toggleClass('form__field--is-checked');
                            }
                        }
                    }
                    
                    scope.$root.gridApi.core.refresh();
                };

                element.addClass('columnpicker');
                element.append(dropdownBtn);

                dropdownMenu.replaceWith($compile(dropdownMenu)(scope));

                element.on('click', function(evt) {
                    var parentWrapper = dropdownBtn.parent().parent();

                    evt.preventDefault();

                    parentWrapper.after(dropdownMenu);

                    if (dropdownMenu.hasClass('l-hidden')) {
                        dropdownMenu.removeClass('l-hidden');
                        dropdownBtn.addClass('active');

                        if (gridOptions) {
                            for (i; i < Grid.gridOptions.columnDefs.length; i += 1) {
                                if (Grid.gridOptions.columnDefs[i].field !== 'bookmark' 
                                    && !((Grid.gridOptions.columnDefs[i].showInColumnPicker !== undefined) && (Grid.gridOptions.columnDefs[i].showInColumnPicker === false))
                                    && (Grid.gridOptions.columnDefs[i].dynamic === undefined || Grid.gridOptions.columnDefs[i].dynamic === true)) {
                                    Grid.gridOptions.columnDefs[i].inColumnSelector = true;

                                    columns.push(Grid.gridOptions.columnDefs[i]);

                                    links.push(createColumnSelection(Grid.gridOptions.columnDefs[i], gridOptions));
                                }
                            }

                            i = 0;

                            for (i; i < links.length; i += 1) {
                                list.append(links[i]);
                            }

                            selectorContent = $('.columnpicker__menu');

                            selectorContent.append(list);
                        }
                    } else {
                        dropdownMenu.addClass('l-hidden');
                        dropdownBtn.removeClass('active');
                    }
                });
            }
        });
    }
]);

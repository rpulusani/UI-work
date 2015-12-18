/*
    Controller for the Column Picker Directive.
    Builds a list of links that modify the columns on
    a target Grid.
*/
define(['angular', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .controller('ColumnPickerController', ['$scope', '$element', '$attrs', '$translate',
        function(scope, element, attrs, translate) {
            var node = element[0],
            $ = require('jquery'),
            addColumn = function(column, gridOptions) {
                var i = 0,
                fnd = false;

                for (i; i < gridOptions.columnDefs.length; i += 1) {
                    if (gridOptions.columnDefs[i].field === column.field) {
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
                var listItem = angular.element('<div class="col-1-3">'),
                checkBoxWrapper = $('<div class="form__field form__field--checkbox"></div>'),
                checkbox = $('<input type="checkbox" id="' + column.name + '" name="' + column.field  + '" value="">'),
                checkboxLabel = $('<label for="' + column.name + '"><span></span> ' + column.name.replace(/\s*\(.*?\)\s*/g, '') + '</label>');

                checkBoxWrapper.append(checkbox);
                checkBoxWrapper.append(checkboxLabel);

                if (column.visible !== false) {
                    checkbox.checked = true;
                    checkboxLabel.addClass('form__field--is-checked');
                } else {
                    checkbox.checked = false;
                }

                checkbox.customInput();
                
                if (checkbox && (column.dynamic === undefined || column.dynamic === true)) {
                    checkbox.on('change', function(e) {
                        e.preventDefault();

                        if (checkbox.checked === false) {
                            checkbox.checked = true;
                            gridOptions = addColumn(column, gridOptions);
                            checkboxLabel.toggleClass('form__field--is-checked');
                        } else {
                            checkbox.checked = false;
                            gridOptions = removeColumn(column, gridOptions);
                            checkboxLabel.toggleClass('form__field--is-checked');
                        }

                        scope.$root.gridApi.core.refresh();
                        scope.$apply();
                    });

                    listItem.append(checkBoxWrapper);

                    return listItem;
                } else {
                    return false;
                }
            },
            possibleColumns = [],
            prop;

            scope.$on('setupColumnPicker', function(e, Grid) {
                // make sure we only answer this call once
                if (!element.hasClass('columnpicker')) {
                    var i = 0,
                    columnMax = 7,
                    columns = [],
                    list = angular.element('<div class="form"></div>'),
                    selectorContent,
                    links = [],
                    dropdownBtn = $(
                        '<div class="dropdown" data-column-count="' + Grid.gridOptions.columnDefs.length + '">' + 
                            '<button class="btn dropdown__trigger"><span class="dropdown__caret dropdown__caret--light"></span></button>' + 
                        '</div>'),
                    dropdownMenu = $('<div class="row l-hidden"><div class="col-1"><div class="columnpicker__menu"><h2>' + translate.instant('COLUMNPICKER.TITLE') + '</h2></div></div></div>');

                    element.addClass('columnpicker');
                    element.append(dropdownBtn);

                    element.on('click', function(evt) {
                        var parentWrapper = dropdownBtn.parent().parent();
                            
                        evt.preventDefault();

                        parentWrapper.after(dropdownMenu)

                        if (dropdownMenu.hasClass('l-hidden')) {
                            dropdownMenu.removeClass('l-hidden');

                            if (e.targetScope.gridOptions) {
                                if (Grid.gridOptions.columnDefs.length > 0) {
                                    columns = e.targetScope.gridOptions.columnDefs;
                                }

                                for (i; i < columns.length; i += 1) {
                                    if (columns[i].field !== 'bookmark' && !columns[i].inColumnSelector) {
                                        columns[i].inColumnSelector = true;
                                        links.push(createColumnSelection(columns[i], e.targetScope.gridOptions));
                                    }
                                }

                                i = 0;

                                for (i; i < links.length; i += 1) {
                                    list.append(links[i]);
                                }

                                selectorContent = $('.columnpicker__menu');

                                selectorContent.append(list)
                            }
                        } else {
                            dropdownMenu.addClass('l-hidden');
                        }
                    });
                }
            });
        }
    ]);
});

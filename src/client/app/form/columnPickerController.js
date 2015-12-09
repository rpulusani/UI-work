/*
    Controller for the Column Picker Directive.
    Builds a list of links that modify the columns on
    a target Grid.
*/
define(['angular', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.form')
    .controller('ColumnPickerController', ['$scope', '$element', '$attrs',
        function(scope, element, attrs) {
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
                var listItem = angular.element('<li>'),
                checkBoxWrapper = $('<div class="form__field form__field--checkbox"></div>'),
                checkbox = $('<input type="checkbox" id="' + column.name + '" name="' + column.field  + '" value="">'),
                checkboxLabel = $('<label for="' + column.name + '"><span></span> ' + column.name + '</label>');

                checkBoxWrapper.append(checkbox);
                checkBoxWrapper.append(checkboxLabel);

                if (column.visible !== false) {
                    checkbox.checked = true;
                    checkboxLabel.addClass('form__field--is-checked');
                } else {
                    checkbox.checked = false;
                }

                checkbox.customInput();
                
                if (checkbox) {
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
                var i = 0,
                columns = [],
                list = angular.element('<ul class="form"></ul>'),
                selectorContent,
                links = [],
                dropdown = $('<div class="dropdown"><button class="btn dropdown__trigger"><span class="dropdown__caret dropdown__caret--light"></span></button>' +
                    '<div class="dropdown__menu dropdown--500px"><div class="dropdown__menu-inner"><div class="row"><div class="col-1-2 l-pad">' + 
                    '<p class="selector-title">Column Selector</p><div class="selector-content"></div></div></div></div></div></div>');

                element.append(dropdown);
                
                dropdown.dropdown();

                if (e.targetScope.gridOptions) {
                    if (Grid.gridOptions.columnDefs.length > 0) {
                        columns = e.targetScope.gridOptions.columnDefs;
                    }

                    for (i; i < columns.length; i += 1) {
                        if (columns[i].field !== 'bookmark') {
                            links.push(createColumnSelection(columns[i], e.targetScope.gridOptions));
                        }
                    }

                    i = 0;

                    for (i; i < links.length; i += 1) {
                        list.append(links[i]);
                    }

                    element.append(dropdown);

                    selectorContent = $('.selector-content');

                    selectorContent.append(list)
                }
            });
        }
    ]);
});

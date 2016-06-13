/*
Controller for the Column Picker Directive.
Builds a list of links that modify the columns on
a target Grid.
*/

angular.module('mps.utility')
.controller('ColumnPickerController', ['$scope', '$element', '$attrs', '$translate', '$rootScope',
    function(scope, element, attrs, translate, $rootScope) {
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

            if (column.field !== 'select_all') {
                if (checkbox && (column.dynamic === undefined || column.dynamic === true)) {
                    checkbox.on('change', function(e) {
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

                    listItem.append(checkBoxWrapper);

                    return listItem;
                } else {
                    return false;
                }
            } else {
                checkbox.on('change', function(e) {
                    var i = 0;

                    e.preventDefault();

                    if (checkbox.checked === false) {
                        checkbox.checked = true;

                        for (i; i < columns.length; i += 1) {
                            console.log(i, columns.length, columns[i]);

                            if (columns[i].field !== 'select_all') {
                                gridOptions = addColumn(columns[i], gridOptions);
                            
                                checkboxLabel =  $('<label for="' + columns[i].name + '"><span></span> ' + columns[i].name.replace(/\s*\(.*?\)\s*/g, '') + '</label>');
                                checkboxLabel.toggleClass('form__field--is-checked');
                            }
                        }

                        $rootScope.$broadcast('columnPickerSelect', column);
                    } else {
                        checkbox.checked = false;

                        for (i; i < columns.length; i += 1) {
                            if (columns[i].field !== 'select_all') {
                                gridOptions = removeColumn(columns[i], gridOptions);
                                
                                checkboxLabel =  $('<label for="' + columns[i].name + '"><span></span> ' + columns[i].name.replace(/\s*\(.*?\)\s*/g, '') + '</label>');
                                checkboxLabel.toggleClass('form__field--is-checked');
                            }
                        }
                    
                        $rootScope.$broadcast('columnPickerDeselect', column);
                    }

                    scope.$root.gridApi.core.refresh();
                    scope.$apply();
                });

                listItem.append(checkBoxWrapper);

                return listItem;
            }
        },
        columns = [],
        prop;

        scope.$on('setupColumnPicker', function(e, Grid) {
            // make sure we only answer this call once
            if (!element.hasClass('columnpicker')) {
                var i = 0,
                columnMax = 7,
                list = angular.element('<div class="form"></div>'),
                selectorContent,
                links = [],
                dropdownBtn = $(
                    '<p class="l-visible--lt-laptop"><strong>' + translate.instant('COLUMNPICKER.CUSTOMIZE_COLUMNS') + '</strong></p><div class="dropdown columnpicker" data-column-count="' + Grid.gridOptions.columnDefs.length + '">' +
                        '<button class="btn dropdown__trigger"><i class="icon icon--ui icon--navicon-secondary rotate"></i></button>' +
                    '</div>'),
                dropdownMenu = $('<div class="row l-hidden"><div class="col-lg-3-4 col-md-1-1"><div class="row l-pad columnpicker__menu"><div class="col-1-1"><h2>' +
                    translate.instant('COLUMNPICKER.TITLE') + '</h2></div></div></div></div>');

                element.addClass('columnpicker');
                element.append(dropdownBtn);

                element.on('click', function(evt) {
                    var parentWrapper = dropdownBtn.parent().parent();

                    evt.preventDefault();

                    parentWrapper.after(dropdownMenu);

                    if (dropdownMenu.hasClass('l-hidden')) {
                        dropdownMenu.removeClass('l-hidden');
                        dropdownBtn.addClass('active');

                        if (e.targetScope.gridOptions) {
                            if (Grid.gridOptions.columnDefs.length > 0) {
                                columns = e.targetScope.gridOptions.columnDefs;

                                columns.push({
                                    field: 'select_all',
                                    name: 'Select All',
                                    visible: false
                                });
                            }

                            for (i; i < columns.length; i += 1) {
                                var hide = ((columns[i].showInColumnPicker !== undefined) && (columns[i].showInColumnPicker === false));

                                if (columns[i].field !== 'bookmark' && !hide) {
                                    columns[i].inColumnSelector = true;
                                    links.push(createColumnSelection(columns[i], e.targetScope.gridOptions));
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

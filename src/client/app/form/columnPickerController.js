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
            createColumnLink = function() {

            },
            setupColumnAdditionEvent = function () {

            },
            setupColumnRemovalEvent = function() {

            },
            createColumnSelection = function(scope, grid) {
                var newEle = document.createElement('a');
                newEle.href = '';
                newEle.innerHTML = 'HELLO WORLD';

                newEle = angular.element(newEle);

                newEle.on('click', function(e) {
                    e.preventDefault();

                    scope.gridOptions.params = {};
                    scope.gridOptions.columnDefs.push({name: 'Test', field: 'email'});

                    grid.update(scope, grid.gridOptions)

                    scope.$apply();
                });

                node.appendChild(newEle[0])
            },
            gridDefinition;
          
            scope.$on('setupColumnPicker', function(e, Grid) {
                var i = 0,
                columns = [];

                if (Grid.gridOptions) {

                    if (Grid.gridOptions.columnDefs.length > 0) {
                        columns = Grid.gridOptions.columnDefs;
                    }

                    for (i; i < columns.length; i += 1) {
                        console.log(columns[i]);
                    }

                    createColumnSelection(e.targetScope, Grid);
                }
            });
        }
    ]);
});

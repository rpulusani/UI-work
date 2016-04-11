angular.module('mps.form')
.controller('DatePickerController', ['$scope', '$element', '$attrs',
    function(scope, element, attrs) {
        var node = element[0],
        calendar;
        var rome = require('rome');
        node.type = 'text';

        if (scope.beforeEq !== undefined && scope.beforeEq !== null) {
            attrs.dateValidator = rome.val.beforeEq(scope.beforeEq);
        }

        if (scope.afterEq !== undefined && scope.afterEq !== null) {
            attrs.dateValidator = rome.val.afterEq(scope.afterEq);
        }

        if (!attrs.time) {
            attrs.time = false;
        } else if (!attrs.inputFormat){
            attrs.inputFormat = 'YYYY-MM-DD HH:mm';
        }

        if (!attrs.inputFormat) {
            attrs.inputFormat = 'YYYY-MM-DD';
        }

        calendar = rome(node, attrs);

        // Watch was avoided due to performance concerns
        calendar.on('data', function(val) {
            scope.dateVal = val;
            scope.$apply();
        });

        calendar.on('show', function() {
            if (scope.beforeEq !== undefined && scope.beforeEq !== null) {
                attrs.dateValidator = rome.val.beforeEq(scope.beforeEq);
            }

            if (scope.afterEq !== undefined && scope.afterEq !== null) {
                attrs.dateValidator = rome.val.afterEq(scope.afterEq);
            }
        });

        // Add apply() call to top of event queue; hence 0 milliseconds
        setTimeout(function() {
            scope.$apply();
        }, 0);

    }
]);


angular.module('mps.form')
.controller('DatePickerController', ['$scope', '$element', '$attrs',
    function(scope, element, attrs) {
        var node = element[0],
        calendar,
        rome = require('rome');
        
        node.type = 'text';

        if (scope.beforeEq !== undefined && scope.beforeEq !== null) {
            attrs.dateValidator = rome.val.beforeEq(scope.beforeEq);
        }

        if (scope.beforeEqNow !== undefined && scope.beforeEqNow !== null) {
            var dt = new Date();
            attrs.dateValidator = rome.val.beforeEq(dt);
        }

        if (scope.afterEq !== undefined && scope.afterEq !== null) {
            attrs.dateValidator = rome.val.afterEq(scope.afterEq);
        }

        if (!attrs.time) {
            attrs.time = false;
        }

        if (!attrs.inputFormat){
            attrs.inputFormat = 'YYYY-MM-DD HH:mm';
        }

        calendar = rome(node, attrs);

        calendar.on('data', function(val) {
            scope.dateVal = val;
            scope.$apply();
        });

        calendar.on('show', function() {
            if (scope.beforeEq !== undefined && scope.beforeEq !== null) {
                attrs.dateValidator = rome.val.beforeEq(scope.beforeEq);
            }

            if (scope.beforeEqNow !== undefined && scope.beforeEqNow !== null) {
                var dt = new Date();
                attrs.dateValidator = rome.val.beforeEq(dt);
            }

            if (scope.afterEq !== undefined && scope.afterEq !== null) {
                attrs.dateValidator = rome.val.afterEq(scope.afterEq);
            }
        });

        scope.$watchGroup(['min', 'max'], function(newValArr, oldValArr, ctrlScope) {
            if (ctrlScope.min && !attrs.min) {
                attrs.min = ctrlScope.min;
            }

            if (ctrlScope.max && !attrs.max) {
                attrs.max = ctrlScope.max;
            }

            calendar.options(attrs)
        });

        // Add apply() call to top of event queue
        setTimeout(function() {
            scope.$apply();
        }, 0);
    }
]);


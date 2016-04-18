angular.module('mps.form')
.controller('DatePickerController', ['$scope', '$element', '$attrs',
    function(scope, element, attrs) {
        var node = element[0],
        calendar,
        rome = require('rome');
        
        node.type = 'text';
       
        if(attrs.beforeEq){
            attrs.dateValidator = rome.val.before(attrs.beforeEq);
        }

        if (!attrs.time) {
            attrs.time = false;
        }

        if (!attrs.inputFormat){
            attrs.inputFormat = 'YYYY-MM-DD HH:mm';
        }

        if (scope.dateValidator) {
            attrs.dateValidator = scope.dateValidator;
        }

        calendar = rome(node, attrs);

        calendar.on('data', function(val) {
            scope.dateVal = val;
            scope.$apply();
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


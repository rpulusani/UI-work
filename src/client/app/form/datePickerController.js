angular.module('mps.form')
.controller('DatePickerController', ['$scope', '$element', '$attrs',
    function(scope, element, attrs) {
        var node = element[0],
        calendar;
        var rome = require('rome');
        node.type = 'text';
       
        if(attrs.beforeEq){
            attrs.dateValidator = rome.val.before(attrs.beforeEq);
        }

        if (!attrs.time) {
            attrs.time = false;
        } else if (!attrs.inputFormat){
            attrs.inputFormat = 'YYYY-MM-DD HH:mm';
        }

        if (!attrs.inputFormat) {
            attrs.inputFormat = 'YYYY-MM-DD';
        }

        if (scope.dateValidator) {
            attrs.dateValidator = scope.dateValidator;
        }

        calendar = rome(node, attrs);

        // Watch was avoided due to performance concerns
        calendar.on('data', function(val) {
            scope.dateVal = val;
            scope.$apply();
        });

        // Add apply() call to top of event queue; hence 0 milliseconds
        setTimeout(function() {
            scope.$apply();
        }, 0);
    }
]);


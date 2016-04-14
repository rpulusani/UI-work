angular.module('mps.form')
.controller('DatePickerController', ['$scope', '$element', '$attrs',
    function(scope, element, attrs) {
        var node = element[0],
        calendar,
        rome = require('rome');
        
        console.log(rome.scope);

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

        if (scope.min && !attrs.min) {
            attrs.min = scope.min;
        }

        if (scope.max && !attrs.max) {
            attrs.max = scope.max;
        }

        console.log(scope);
        console.log(attrs);

        calendar = rome(node, attrs);

        // Watch was avoided due to performance concerns
        calendar.on('data', function(val) {
            scope.dateVal = val;
            scope.$apply();
        });

        scope.$watch(['min', 'max'], function(x, y, updatedScope) {
            console.log('lol', arguments)
        });

        // Add apply() call to top of event queue; hence 0 milliseconds
        setTimeout(function() {
            scope.$apply();
        }, 0);
    }
]);


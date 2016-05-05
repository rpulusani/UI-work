angular.module('mps.form')
.controller('DatePickerController', ['$scope', '$element', '$attrs','FormatterService',
    function(scope, element, attrs,formatter) {
        var node = element[0],
        calendar,
        rome = require('rome'),
        setupCalendar = function(calendar) {
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
        };
        
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
        } else if (!attrs.inputFormat){
            attrs.inputFormat = 'YYYY-MM-DD HH:mm';
        }

        if (!attrs.inputFormat) {
            attrs.inputFormat = 'YYYY-MM-DD';
        }

        calendar = rome(node, attrs);

        setupCalendar(calendar);

        scope.$watchGroup(['min', 'max'], function(newValArr, oldValArr, ctrlScope) {
            if (ctrlScope.min && !attrs.min) {
                attrs.min = ctrlScope.min;
            }

            if (ctrlScope.max && !attrs.max) {
                attrs.max = ctrlScope.max;
            }
            //This is to check whether max and min is same. As if its equal Rome will throw error. Hence using afterEq as max.
            attrs.min=formatter.formatDateForRome(attrs.min);
            if((ctrlScope.min && ctrlScope.max) || (attrs.min && attrs.max)){
                var max=new Date(attrs.max);
                var min=new Date(attrs.min);
                if(max.getFullYear() === min.getFullYear() && max.getMonth() === min.getMonth() && max.getDate() === min.getDate()){
                	attrs.dateValidator = rome.val.afterEq(attrs.max);
                	delete attrs.min;
                }
            }
            if (attrs.min){
            	attrs.min = attrs.min + ' 00:00';
            }
            if (attrs.max){
            	attrs.max = attrs.max + ' 23:59';
            }
            calendar.options(attrs);

            setupCalendar(calendar);
        });

        // Add apply() call to top of event queue
        setTimeout(function() {
            scope.$apply();
        }, 0);
    }
]);


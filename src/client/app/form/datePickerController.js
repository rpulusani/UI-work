define(['angular', 'rome'], function(angular, Rome) {
    
    angular.module('mps.form')
    .controller('DatePickerController', ['$scope', '$element', '$attrs',
        function(scope, element, attrs) {
            var node = element[0],
            calendar;

            node.type = 'text';

            if (!attrs.inputFormat) {
                attrs.inputFormat = 'YYYY-MM-DD';
            }

            if (!attrs.time) {
                attrs.time = false;
            }

            calendar = Rome(node, attrs);

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
});

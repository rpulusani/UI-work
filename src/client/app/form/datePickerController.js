define(['angular', 'chartjs', 'rome', 'chart'], function(angular, ChartJs, Rome) {
    'use strict';
    angular.module('mps.form')
    .controller('DatePickerController', ['$scope', '$element', '$attrs',
        function(scope, element, attrs) {
            var node = element[0],
            calendar;

            if (!attrs.inputFormat) {
                attrs.inputFormat = 'YYYY-MM-DD';
            }

            calendar = Rome(node, attrs);

            // Watch was avoided due to performance concerns
            calendar.on('data', function(val) {
                scope.dateVal = val;
            });

            // Add apply() call to top of event queue; hence 0 milliseconds
            setInterval(function() {
                scope.$apply();
            }, 0);
        }
    ]);
});

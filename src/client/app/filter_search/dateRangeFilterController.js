define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('DateRangeFilterController', ['$scope', '$translate', 'FormatterService',
        function($scope, $translate, formatter) {

            $scope.$watch('dateFrom', function(dateFrom) {
                if (dateFrom) {
                    $scope.params['from'] = formatter.formatDateForPost(dateFrom);
                    $scope.filterDef($scope.params);
                }
            });

            $scope.$watch('dateTo', function(dateTo) {
                if (dateTo) {
                    $scope.params['to'] = formatter.formatDateForPost(dateTo);
                    $scope.filterDef($scope.params);
                }
            });
        }
    ]);
});

define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('InvoiceDateFilterController', ['$scope', '$translate', 'FormatterService',
        function($scope, $translate, formatter) {

            $scope.$watch('dateFrom', function(dateFrom) {
                if (dateFrom) {
                    $scope.params['fromDate'] = dateFrom;
                    $scope.filterDef($scope.params);
                }
            });

            $scope.$watch('dateTo', function(dateTo) {
                if (dateTo) {
                    $scope.params['toDate'] = dateTo;
                    $scope.filterDef($scope.params);
                }
            });
        }
    ]);
});

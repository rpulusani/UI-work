define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('DateRangeFilterController', ['$scope', '$translate', 'FormatterService',
        function($scope, $translate, formatter) {
            // $scope.filterByDate = function(){
            //     if(($scope.dateFrom || $scope.dateTo) && $scope.filterDef && typeof $scope.filterDef === 'function'){
            //         if ($scope.dateFrom) {
            //             $scope.params['from'] = formatter.formatDateForPost($scope.dateFrom);
            //         }
            //         if ($scope.dateTo) {
            //             $scope.params['to'] = formatter.formatDateForPost($scope.dateTo);
            //         }
            //         $scope.filterDef($scope.params);
            //     }
            // };

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

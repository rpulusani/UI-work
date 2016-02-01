define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('InvoiceDateFilterController', ['$scope', '$translate', 'FormatterService',
        function($scope, $translate, formatter) {
            $scope.showClearMessage = false;
            $scope.$watch('dateFrom', function(dateFrom) {
                if (dateFrom) {
                    $scope.showClearMessage = true;
                    $scope.params['fromDate'] = dateFrom;
                    $scope.filterDef($scope.params, ['roles', 'activeStatus', 'invitedStatus']);
                }
            });

            $scope.$watch('dateTo', function(dateTo) {
                if (dateTo) {
                    $scope.showClearMessage = true;
                    $scope.params['toDate'] = dateTo;
                    $scope.filterDef($scope.params, ['roles', 'activeStatus', 'invitedStatus']);
                }
            });

            $scope.clearDateFilter = function(){
                if($scope.filterDef && typeof $scope.filterDef === 'function'){
                    $scope.dateFrom = '';
                    $scope.dateTo = '';
                    $scope.params = {};
                    $scope.filterDef($scope.params, ['fromDate', 'toDate', 'roles', 'activeStatus', 'invitedStatus']);
                }
            };
        }
    ]);
});

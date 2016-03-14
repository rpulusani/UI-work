
angular.module('mps.filterSearch')
.controller('DateRangeFilterController', ['$scope', '$translate', 'FormatterService',
    function($scope, $translate, formatter) {
        $scope.showClearMessage = false;
        $scope.$watch('dateFrom', function(dateFrom) {
            if (dateFrom) {
                $scope.showClearMessage = true;
                $scope.params['from'] = formatter.formatDateForPost(dateFrom);
                $scope.filterDef($scope.params, ['location', 'status', 'chlFilter', 'requesterFilter']);
            }
        });

        $scope.$watch('dateTo', function(dateTo) {
            if (dateTo) {
                $scope.showClearMessage = true;
                $scope.params['to'] = formatter.formatDateForPost(dateTo);
                $scope.filterDef($scope.params, ['location', 'status', 'chlFilter', 'requesterFilter']);
            }
        });

        $scope.clearDateFilter = function(){
            if($scope.filterDef && typeof $scope.filterDef === 'function'){
                $scope.dateFrom = '';
                $scope.dateTo = '';
                $scope.params = {};
                $scope.filterDef($scope.params, ['from', 'to', 'location', 'status', 'chlFilter', 'requesterFilter']);
            }
        };
    }
]);

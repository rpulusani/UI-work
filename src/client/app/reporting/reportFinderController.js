

angular.module('mps.report')
.controller('ReportFinderController', ['$scope', '$route', '$location', '$translate', 'Reports', '$filter', 
    function($scope, $route, $location, $translate, Reports, $filter) {

        $scope.report = Reports.item;
        $scope.finder = Reports.finder;

        $scope.$watch('finder.dateTo', function(dateTo){
            $scope.finder.dateToRange = new Date(dateTo);
            $scope.finder.dateToRange.setMonth($scope.finder.dateToRange.getMonth() - 13);
            $scope.finder.dateToRange = $filter('date')($scope.finder.dateToRange, 'yyyy-MM-dd');
        });

        $scope.$watch('finder.dateFrom', function(dateFrom){
            $scope.finder.dateFromRange = new Date(dateFrom);
            $scope.finder.dateFromRange.setMonth($scope.finder.dateFromRange.getMonth() + 13);
            $scope.finder.dateFromRange = $filter('date')($scope.finder.dateFromRange, 'yyyy-MM-dd');
        });
        
        $scope.runReport = function(report) {
            var newRoute = '';

            Reports.finder = $scope.finder;

            if (Reports.finder.selectType === $translate.instant('LABEL.COMMON.SELECT')) {
                Reports.finder.selectType = '';
            }

            Reports.setItem(report);
            Reports.isRun = true;

            newRoute = Reports.route + '/' + Reports.item.id + '/results';

            if ($location.path() === newRoute) {
                $route.reload();
            } else {
                $location.path(newRoute);
            }
        };
    }
]);


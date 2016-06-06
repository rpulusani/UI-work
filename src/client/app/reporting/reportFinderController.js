

angular.module('mps.report')
.controller('ReportFinderController', ['$scope', '$route', '$location', '$translate', 'Reports',
    function($scope, $route, $location, $translate, Reports) {

        $scope.report = Reports.item;
        $scope.finder = Reports.finder;

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


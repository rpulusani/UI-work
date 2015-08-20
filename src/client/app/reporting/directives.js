'use strict';
angular.module('mps.navigation')
.directive('reportNavigation', function() {
    return {
        restrict: 'E',
        templateUrl: '/app/navigation/templates/report-navigation.html',
        controller: 'ReportingController'
    };
});

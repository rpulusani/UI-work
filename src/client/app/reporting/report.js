'use strict';
angular.module('mps.report', []).config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/reporting', {
        templateUrl: '/app/reporting/templates/reporting-home.html'
    })
}]);

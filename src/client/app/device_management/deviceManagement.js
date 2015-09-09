'use strict';
angular.module('mps.deviceManagement', []).config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/device_management', {
        templateUrl: '/app/device_management/templates/device-management-home.html'
    });
}]);

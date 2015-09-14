'use strict';
angular.module('mps.invoice', []).config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/invoices', {
        templateUrl: '/app/invoices/templates/invoices-home.html'
    });
}]);

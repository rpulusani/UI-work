define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequests', ['mps.utility']).config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
        .when('/service_requests', {
            templateUrl: '/app/service_requests/templates/service-request-dashboard.html'
        })
        .when('/service_requests/order_request', {
            templateUrl: '/app/service_requests/templates/create-service-request.html'
        });
    }]);
});

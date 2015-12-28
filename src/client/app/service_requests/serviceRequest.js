define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequests', ['mps.utility']).config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
        .when('/service_requests', {
            templateUrl: '/app/service_requests/templates/service-request-dashboard.html',
            controller: 'ServiceRequestListController'
        })
        .when('/service_requests/requests/overview', {
            templateUrl: '/app/service_requests/templates/service-request-request-overview.html',
            activeItem: '/service_requests'
        })
        .when('/service_requests/order_request', {
            templateUrl: '/app/service_requests/templates/create-service-request.html',
            activeItem: '/service_requests/order_request'
        })
        .when('/service_requests/review-test', {
            templateUrl: '/app/service_requests/templates/review.html',
            activeItem: '/service_requests'
        });
    }]);
});

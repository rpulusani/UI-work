define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequests', ['mps.utility']).config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
        .when('/service_requests', {
            templateUrl: '/app/service_requests/templates/service-request-dashboard.html',
            controller: 'ServiceRequestTabController',
            activeItem: '/service_requests?tab=serviceRequestsAllTab',
            reloadOnSearch: false
        })
        .when('/service_requests/learn_more', {
            templateUrl: '/app/service_requests/templates/learn-more.html',
            activeItem: '/service_requests?tab=serviceRequestsAllTab'
        })
        .when('/service_requests/requests/overview', {
            templateUrl: '/app/service_requests/templates/service-request-request-overview.html',
            activeItem: '/service_requests?tab=serviceRequestsAllTab'
        })
        .when('/service_requests/order_request', {
            templateUrl: '/app/service_requests/templates/create-service-request.html',
            activeItem: '/service_requests?tab=serviceRequestsAllTab'
        })
        .when('/service_requests/:id/receipt', {
            templateUrl: '/app/service_requests/templates/receipt.html',
            controller:'ServiceRequestDetailController',
            activeItem: '/service_requests?tab=serviceRequestsAllTab'
        })
        .when('/service_requests/review-test', {
            templateUrl: '/app/service_requests/templates/review.html',
            activeItem: '/service_requests?tab=serviceRequestsAllTab'
        })
        .when('/service_requests/:id/cancel/:type', {
            templateUrl: '/app/service_requests/templates/review.html',
            controller:'ServiceRequestCancelController',
            activeItem: '/service_requests?tab=serviceRequestsAllTab'
        })
        .when('/service_requests/:id/cancel/:type/receipt', {
            templateUrl: '/app/service_requests/templates/receipt.html',
            controller: 'ServiceRequestCancelController',
            activeItem: '/service_requests?tab=serviceRequestsAllTab'
        })
        .when('/service_requests/:id/update/:type', {
            templateUrl: '/app/service_requests/templates/review.html',
            controller:'ServiceRequestUpdateController',
            activeItem: '/service_requests?tab=serviceRequestsAllTab'
        })
        .when('/service_requests/:id/update/:type/receipt', {
            templateUrl: '/app/service_requests/templates/receipt.html',
            controller: 'ServiceRequestUpdateController',
            activeItem: '/service_requests?tab=serviceRequestsAllTab'
        })
        .when('/service_requests/pick_contact/:source', {
            templateUrl: '/app/address_service_requests/templates/contact-picker.html',
            controller: 'ContactPickerController',
            activeItem: '/service_requests?tab=serviceRequestsAllTab'
        });
    }]);
});

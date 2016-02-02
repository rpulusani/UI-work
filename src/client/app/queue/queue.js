define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.queue', ['mps.utility']).config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
        .when('/queue', {
            templateUrl: '/app/queue/dashboard.html',
            controller: '',
            activeItem: ''
        });
    }]);
});

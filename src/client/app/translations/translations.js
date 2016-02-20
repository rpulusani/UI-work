define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.translation', []).config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
        .when('/translations', {
            templateUrl: '/app/translations/templates/view.html',
            controller: 'TranslationListController',
            activeItem: '/translations'
        })
        .when('/translations/review', {
            templateUrl: '/app/translations/templates/review.html',
            controller: 'ManageTranslationController',
            activeItem: '/translations'
        })
        .when('/translations/export', {
            templateUrl: '/app/translations/templates/export.html',
            controller: 'ExportController',
            activeItem: '/translations'
        });
    }]);
});

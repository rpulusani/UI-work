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
    }]);
});

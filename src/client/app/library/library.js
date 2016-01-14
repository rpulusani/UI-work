define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.library', []).config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        .when('/library', {
            templateUrl: '/app/library/templates/view.html',
            controller: 'LibraryListController'
        })
        .when('/library/:id/view', {
            templateUrl: '/app/library/templates/document.html',
            controller: 'LibraryViewController'
        })
        .when('/library/add', {
            templateUrl: '/app/library/templates/add.html',
            controller: 'LibraryAddController'
        });
    }]);
});

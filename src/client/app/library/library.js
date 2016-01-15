define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.library', []).config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        .when('/library', {
            templateUrl: '/app/library/templates/view.html',
            activeItem: '/library',
            controller: 'LibraryListController'
        })
        .when('/library/:id/view', {
            templateUrl: '/app/library/templates/view-document.html',
            activeItem: '/library',
            controller: 'LibraryViewController'
        })
        .when('/library/:id/update', {
            templateUrl: '/app/library/templates/update-document.html',
            activeItem: '/library',
            controller: 'LibraryUpdateController'
        })
        .when('/library/new', {
            templateUrl: '/app/library/templates/new-document.html',
            activeItem: '/library',
            controller: 'LibraryNewController'
        });
    }]);
});

define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.library', []).config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        .when('/library', {
            templateUrl: '/app/library/templates/view.html',
            controller: 'LibraryListController'
        })
        .when('/library/:id/view', {
            templateUrl: '/app/library/templates/view-document.html',
            controller: 'LibraryViewController'
        })
        .when('/library/:id/update', {
            templateUrl: '/app/library/templates/update-document.html',
            controller: 'LibraryUpdateController'
        })
        .when('/library/new', {
            templateUrl: '/app/library/templates/new-document.html',
            controller: 'LibraryNewController'
        });
    }]);
});

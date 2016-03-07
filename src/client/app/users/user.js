
'use strict';
angular.module('mps.user', []).config(['$routeProvider', 'UrlHelper',
function ($routeProvider, UrlHelper) {

    var templateUrl = UrlHelper.user_template;

    $routeProvider
    .when('/delegated_admin', {
        templateUrl: '/app/users/templates/view.html',
        controller: 'UsersController'
    })
    .when('/impersonate', {
        templateUrl: '/app/users/templates/impersonate-view.html',
        controller: 'ImpersonateUserListController',
        activeItem: '/impersonate'
    })
    .when('/delegated_admin/return/:returnParam', {
        templateUrl: '/app/users/templates/view.html',
        controller: 'UsersController',
        activeItem: '/delegated_admin'
    })
    .when('/delegated_admin/new', {
        templateUrl: '/app/users/templates/new.html',
        controller: 'UserAddController',
        activeItem: '/delegated_admin'
    })
    .when('/delegated_admin/invite_user', {
        templateUrl: '/app/users/templates/invite-user.html',
        controller: 'UserAddController',
        activeItem: '/delegated_admin'
    })
    .when('/delegated_admin/lexmark_user', {
        templateUrl: '/app/users/templates/lexmark-user.html',
        controller: 'LexmarkUserListController',
        activeItem: '/delegated_admin'
    })
    .when('/delegated_admin/:id/review', {
        templateUrl: '/app/users/templates/review.html',
        controller: 'ManageUserController',
        activeItem: '/delegated_admin'
    })
    .when('/delegated_admin/:id/lexmark-review', {
        templateUrl: '/app/users/templates/lexmark-review.html',
        controller: 'LexmarkUserAddController',
        activeItem: '/delegated_admin'
    })
    .when('/delegated_admin/:id/cancel', {
        templateUrl: '/app/users/templates/invite-user.html',
        controller: 'ManageUserController',
        activeItem: '/delegated_admin'
    });
}]);



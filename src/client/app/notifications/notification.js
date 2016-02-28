

angular.module('mps.notifications', []).config(['$routeProvider',
function($routeProvider) {
    $routeProvider
    .when('/notifications', {
        templateUrl: '/app/notifications/templates/view.html',
        controller: 'NotificationListController',
        activeItem: '/notifications'
    })
    .when('/notifications/new', {
        templateUrl: '/app/notifications/templates/new.html',
        controller: 'CreateNotificationController',
        activeItem: '/notifications'
    })
    .when('/notifications/review', {
        templateUrl: '/app/notifications/templates/review.html',
        controller: 'ManageNotificationController',
        activeItem: '/notifications'
    });
}]);




angular.module('mps.notifications')
.directive('notificationFields', function(){
    return {
        restrict: 'A',
        templateUrl : '/app/notifications/templates/notification-fields.html'
    };
})
.directive('notificationFormButtons', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/notifications/templates/notification-form-buttons.html'
    };
})
.directive('notificationUpdateButtons', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/notifications/templates/notification-update-buttons.html'
    };
})
.directive('notificationInlineDelete', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/notifications/templates/notification-inline-delete.html',
        replace: true,
        scope: { onConfirmDelete: '&' },
        controller: 'notificationDeleteInlineController'
    };
});


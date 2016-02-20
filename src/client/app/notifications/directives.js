define(['angular', 'notification'], function(angular) {
    'use strict';
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
    });
});

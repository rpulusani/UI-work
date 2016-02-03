define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.queue')
    .directive('queueAlert', function() {
        console.log('hi');
        return {
            restrict: 'A',
            templateUrl:'/app/queue/templates/queue-alert.html',
            scope: {},
            controller: 'QueueNotificationController'
        };
    });
});

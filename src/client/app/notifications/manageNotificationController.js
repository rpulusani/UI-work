
'use strict';
angular.module('mps.notifications')
.controller('ManageNotificationController', ['$scope', '$location', '$rootScope', 'Notifications', '$q', 'FormatterService',
    'BlankCheck', '$http',
    function($scope, $location, $rootScope, Notifications, $q, FormatterService, BlankCheck, $http) {
        $scope.notificationLength = 0;
        $scope.notificationInfo = {};
        var redirect_to_list = function() {
           $location.path(Notifications.route + '/');
        };

        if (Notifications.item === null) {
            redirect_to_list();
        } else {
            $scope.notification = Notifications.item.data;
            console.log('Notifications.item', Notifications.item);
            console.log('$scope.notification', $scope.notification);
            $scope.notification.startDate = Notifications.item.startDate;
            $scope.notification.endDate = Notifications.item.endDate;
            if (BlankCheck.checkNotBlank($scope.notification.startDate)) {
                $scope.notification.startDate = FormatterService.formatDateForAdmin($scope.notification.startDate);
            }
            if (BlankCheck.checkNotBlank($scope.notification.endDate)) {
                $scope.notification.endDate = FormatterService.formatDateForAdmin($scope.notification.endDate);
            }
        }


        var updateNotificationObjectForUpdate = function() {
            Notifications.newMessage();
            $scope.notificationInfo = Notifications.item;
            Notifications.addField('key', $scope.notification.key);
            Notifications.addField('type', $scope.notification.type);
            Notifications.addField('module', $scope.notification.module);
            Notifications.addField('subModule', $scope.notification.subModule);
            if (BlankCheck.checkNotBlank($scope.notification.startDate)) {
                Notifications.addField('startDate', FormatterService.formatDateForAdmin($scope.notification.startDate));
            }
            if (BlankCheck.checkNotBlank($scope.notification.endDate)) {
                Notifications.addField('endDate', FormatterService.formatDateForAdmin($scope.notification.endDate));
            }
            Notifications.addField('actualValue', $scope.notification.actualValue);
            Notifications.addField('order', $scope.notification.order);
            Notifications.addField('url', $scope.notification.url);
            Notifications.addField('values', $scope.notification.values);
        };

        $scope.update = function() {
            updateNotificationObjectForUpdate();
            Notifications.item.postURL = Notifications.url + '/' + $scope.notificationInfo.key;
            var options = {
                preventDefaultParams: true
            }
            var deferred = Notifications.put({
                item:  $scope.notificationInfo
            }, options);

            deferred.then(function(result){
                $location.path('/notifications');
            }, function(reason){
                NREUM.noticeError('Failed to update Notification because: ' + reason);
            });
        };

        $scope.delete = function() {
            $http({
                method: 'DELETE',
                url: Notifications.item.url
            }).then(function(response) {
                $location.path('/notifications');
            }, function(response) {
                NREUM.noticeError('Failed to DELETE notification: ' + response.statusText);
            });
        };
    }
]);


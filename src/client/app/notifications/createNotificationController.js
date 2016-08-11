

angular.module('mps.notifications')
.controller('CreateNotificationController', ['$scope', '$location', '$rootScope', 'Notifications', '$q', 'FormatterService', 'BlankCheck',
    function($scope, $location, $rootScope, Notifications, $q, FormatterService, BlankCheck) {
        $scope.notificationLength = 0;
        $scope.notificationInfo = {};
        $scope.min = FormatterService.formatLocalDateForRome(new Date());//This is used in date Picker
        $scope.isDateValidated = "";

        Notifications.get().then(function(){
            $scope.notificationLength = parseInt(Notifications.data.length) + 1;
        });

        var updateNotificationObjectForSubmit = function() {
            Notifications.newMessage();
            var notificationValue = {"EN": $scope.notification.actualValue};
            $scope.notificationInfo = Notifications.item;
            Notifications.addField('key', 'NOTIFICATION_' + $scope.notification.subModule);
            Notifications.addField('type', 'NOTIFICATION');
            Notifications.addField('module', 'NOTIFICATION');
            Notifications.addField('subModule', $scope.notification.subModule);
            if (BlankCheck.checkNotBlank($scope.notification.startDate)) {
                Notifications.addField('startDate', FormatterService.formatDateForPost($scope.notification.startDate));
            }
            if (BlankCheck.checkNotBlank($scope.notification.endDate)) {
                Notifications.addField('endDate', FormatterService.formatDateForPost($scope.notification.endDate));
            }
            Notifications.addField('actualValue', $scope.notification.actualValue);
            Notifications.addField('order', $scope.notificationLength);
            Notifications.addField('url', $scope.notification.url);
            Notifications.addField('values', notificationValue);
        };
        $scope.isLoading=false;
        $scope.save = function() {
            $scope.isLoading=true;
            $scope.checkNotificationDates();
            if(!$scope.isDateValidated) {
                return false;
            }
            updateNotificationObjectForSubmit();
            Notifications.item.postURL = Notifications.url;
            var deferred = Notifications.post({
                item:  $scope.notificationInfo
            });

            deferred.then(function(result){
                $scope.isLoading=false;
                $location.path('/notifications');
            }, function(reason){
                NREUM.noticeError('Failed to create Notification because: ' + reason);
            });
        };
        
        $scope.checkNotificationDates = function(){
            if($scope.notification.endDate && $scope.notification.startDate) {
                $scope.isDateValidated = false;
                if($scope.notification.endDate >= $scope.notification.startDate){
                    $scope.isDateValidated = true;
                }
            }
        };
    }
]);


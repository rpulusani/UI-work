

angular.module('mps.notifications')
.controller('ManageNotificationController', ['$scope', '$location', '$rootScope', 'Notifications', '$q', 'FormatterService',
    'BlankCheck', '$http',
    function($scope, $location, $rootScope, Notifications, $q, FormatterService, BlankCheck, $http) {
        $scope.notificationLength = 0;
        $scope.notificationInfo = {};
        $scope.min = FormatterService.formatLocalDateForRome(new Date());//This is used in date Picker
        $scope.isDateValidated = "";
        
        var redirect_to_list = function() {
           $location.path(Notifications.route + '/');
        };

        if (Notifications.item === null) {
            redirect_to_list();
        } else {
            $scope.notification = Notifications.item.data;
            $scope.notification.startDate = Notifications.item.startDate;
            $scope.notification.endDate = Notifications.item.endDate;
            if (BlankCheck.checkNotBlank($scope.notification.startDate)) {
                $scope.notification.startDate = FormatterService.formatUTCToLocalTime($scope.notification.startDate);
            }
            if (BlankCheck.checkNotBlank($scope.notification.endDate)) {
                $scope.notification.endDate = FormatterService.formatUTCToLocalTime($scope.notification.endDate);
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
                Notifications.addField('startDate', FormatterService.formatDateForPost($scope.notification.startDate));
            }
            if (BlankCheck.checkNotBlank($scope.notification.endDate)) {
                Notifications.addField('endDate', FormatterService.formatDateForPost($scope.notification.endDate));
            }
            Notifications.addField('actualValue', $scope.notification.actualValue);
            Notifications.addField('order', $scope.notification.order);
            Notifications.addField('url', $scope.notification.url);
            Notifications.addField('values', $scope.notification.values);
        };
        $scope.isLoading=false;
        $scope.update = function() {
            $scope.isLoading=true;
            $scope.checkNotificationDates();
            if(!$scope.isDateValidated) {
                return false;
            }
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
            $scope.isLoading=true;
            $http({
                method: 'DELETE',
                url: Notifications.item.url
            }).then(function(response) {
                $location.path('/notifications');
            }, function(response) {
                NREUM.noticeError('Failed to DELETE notification: ' + response.statusText);
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


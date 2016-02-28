

angular.module('mps.notifications')
.controller('NotificationListController', [
    '$scope',
    '$location',
    '$rootScope',
    'Notifications',
    'grid',
    'PersonalizationServiceFactory',
    'FilterSearchService',
    '$http',
    '$route',
    function(
        $scope,
        $location,
        $rootScope,
        Notifications,
        Grid,
        Personalize,
        FilterSearchService,
        $http,
        $route) {
        $rootScope.currentRowList = [];
        Notifications.setParamsToNull();
        var personal = new Personalize($location.url(),$rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(Notifications, $scope, $rootScope, personal, 'defaultSet');

        $scope.view = function(notification){
          Notifications.setItem(notification);
            Notifications.item.get().then(function(){
                $location.path(Notifications.route + '/review');
            });
        };

        $scope.delete = function(notification) {
            Notifications.setItem(notification);
            $http({
                method: 'DELETE',
                url: Notifications.item.url
            }).then(function(response) {
                $route.reload();
            }, function(response) {
                NREUM.noticeError('Failed to DELETE notification: ' + response.statusText);
            });
        };

        $scope.goToCreate = function() {
            $location.path('/notifications/new');
        };

        filterSearchService.addBasicFilter('All Notifications', {'sort': 'order,ASC'}, undefined,
            function(Grid) {}
        );
    }
]);


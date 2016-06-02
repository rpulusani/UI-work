

angular.module('mps.notifications')
.controller('NotificationListController', [
    '$scope',
    '$location',
    '$rootScope',
    'Notifications',
    'SecurityHelper',
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
        SecurityHelper,
        Grid,
        Personalize,
        FilterSearchService,
        $http,
        $route) {
        
        if(!$rootScope.translationAdminAccess){
            new SecurityHelper($rootScope).confirmPermissionCheck("translationAdminAccess");    
        }
        $rootScope.currentRowList = [];
        Notifications.setParamsToNull();
        var personal = new Personalize($location.url(),$rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(Notifications, $scope, $rootScope, personal, 'defaultSet');

        $scope.showDeleted = false;        
        if(Notifications.item) { 
            if(Notifications.isDeleted) {
                $scope.showDeleted = true;
                Notifications.isDeleted = false;
            }
        }

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
                Notifications.isDeleted = true;
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


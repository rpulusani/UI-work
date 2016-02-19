define(['angular','notification', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.notifications')
    .controller('NotificationListController', [
        '$scope',
        '$location',
        '$rootScope',
        'Notifications',
        'grid',
        'PersonalizationServiceFactory',
        'FilterSearchService',
        function(
            $scope,
            $location,
            $rootScope,
            Notifications,
            Grid,
            Personalize,
            FilterSearchService) {
            $scope.notificationListLength = 0;
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

            $scope.goToCreate = function() {
                $location.path('/notifications/new');
            };

            filterSearchService.addBasicFilter('All Notifications', {'sort': 'order,ASC'}, undefined,
                function(Grid) {
                    if (Grid.gridOptions && Grid.gridOptions.data) {
                        $scope.notificationListLength = Grid.gridOptions.data.length;
                    }
                    console.log('Grid', Grid);
                }
            );
        }
    ]);
});

define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.queue')
    .controller('QueueNotificationController', [
        '$scope',
        '$location',
        '$rootScope',
        'TombstoneService',
        function(
            $scope,
            $location,
            $rootScope,
            TombstoneService
            ) {


            $scope.alertDataMap = {};
            $scope.link = TombstoneService.route;
                TombstoneService.getPage(0, 1, {}).then(function() {
                     if(TombstoneService.data && TombstoneService.data.length === 1 ){
                        $scope.alertDataMap = {
                            total: TombstoneService.data.length
                        };
                    }else{
                       $scope.alertDataMap = {
                            total: 0
                        };
                    }
                 });


              $scope.goto = function(){

              };

        }]);
});

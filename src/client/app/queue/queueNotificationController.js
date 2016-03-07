
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
        var tombstoneOptions  = {
                'params':{
                    'status':'QUEUED'
                }
            };
            TombstoneService.getPage(0, 1, tombstoneOptions).then(function() {
                 if(TombstoneService.page && TombstoneService.page.totalElements){
                    $scope.alertDataMap = {
                        total: TombstoneService.page.totalElements
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


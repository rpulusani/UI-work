define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('RequestStatusFilterController', ['$scope', '$translate', 'ServiceRequestStatus',
        function($scope, $translate, ServiceRequestStatus) {
            $scope.selectedStatusList = [];
            $scope.requestStatuses = [];
            ServiceRequestStatus.get().then(function (response) {
                if (ServiceRequestStatus.item && ServiceRequestStatus.item._embedded 
                    && ServiceRequestStatus.item._embedded.requestStatuses) {
                    var statusList = ServiceRequestStatus.item._embedded.requestStatuses;
                    for (var i=0; i<statusList.length; i++) {
                        var tempStatus = {};
                        tempStatus.name = statusList[i];
                        tempStatus.selected = false;
                        $scope.requestStatuses.push(tempStatus);
                    }
                }
            });

            $scope.requestStatusFilter = function(requestStatus){
                if (requestStatus.selected) {
                    $scope.selectedStatusList.push(requestStatus.name);
                } else {
                    if($scope.selectedStatusList.indexOf(requestStatus.name) !== -1) {
                        $scope.selectedStatusList.splice($scope.selectedStatusList.indexOf(requestStatus.name), 1);
                    }
                }
                if($scope.selectedStatusList && $scope.filterDef && typeof $scope.filterDef === 'function'){
                    var requestStatusList = $scope.selectedStatusList.join();
                    if ($scope.selectedStatusList.length > 0) {
                        $scope.params['status'] = requestStatusList;
                        $scope.filterDef($scope.params,['from', 'to', 'bookmark']);
                    } else {
                        $scope.params = {};
                        $scope.filterDef($scope.params,['status', 'from', 'to', 'bookmark']);
                    }
                }
            };
        }
    ]);
});
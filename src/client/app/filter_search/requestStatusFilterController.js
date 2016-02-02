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
                    if ($scope.selectedStatusList.length > 0) {
                        $scope.showClearMessage = true;
                        $scope.noOfSelected = $scope.selectedStatusList.length;
                    } else {
                        $scope.showClearMessage = false;
                    }
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

            $scope.clearStatusFilter = function(){
                if($scope.filterDef && typeof $scope.filterDef === 'function'){
                    $scope.params = {};
                    $scope.noOfSelected = 0;
                    $scope.selectedStatusList = [];
                    for (var i=0; i<$scope.requestStatuses.length; i++) {
                        $scope.requestStatuses[i].selected = false;
                    }
                    $scope.filterDef($scope.params, ['status', 'from', 'to', 'bookmark']);
                }
            };
        }
    ]);
});
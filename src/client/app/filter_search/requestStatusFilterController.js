
angular.module('mps.filterSearch')
.controller('RequestStatusFilterController', ['$scope', '$translate', '$location', 'ServiceRequestStatus', 
    function($scope, $translate, $location, ServiceRequestStatus) {
        var params = $location.search(),
        i = 0; // loop through requestStatuses

        $scope.selectedStatusList = [];
        $scope.requestStatuses = [];

        var statusBarLevels = [
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED_SHORT'), value: 'SUBMITTED', selected: false},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_IN_PROCESS'), value: 'IN_PROCESS', selected: false},
        { name: $translate.instant('DEVICE_MAN.COMMON.TXT_ORDER_SHIPPED'), value: 'SHIPPED', selected: false},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_COMPLETED'), value: 'COMPLETED', selected: false},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_CANCELED'), value: 'CANCELLED', selected: false},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_PENDING'), value: 'PENDING', selected: false},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_DRAFT'), value: 'DRAFT', selected: false}],

        statusBarLevelsShort = [
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_SUBMITTED_SHORT'), value: 'SUBMITTED', selected: false},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_IN_PROCESS'), value: 'IN_PROCESS', selected: false},
        { name: $translate.instant('REQUEST_MAN.COMMON.TXT_REQUEST_COMPLETED'), value: 'COMPLETED', selected: false}];

        if ($scope.statusLevel && $scope.statusLevel === 'RequestStatusFilterLong') {
            $scope.requestStatuses = statusBarLevels;
        }

        if ($scope.statusLevel && $scope.statusLevel === 'RequestStatusFilterShort') {
            $scope.requestStatuses = statusBarLevelsShort;
        }

        $scope.requestStatusFilter = function(requestStatus){
            if (requestStatus.selected) {
                $scope.selectedStatusList.push(requestStatus.value);
            } else {
                if($scope.selectedStatusList.indexOf(requestStatus.value) !== -1) {
                    $scope.selectedStatusList.splice($scope.selectedStatusList.indexOf(requestStatus.value), 1);
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
                    $scope.filterDef($scope.params,['from', 'to', 'bookmark', 'requesterFilter']);
                } else {
                    $scope.params = {};
                    $scope.filterDef($scope.params,['status', 'from', 'to', 'bookmark', 'requesterFilter']);
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
                $scope.filterDef($scope.params, ['status', 'from', 'to', 'bookmark', 'requesterFilter']);
            }
        };
        if (params.filteron){
            var filterOnAr = params.filteron.split(',');
        	var statusValue = null,i;
        	for (i=0;i<$scope.requestStatuses.length;i++){
        		if (filterOnAr.indexOf($scope.requestStatuses[i].value.toLowerCase()) >= 0){
        			statusValue = $scope.requestStatuses[i].value;
        			$scope.requestStatuses[i].selected=true;
                    $scope.requestStatus={
                            selected: true,
                            value: statusValue
                    }
                    $scope.requestStatusFilter($scope.requestStatus);
        		}
        	}
        }
    }
]);

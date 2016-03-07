'use strict';
angular.module('mps.filterSearch')
.controller('DeviceRequestTypeFilterController', ['$scope', '$translate', 'ServiceRequestTypes',
    function($scope, $translate, ServiceRequestTypes) {
        var option =  {
            'params': {
                category: 'MADC'
            }
        };

        ServiceRequestTypes.get(option).then(function (response) {
            if (ServiceRequestTypes.item && ServiceRequestTypes.item._embedded 
                && ServiceRequestTypes.item._embedded.requestTypes) {
                $scope.deviceRequestTypes = ServiceRequestTypes.item._embedded.requestTypes;
            }
        });

        $scope.$watch('deviceRequestType', function(deviceRequestType) {
            if (deviceRequestType) {
                $scope.params['type'] = deviceRequestType;
                $scope.filterDef($scope.params, ['status', 'from', 'to', 'bookmark', 'chlFilter', 'location', 'requesterFilter']);
            }
        });
    }
]);

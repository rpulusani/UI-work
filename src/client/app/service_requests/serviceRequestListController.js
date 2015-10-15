define(['angular','serviceRequest', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('ServiceRequestListController', ['$scope', '$location', '$rootScope','ServiceRequestService', 'grid',
        function($scope,  $location, $rootScope, ServiceRequest, Grid) {
            $rootScope.currentAccount = '1-21AYVOT';
            $rootScope.currentRowList = [];

            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, ServiceRequest);
            ServiceRequest.getList().then(function() {
                Grid.display(ServiceRequest, $scope);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + ServiceRequest.serviceName +  ' reason: ' + reason);
            });
        }
    ]);
});

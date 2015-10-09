define(['angular', 'serviceRequest', 'utility.gridService','serviceRequest.serviceRequestFactory'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequests')
    .controller('ServiceRequestController', ['$scope', '$location', 'gridService', 'ServiceRequestService', '$rootScope',
        function($scope, $location, gridService, ServiceRequestService, $rootScope) {

            $scope.serviceRequestOverview = function() {
                $location.path('/service_requests/requests/overview');
            };

           // $scope.serviceRequest
        }
    ]);
});

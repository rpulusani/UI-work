define(['angular', 'serviceRequest' ], function(angular) {
    'use strict';
    angular.module('mps.serviceRequests')
    .controller('ServiceRequestController', ['$scope', '$location', 'ServiceRequestService', '$rootScope',
        function($scope, $location, ServiceRequestService, $rootScope) {

            $scope.serviceRequestOverview = function() {
                $location.path('/service_requests/requests/overview');
            };

           // $scope.serviceRequest
        }
    ]);
});

define(['angular','serviceRequest', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequestAddresses')
    .controller('ServiceRequestListController', ['$scope', '$location', '$rootScope','ServiceRequestService', 'grid',
        'PersonalizationServiceFactory',
        function($scope,  $location, $rootScope, ServiceRequest, Grid, Personalize) {
            $rootScope.currentAccount = '1-21AYVOT';
            $rootScope.currentRowList = [];
            var personal = new Personalize($location.url(),$rootScope.idpUser.id);

            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, ServiceRequest, personal);
            ServiceRequest.getPage().then(function() {
                Grid.display(ServiceRequest, $scope, personal);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + ServiceRequest.serviceName +  ' reason: ' + reason);
            });
        }
    ]);
});

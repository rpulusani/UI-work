define(['angular','serviceRequest', 'utility.gridService'], function(angular) {
    'use strict';
    angular.module('mps.serviceRequests')
    .controller('ServiceRequestListController', ['$scope', '$location', 'gridService', '$rootScope','$q',
        'ServiceRequestService',
        function($scope,  $location,  GridService, $rootScope, $q, ServiceRequest) {
            $rootScope.currentAccount = '1-21AYVOT';
            $rootScope.currentRowList = [];

            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = GridService.getGridActions($rootScope, ServiceRequest);
            ServiceRequest.setRequiredParams([{name: 'accountId', value: $rootScope.currentAccount }]);
            GridService.getGridOptions(ServiceRequest, '').then(
                function(options){
                    $scope.gridOptions = options;
                    $scope.pagination = GridService.pagination(ServiceRequest, $rootScope);
                    $scope.itemsPerPage = ServiceRequest.getPersonalizedConfiguration('itemsPerPage');
                    var params =[
                        {
                            name: 'size',
                            value: $scope.itemsPerPage
                        },
                        {
                            name: 'page',
                            value: 0
                        }
                    ];

                    ServiceRequest.resource(ServiceRequest.getFullParamsList(params)).then(
                        function(response){
                            $scope.gridOptions.data = ServiceRequest.getList();
                        }
                    );
                },
                function(reason){
                     NREUM.noticeError('Grid Load Failed: ' + reason);
                }
            );
        }
    ]);
});

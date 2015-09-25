define(['angular', 'deviceManagement', 'utility.gridService'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('deviceOrderController', ['$scope', '$location', 'gridService', 'Requests', '$rootScope',
        function($scope,  $location,  GridService, Requests, $rootScope) {
            $rootScope.currentAccount = '1-74XV2R';

            $scope.goToCreate = function() {
                $location.path('/service_requests/contacts/new');
            };

            $scope.goToUpdate = function(contact) {
                var href = contact._links.self.href,
                contact_id = href.split('/').pop();
                
                $location.path('/service_requests/contacts/' + contact_id + '/update');
            };

            $scope.gridOptions = {};
            
            GridService.getGridOptions(Requests, '').then(
                function(options){
                    $scope.gridOptions = options;
                    $scope.pagination = GridService.pagination(Requests, $rootScope);
                    Requests.resource($rootScope.currentAccount, 0).then(
                        function(response){
                            $scope.gridOptions.data = Requests.addFunctions(Requests.getList());
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
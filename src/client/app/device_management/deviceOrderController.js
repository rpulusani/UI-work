define(['angular', 'deviceManagement','deviceManagement.deviceOrderFactory'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceOrderController', ['$scope', '$translate', 'grid', 'Orders', '$rootScope', '$location',
      'PersonalizationServiceFactory',
        function($scope, $translate, Grid, Orders, $rootScope, $location, Personalize) {
            var personal = new Personalize($location.url(),$rootScope.idpUser.id);
            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Orders, personal);
            /*Orders.getPage().then(function() {
                Grid.display(Orders, $scope, personal);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + Orders.serviceName +  ' reason: ' + reason);
            });*/
        }
    ]);
});

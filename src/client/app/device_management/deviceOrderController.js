define(['angular', 'deviceManagement', 'utility.gridService','deviceManagement.deviceOrderFactory'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceOrderController', ['$scope', '$translate', 'gridService', 'Orders', '$rootScope',
        function($scope, $translate, GridService, Orders, $rootScope) {

            $scope.orderGridOptions = {};
            $scope.orderColumns = [{id: 1, name: $translate.instant('ORDER_MGT.DATE')}, 
                              {id: 2, name: $translate.instant('ORDER_MGT.ORDER_NO')}, 
                              {id: 3, name: $translate.instant('ORDER_MGT.STATUS')},
                              {id: 4, name: $translate.instant('ORDER_MGT.PRIMARY_CONTACT')},
                              {id: 5, name: $translate.instant('ORDER_MGT.DESCRIPTION')}];

            GridService.getGridOptions(Orders, '').then(
                function(options){
                    $scope.orderGridOptions = options;
                    $scope.pagination = GridService.pagination(Orders, $rootScope);
                    $scope.orderGridOptions.data = [
                        {date: '09/01/15', orderNumber: 'O1-2345-67891', status: 'Submitted',
                         primaryContact: 'John Public', description: 'Lorem ipsum dolor sit amet'},
                        {date: '09/18/15', orderNumber: 'O1-2345-67895', status: 'In Process',
                         primaryContact: 'John Public', description: 'Lorem ipsum dolor sit amet'}
                    ];
                },
                function(reason){
                     NREUM.noticeError('Grid Load Failed: ' + reason);
                }
            );
        }
    ]);
});

define(['angular', 'deviceManagement', 'deviceManagement.deviceRequestFactory'], function(angular) {
    'use strict';
    angular.module('mps.deviceManagement')
    .controller('DeviceRequestController', ['$scope', '$translate', 'gridService', 'Requests', '$rootScope',
        function($scope, $translate, GridService, Requests, $rootScope) {

            $scope.requestGridOptions = {};
            $scope.requestColumns = [{id: 1, name: $translate.instant('ORDER_MGT.DATE')},
                              {id: 2, name: $translate.instant('ORDER_MGT.ORDER_NO')},
                              {id: 3, name: $translate.instant('ORDER_MGT.STATUS')},
                              {id: 4, name: $translate.instant('ORDER_MGT.PRIMARY_CONTACT')},
                              {id: 5, name: $translate.instant('ORDER_MGT.PRIMARY_EMAIL')},
                              {id: 6, name: $translate.instant('ORDER_MGT.PRIMARY_PHONE')}];

            GridService.getGridOptions(Requests, '').then(
                function(options){
                    $scope.requestGridOptions = options;
                    $scope.pagination = GridService.pagination(Requests, $rootScope);
                    $scope.requestGridOptions.data = [
                        {date: '09/01/15', requestNumber: 'M1-2345-67891', status: 'Submitted',
                         primaryContact: 'John Public', primaryContactEmail: 'jpublic@lexmark.com', primaryContactPhone: '+1 555-555-5555'},
                        {date: '09/18/15', requestNumber: 'M1-2345-67890', status: 'In Process',
                         primaryContact: 'John Public', primaryContactEmail: 'jpublic@lexmark.com', primaryContactPhone: '+1 555-555-5555'}
                    ];
                },
                function(reason){
                     NREUM.noticeError('Grid Load Failed: ' + reason);
                }
            );
        }
    ]);
});

define(['angular', 'utility', 'contact.factory', 'ui.grid'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .controller('ContactPickerController', ['$scope', '$location', 'gridService', 'Contacts', '$rootScope',
        function($scope, $location, GridService, Contacts, $rootScope) {
            $rootScope.currentAccount = '1-74XV2R';
            $scope.selectedContact = [];
            $rootScope.currentRowList = [];
            //console.log($rootScope.currentRowList[0].entity);
            if ($rootScope.currentRowList !== undefined && $rootScope.currentRowList.length === 1) {
                console.log($rootScope.currentRowList[0].entity);
                $scope.selectedContact = $rootScope.currentRowList[0].entity;      
            }

            $scope.isRowSelected = function(){
                if ($rootScope.currentRowList.length === 1) {
                    $scope.selectedContact = $rootScope.currentRowList[0].entity; 
                    console.log($rootScope.currentRowList[0].entity);
                   return true;
                } else {
                   return false;
                }
            };

            $scope.goToDeviceAdd = function(){
                $location.path($scope.returnPath);
            };

            $scope.gridOptions = {};
            $scope.gridOptions.multiSelect = false;
            $scope.gridOptions.onRegisterApi = GridService.getGridActions($rootScope, Contacts);
            GridService.getGridOptions(Contacts, '').then(
                function(options){
                    $scope.gridOptions = options;
                    $scope.pagination = GridService.pagination(Contacts, $rootScope);
                    
                    Contacts.resource($rootScope.currentAccount, 0).then(
                        function(response){
                            $scope.gridOptions.data = Contacts.getList();
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

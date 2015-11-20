define(['angular', 'utility', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .controller('AddressPickerController', ['$scope', '$location', 'grid', 'Addresses', 'FormatterService', '$rootScope',
        'PersonalizationServiceFactory',
        function($scope, $location, Grid, Addresses, FormatterService, $rootScope, Personalize) {
            $scope.selectedAddress = [];
            $rootScope.currentRowList = [];
            var personal = new Personalize($location.url(), $rootScope.idpUser.id);

            if ($rootScope.currentRowList !== undefined && $rootScope.currentRowList.length === 1) {
                $scope.selectedAddress = $rootScope.currentRowList[0].entity;
            }

            $scope.isRowSelected = function(){
                if ($rootScope.currentRowList.length >= 1) {
                   $rootScope.selectedAddress = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
                   $rootScope.formattedSelectedAddress = FormatterService.formatAddress($scope.selectedAddress);
                   return true;
                } else {
                   return false;
                }
            };

            $scope.goToCallingPage = function(){
                $location.path($scope.returnPath);
            };

            $scope.discardSelect = function(){
                $rootScope.selectedAddress = undefined;
                $rootScope.formattedSelectedAddress = undefined;
                $location.path($scope.returnPath);
            };

            $scope.gridOptions = {};
            $scope.gridOptions.multiSelect = false;
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Addresses, personal);
            Contacts.getPage().then(function() {
                Grid.display(Addresses, $scope, personal);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + Addresses.serviceName +  ' reason: ' + reason);
            });

        }
    ]);
});

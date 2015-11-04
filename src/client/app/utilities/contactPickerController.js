define(['angular', 'utility', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .controller('ContactPickerController', ['$scope', '$location', 'grid', 'Contacts', 'FormatterService', '$rootScope',
        'PersonalizationServiceFactory',
        function($scope, $location, Grid, Contacts, FormatterService, $rootScope, Personalize) {
            $rootScope.currentAccount = '1-74XV2R';
            $scope.selectedContact = [];
            $rootScope.currentRowList = [];
            var personal = new Personalize($location.url(), $rootScope.idpUser.id);

            if ($rootScope.currentRowList !== undefined && $rootScope.currentRowList.length === 1) {
                $scope.selectedContact = $rootScope.currentRowList[0].entity;      
            }

            $scope.isRowSelected = function(){
                if ($rootScope.currentRowList.length >= 1) {
                   $scope.selectedContact = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
                   $scope.formattedSelectedContact = FormatterService.formatContact($scope.selectedContact);
                   return true;
                } else {
                   return false;
                }
            };

            $scope.goToDeviceAdd = function(){
                $location.path($scope.returnPath + '/return');
            };

            $scope.discardSelect = function(){
                $location.path($scope.returnPath + '/discard');
            };

            $scope.gridOptions = {};
            $scope.gridOptions.multiSelect = false;
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Contacts, personal);
            Contacts.columns = 'fullSet';
            Contacts.getPage().then(function() {
                Grid.display(Contacts, $scope, personal);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + Contacts.serviceName +  ' reason: ' + reason);
            });
            
        }
    ]);
});

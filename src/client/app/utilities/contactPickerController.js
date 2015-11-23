define(['angular', 'utility', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .controller('ContactPickerController', ['$scope', '$location', 'grid', 'Contacts', 'BlankCheck', 'FormatterService', '$rootScope',
        'PersonalizationServiceFactory',
        function($scope, $location, Grid, Contacts, BlankCheck, FormatterService, $rootScope, Personalize) {
            $scope.selectedContact = [];
            $rootScope.currentRowList = [];
            var personal = new Personalize($location.url(), $rootScope.idpUser.id);

            if ($rootScope.currentRowList !== undefined && $rootScope.currentRowList.length >= 1) {
                $scope.selectedContact = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
            }

            if($rootScope.selectedAddress) {
                $rootScope.selectedAddress = undefined;
            }

            configureTemplates();

            $scope.isRowSelected = function(){
                if ($rootScope.currentRowList.length >= 1) {
                   $rootScope.selectedContact = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
                   $scope.formattedSelectedContact = FormatterService.formatContact($rootScope.selectedContact);
                   return true;
                } else {
                   return false;
                }
            };

            console.log('current selected in contact picker',$rootScope.currentSelected)
            console.log('returnpath is',$rootScope.contactReturnPath);

            $scope.goToCallingPage = function(){
                console.log('contactReturnPath',$rootScope.contactReturnPath)
                $location.path($rootScope.contactReturnPath);
            };

            $scope.discardSelect = function(){
                $rootScope.selectedContact = undefined;
                $rootScope.formattedSelectedContact = undefined;
                $location.path($rootScope.contactReturnPath);
            };

            $scope.gridOptions = {};
            $scope.gridOptions.multiSelect = false;
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Contacts, personal);
            Contacts.getPage().then(function() {
                Grid.display(Contacts, $scope, personal);
            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + Contacts.serviceName +  ' reason: ' + reason);
            });

            function configureTemplates() {
                $scope.configure = {
                    header: {
                        translate: {
                            h1: 'DEVICE_SERVICE_REQUEST.CHANGE_CONTACT',
                            body: 'MESSAGE.LIPSUM',
                            readMore: ''
                        },
                        readMoreUrl: ''
                    }
                }
            }

        }
    ]);
});

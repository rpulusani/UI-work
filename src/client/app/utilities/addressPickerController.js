define(['angular', 'utility', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .controller('AddressPickerController', ['$scope', '$location', 'grid', 'Addresses', 'AccountService', 'UserService',
     'BlankCheck', 'FormatterService', '$rootScope', '$routeParams', 'PersonalizationServiceFactory', '$controller',
        function($scope, $location, Grid, Addresses, Account, User, BlankCheck, FormatterService, $rootScope, $routeParams, 
            Personalize, $controller) {
            $scope.selectedAddress = [];
            $rootScope.currentRowList = [];
            var personal = new Personalize($location.url(), $rootScope.idpUser.id);

            if ($rootScope.currentRowList !== undefined && $rootScope.currentRowList.length >= 1) {
                $scope.selectedAddress = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
            }

            if($rootScope.selectedContact) {
                $rootScope.selectedContact = undefined;
            }

            if (!BlankCheck.isNull($scope.sourceAddress)) {
                $scope.formattedInstalledAddress = FormatterService.formatAddress(JSON.parse($scope.sourceAddress));
            }

            configureTemplates();

            $scope.sourceController = function() {
                return $controller($routeParams.source + 'Controller', { $scope: $scope }).constructor;
            };

            $scope.isRowSelected = function(){
                if ($rootScope.currentRowList.length >= 1) {
                   $rootScope.selectedAddress = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
                   $scope.formattedSelectedAddress = FormatterService.formatAddress($rootScope.selectedAddress);
                   return true;
                } else {
                   return false;
                }
            };

            $scope.goToCallingPage = function(){
                $location.path($rootScope.addressReturnPath);
            };

            $scope.discardSelect = function(){
                $rootScope.selectedAddress = undefined;
                $rootScope.formattedSelectedAddress = undefined;
                $location.path($rootScope.addressReturnPath);
            };

            $scope.gridOptions = {};
            $scope.gridOptions.multiSelect = false;
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Addresses, personal);
            
            User.getLoggedInUserInfo().then(function() {
                if (angular.isArray(User.item._links.accounts)) {
                    User.item._links.accounts = User.item._links.accounts[0];
                }

                User.getAdditional(User.item, Account).then(function() {
                    Account.getAdditional(Account.item, Addresses).then(function() {
                        Addresses.getPage().then(function() {
                            Grid.display(Addresses, $scope, personal);
                        }, function(reason) {
                            NREUM.noticeError('Grid Load Failed for ' + Addresses.serviceName +  ' reason: ' + reason);
                        });
                    });
                });
            });

            function configureTemplates() {
                $scope.configure = {
                    header: {
                        translate: {
                            h1: 'DEVICE_SERVICE_REQUEST.CHANGE_INSTALL_ADDRESS',
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

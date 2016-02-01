define(['angular', 'utility', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .controller('AddressPickerController', ['$scope', '$location', 'grid', 'Addresses', 'AccountService', 'UserService',
     'BlankCheck', 'FormatterService', '$rootScope', '$routeParams', 'PersonalizationServiceFactory', '$controller',
     'FilterSearchService',
        function($scope, $location, GridService, Addresses, Account, User, BlankCheck, FormatterService, $rootScope, $routeParams,
            Personalize, $controller, FilterSearchService) {
            $scope.selectedAddress = [];
            $rootScope.currentRowList = [];
            var personal = new Personalize($location.url(), $rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(Addresses, $scope, $rootScope, personal);

            if ($rootScope.currentRowList !== undefined && $rootScope.currentRowList.length >= 1) {
                $scope.selectedAddress = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
            }

            if($rootScope.selectedContact) {
                $rootScope.selectedContact = undefined;
            }

            if (!BlankCheck.isNullOrWhiteSpace($scope.sourceAddress)) {
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

            $scope.goToCallingPage = function() {
                $location.path($rootScope.addressReturnPath);
            };

            $scope.discardSelect = function(){
                $rootScope.selectedAddress = undefined;
                $rootScope.formattedSelectedAddress = undefined;
                $location.path($rootScope.addressReturnPath);
            };


            filterSearchService.addBasicFilter('ADDRESS.ALL', {'addressType': 'ACCOUNT'}, undefined,
                 function(Grid) {
                    setTimeout(function() {
                        $scope.$broadcast('setupColumnPicker', Grid);
                    }, 500);
                    $scope.$broadcast('setupPrintAndExport', $scope);
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
                };
            }

        }
    ]);
});

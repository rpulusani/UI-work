define(['angular', 'utility', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .controller('AddressPickerController', ['$scope', '$location', 'grid', 'Addresses', 'AccountService', 'UserService',
     'BlankCheck', 'FormatterService', '$rootScope', '$routeParams', 'PersonalizationServiceFactory', '$controller',
     'FilterSearchService',
        function($scope, $location, GridService, Addresses, Account, User, BlankCheck, FormatterService, $rootScope, $routeParams,
            Personalize, $controller, FilterSearchService) {
            $scope.selectedAddress = undefined;
            $rootScope.currentSelectedRow = undefined;
            var personal = new Personalize($location.url(), $rootScope.idpUser.id);

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

            $scope.isRowSelected = function() {
                if ($rootScope.currentSelectedRow) {
                    $scope.selectedAddress = $rootScope.currentSelectedRow;
                    $scope.formattedSelectedAddress = FormatterService.formatAddress($rootScope.selectedAddress);
                    return true;
                } else {
                    $scope.formattedSelectedAddress = undefined;
                    return false;
                }
            };

            $scope.goToCallingPage = function() {
                $rootScope.selectedAddress = $scope.selectedAddress;
                $location.path($rootScope.addressReturnPath);
            };

            $scope.discardSelect = function(){
                $rootScope.selectedAddress = undefined;
                $rootScope.formattedSelectedAddress = undefined;
                $location.path($rootScope.addressReturnPath);
            };

            function setupGrid(){
                var filterSearchService = new FilterSearchService(Addresses, $scope, $rootScope, personal);
                $scope.gridOptions.showBookmarkColumn = false;
                $scope.gridOptions.multiSelect = false;
                filterSearchService.addBasicFilter('ADDRESS.ALL', {'addressType': 'ACCOUNT'}, undefined);
            }

            setupGrid();

            function configureTemplates() {
                if($scope.customConfigure){
                    $scope.configure = $scope.customConfigure;
                    if(!$scope.configure.showCurrentAddress){
                        $scope.configure.showCurrentAddress = false;
                    }
                }else{
                    $scope.configure = {
                        showCurrentAddress: true,
                        header: {
                            translate: {
                                h1: 'DEVICE_SERVICE_REQUEST.CHANGE_INSTALL_ADDRESS',
                                body: 'MESSAGE.LIPSUM',
                                readMore: ''
                            },
                            readMoreUrl: '',
                            showCancelBtn: false
                        },
                        actions:{
                            translate: {
                                abandonRequest:'ADDRESS.DISCARD_INSTALL_ADDRESS_CHANGES',
                                submit: 'ADDRESS.CHANGE_DEVICE_INSTALL_ADDRESS'
                            }
                        }
                    };
                }
            }

        }
    ]);
});

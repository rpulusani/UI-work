

angular.module('mps.utility')
.controller('ContactPickerController', ['$scope', '$timeout', '$location', '$controller', '$routeParams', 'grid', 'Contacts', 'BlankCheck', 'FormatterService', '$rootScope',
    'PersonalizationServiceFactory',
    'FilterSearchService',
    function($scope, $timeout, $location, $controller, $routeParams, GridService, Contacts, BlankCheck, FormatterService, $rootScope, Personalize, FilterSearchService) {
        if($rootScope.contactRequestFor === undefined){
            $rootScope.contactRequestFor = angular.copy($rootScope.currentSelected);
        }
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

        $scope.sourceController = function() {
            return $controller($routeParams.source + 'Controller', { $scope: $scope }).constructor;
        };

        $scope.isRowSelected = function(){
            if ($rootScope.currentRowList.length >= 1) {
               $rootScope.selectedContact = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
               $scope.formattedSelectedContact = FormatterService.formatContact($rootScope.selectedContact);
               return true;
            } else {
               return false;
            }
        };

        $scope.goToCallingPage = function(){
            if($rootScope.currentSelected === undefined){
                $rootScope.currentSelected = $rootScope.contactRequestFor;
            }
            $rootScope.contactRequestFor = undefined;
            $location.path($rootScope.contactReturnPath);
        };

         $scope.discardSelect = function(){
            $timeout(function() {
                angular.element('div.ui-grid-icon-ok.ui-grid-row-selected').triggerHandler('click');
                $rootScope.selectedContact = undefined;
                $rootScope.formattedSelectedContact = undefined;
				$rootScope.currentRowList = [];
                $location.path($rootScope.contactReturnPath);
            });
        };

        function setupGrid(){
            var filterSearchService = new FilterSearchService(Contacts, $scope, $rootScope, personal),
            removeParamsList = ['location', 'search', 'searchOn'];
            $scope.gridOptions.showBookmarkColumn = false;
            $scope.gridOptions.multiSelect = false;
            filterSearchService.addBasicFilter('CONTACT.ALL', {consumables : false}, removeParamsList);
        }

        setupGrid();
        
        /*if ($routeParams.source === 'DeviceAdd' && $rootScope.currentSelected === 'updateDeviceContact'){
           	filterParams.consumables = true;        	
        }else {
        	filterParams.consumables = false; 
        }*/

        function configureTemplates() {
            $scope.configure = {
                header: {
                    translate: {
                        h1: 'DEVICE_SERVICE_REQUEST.CHANGE_CONTACT',
                        body: 'MESSAGE.LIPSUM',
                        readMore: ''
                    },
                    readMoreUrl: '',
                    showCancelBtn: false
                },
                breadcrumbs:{
                        1: {
                            href: "/contacts",
                            value: "CONTACT.TITLE"
                        },
                        2: {
                            value: "DEVICE_SERVICE_REQUEST.CHANGE_CONTACT"
                        } 
                    }
            };

            if($rootScope.preBreadcrumb){
                $scope.configure.breadcrumbs={
                        1: $rootScope.preBreadcrumb,
                        2: {
                            value: "DEVICE_SERVICE_REQUEST.CHANGE_CONTACT"
                        } 
                    }  
            }
        }

    }
]);


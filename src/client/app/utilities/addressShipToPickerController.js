

angular.module('mps.utility')
.controller('AddressShipToPickerController', [
    '$scope',
    '$location',
    'grid',
    'Addresses',
    'AccountService',
    'UserService',
    'BlankCheck',
    'FormatterService',
    '$rootScope',
    '$routeParams',
    'PersonalizationServiceFactory',
    '$controller',
    'FilterSearchService',
    function(
        $scope,
        $location,
        GridService,
        Addresses,
        Account,
        User,
        BlankCheck,
        FormatterService,
        $rootScope,
        $routeParams,
        Personalize,
        $controller,
        FilterSearchService
    ) {
        $scope.selectedShipToAddress = undefined;
        $rootScope.currentSelectedRow = undefined;
        var personal = new Personalize($location.url(), $rootScope.idpUser.id);

        if ($rootScope.currentSelectedRow ) {
            $scope.selectedAddress = $rootScope.currentSelectedRow;
        }

        if($rootScope.selectedShipToAddress) {
            $rootScope.selectedShipToAddress = undefined;
        }

        configureTemplates();

        $scope.sourceController = function() {
            return $controller($routeParams.source + 'Controller', { $scope: $scope }).constructor;
        };

        $scope.isRowSelected = function(){
            if ($rootScope.currentSelectedRow) {
               $rootScope.selectedShipToAddress = $rootScope.currentSelectedRow;
               $scope.formattedSelectedAddress = FormatterService.formatAddress($rootScope.selectedShipToAddress);
               return true;
            } else {
                $scope.formattedSelectedAddress = undefined;
               return false;
            }
        };

        $scope.goToCallingPage = function() {
            $location.path($rootScope.addressReturnPath);
        };

        $scope.discardSelect = function(){
            $rootScope.currentSelectedRow = undefined;
            $scope.selectedAddress = undefined;
            $rootScope.selectedShipToAddress = undefined;
            $scope.formattedSelectedAddress = undefined;
            $location.path($rootScope.addressReturnPath);
        };





        function configureTemplates() {
            $scope.configure = {
                header: {
                    translate: {
                        h1: 'ORDER_MAN.ORDER_SELECT_SHIP_TO_ADDR.TXT_ORDER_ADDRESS_SELECTION',
                        body: 'ORDER_MAN.ORDER_SELECT_SHIP_TO_ADDR.TXT_ORDER_SHIP_TO_PAR',
                        readMore: ''
                    },
                    readMoreUrl: '',
                    showCancelBtn: false
                },
                breadcrumbs: false
            };
        }

        function setupGrid(){
            var filterSearchService = new FilterSearchService(Addresses, $scope, $rootScope, personal);
            $scope.gridOptions.showBookmarkColumn = false;
            $scope.gridOptions.multiSelect = false;
            filterSearchService.addBasicFilter('All Ship To Addresses', {'addressType': 'SHIP_TO'}, undefined);
        }

        setupGrid();
    }
]);

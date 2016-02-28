

angular.module('mps.utility')
.controller('AddressBillToPickerController', [
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
        $scope.selectedBillToAddress = undefined;
        $rootScope.currentSelectedRow = undefined;
        var personal = new Personalize($location.url(), $rootScope.idpUser.id);

        if ($rootScope.currentSelectedRow) {
            $scope.selectedAddress = $rootScope.currentSelectedRow;
        }

        if($rootScope.selectedBillToAddress) {
            $rootScope.selectedBillToAddress = undefined;
        }

        /*commenting the validation until fixing*/
        /*
        if (!Addresses.data.length) {
            $location.path('/');
        }*/

        configureTemplates();

        $scope.sourceController = function() {
            return $controller($routeParams.source + 'Controller', { $scope: $scope }).constructor;
        };

        $scope.isRowSelected = function(){
            if ($rootScope.currentSelectedRow) {
               $rootScope.selectedBillToAddress = $rootScope.currentSelectedRow;
               $scope.formattedSelectedAddress = FormatterService.formatAddress($rootScope.selectedBillToAddress);
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
            $rootScope.selectedBillToAddress = undefined;
            $rootScope.formattedSelectedAddress = undefined;
            $location.path($rootScope.addressReturnPath);
        };

        function configureTemplates() {
            $scope.configure = {
                header: {
                    translate: {
                        h1: 'ORDER_MAN.ORDER_SELECT_BILL_TO_ADDR.TXT_ORDER_ADDRESS_SELECTION',
                        body: 'ORDER_MAN.ORDER_SELECT_BILL_TO_ADDR.TXT_ORDER_BILL_TO_PAR',
                        readMore: ''
                    },
                    readMoreUrl: '',
                    showCancelBtn: false
                }
            };
        }

        function setupGrid(){
            var filterSearchService = new FilterSearchService(Addresses, $scope, $rootScope, personal);
            $scope.gridOptions.showBookmarkColumn = false;
            $scope.gridOptions.multiSelect = false;
            filterSearchService.addBasicFilter('All Bill To Addresses', {'addressType': 'BILL_TO'}, undefined);
        }

        setupGrid();

    }
]);


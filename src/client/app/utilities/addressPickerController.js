angular.module('mps.utility')
.controller('AddressPickerController', ['$scope', '$location', 'grid', 'Addresses', 'AccountService', 'UserService',
 'BlankCheck', 'FormatterService', '$rootScope', '$routeParams', 'PersonalizationServiceFactory', '$controller',
 'FilterSearchService', 'Country', 'ErrorMsgs',
    function($scope, $location, GridService, Addresses, Account, User, BlankCheck, FormatterService, $rootScope, $routeParams,
        Personalize, $controller, FilterSearchService, Country, ErrorMsgs) {
        $scope.selectedAddress = {};
        $rootScope.currentSelectedRow = undefined;
        $scope.bodsError = false;
        $scope.bodsErrorKey = '';
        $scope.checkedAddress = 0;

        if (BlankCheck.isNullOrWhiteSpace($scope.selectedAddress.storeFrontQuestion)) {
            $scope.selectedAddress.storeFrontQuestion = false;
        }

        $scope.active = function(value){
            $rootScope.currentAddressTab = value;
            $location.search('tab', value);
        };

        $scope.isActive = function(value){
            var passed = false;
            if($rootScope.currentAddressTab === value){
                passed = true;
            }
            return passed;
        };
        var tabId = $location.search().tab;
        if(tabId){
            $rootScope.currentAddressTab = tabId;
            $scope.isActive(tabId);
        }else{
            $scope.active('pickAddressTab');
        }
        
        var personal = new Personalize($location.url(), $rootScope.idpUser.id);

        // if ($rootScope.currentRowList !== undefined && $rootScope.currentRowList.length >= 1) {
        //     $scope.selectedAddress = $rootScope.currentRowList[$rootScope.currentRowList.length - 1].entity;
        //     console.log('in current row list', $scope.selectedAddress);
        // }

        if($rootScope.selectedContact) {
            $rootScope.selectedContact = undefined;
        }

        if (!BlankCheck.isNullOrWhiteSpace($scope.sourceAddress)) {
            $scope.formattedInstalledAddress = FormatterService.formatAddress(JSON.parse($scope.sourceAddress));
        }

        configureTemplates();
        Country.get().then(function(){
            $scope.countries=Country.data;
        });
        $scope.countrySelected = function(countryId) {
            var item=$scope.countries.filter(function(item) {
                return item.code === countryId; 
            });
            $scope.provinces = item[0].provinces;
        };

        $scope.sourceController = function() {
            return $controller($routeParams.source + 'Controller', { $scope: $scope }).constructor;
        };

        $scope.saveAddress = function() {
            $scope.checkAddress();
            if($scope.canReview === true && $scope.checkedAddress === 1){
                $scope.goToCallingPage();
            }
        };

        $scope.setStoreFrontName = function(){
            if($scope.storeFrontNameCheck){
                $scope.selectedAddress.storeFrontName =  $scope.selectedAddress.name;
            }else{
                $scope.selectedAddress.storeFrontName ='';
            }
        };

        $scope.checkAddress = function() {
            console.log('in check address');
            console.log('$scope.checkedAddress', $scope.checkedAddress);
            console.log('$scope.selectAddressForm.$valid', $scope.selectAddressForm.$valid);
            if ($scope.selectedAddress) {
                $scope.selectedAddress.addressCleansedFlag = 'N';
            }
            
            if($scope.checkedAddress === 0 && $scope.selectAddressForm.$valid){
                $scope.validForm = true;
                $scope.enteredAddress = {
                    addressLine1: $scope.selectedAddress.addressLine1,
                    city: $scope.selectedAddress.city,
                    state:  $scope.selectedAddress.state,
                    country: $scope.selectedAddress.country,
                    postalCode: $scope.selectedAddress.postalCode
                };
            Addresses.verifyAddress($scope.enteredAddress, function(statusCode, bodsData) {
                if (statusCode === 200) {
                    $scope.bodsError = false;
                    $scope.comparisonAddress = bodsData;
                    if($scope.selectedAddress.addressLine1 != $scope.comparisonAddress.addressLine1  ||
                        $scope.selectedAddress.city != $scope.comparisonAddress.city ||
                        $scope.selectedAddress.postalCode != $scope.comparisonAddress.postalCode) {
                        $scope.needToVerify = true;
                        $scope.checkedAddress = 1;
                        $scope.acceptedEnteredAddress = 'comparisonAddress';
                        $scope.setAcceptedAddress();
                    }else{
                        $scope.canReview = true;
                        $scope.checkedAddress = 1;
                        $scope.selectedAddress.addressCleansedFlag = 'Y';
                        $scope.saveAddress();
                    }
                }else{
                    //an error validating address has occurred with bods (log a different way?)
                    $scope.needToVerify = true;
                    $scope.contactUpdate = false;
                    $scope.bodsError = true;
                    $scope.checkedAddress = 1;
                    var localKey = '';
                    if (bodsData && bodsData.message) {
                        localKey = bodsData.message.substring(0, 4);
                        ErrorMsgs.query(function(data) {
                            for (var i=0;i<data.length;i++) {
                                if (data[i].id === localKey) {
                                    $scope.bodsErrorKey = data[i].key;
                                }
                            }
                        });
                    }
                    $scope.acceptedEnteredAddress = 'enteredAddress';
                    $scope.setAcceptedAddress();
                }
            });
            } else {
                $scope.validForm = false;
                window.scrollTo(0,0);
            }
        };

        $scope.setAcceptedAddress =  function() {
          if ($scope.acceptedEnteredAddress === 'comparisonAddress') {
                $scope.selectedAddress.country = $scope.comparisonAddress.country;
                $scope.selectedAddress.addressLine1 = $scope.comparisonAddress.addressLine1;
                $scope.selectedAddress.addressLine2 = $scope.comparisonAddress.addressLine2;
                $scope.selectedAddress.city = $scope.comparisonAddress.city;
                $scope.selectedAddress.state = $scope.comparisonAddress.state;
                $scope.selectedAddress.postalCode = $scope.comparisonAddress.postalCode;
                $scope.selectedAddress.addressCleansedFlag = 'Y';
            } else {
                $scope.selectedAddress.country = $scope.enteredAddress.country;
                $scope.selectedAddress.addressLine1 = $scope.enteredAddress.addressLine1;
                $scope.selectedAddress.addressLine2 = $scope.enteredAddress.addressLine2;
                $scope.selectedAddress.city = $scope.enteredAddress.city;
                $scope.selectedAddress.state = $scope.enteredAddress.state;
                $scope.selectedAddress.postalCode = $scope.enteredAddress.postalCode;
                $scope.selectedAddress.addressCleansedFlag = 'N';
            }
            $scope.canReview = true;
        };

        $scope.editAddress = function(addressType){
            $scope.checkedAddress = 0;
            $scope.needToVerify = false;
            if(addressType === 'comparisonAddress'){
                $scope.selectedAddress.country = $scope.comparisonAddress.country;
                $scope.selectedAddress.addressLine1 = $scope.comparisonAddress.addressLine1;
                $scope.selectedAddress.addressLine2 = $scope.comparisonAddress.addressLine2;
                $scope.selectedAddress.city = $scope.comparisonAddress.city;
                $scope.selectedAddress.state = $scope.comparisonAddress.state;
                $scope.selectedAddress.postalCode = $scope.comparisonAddress.postalCode;
                $scope.selectedAddress.addressCleansedFlag = 'Y';
            }
            $scope.canReview = false;
        };

        $scope.resetAddress = function(){
            $scope.contact.address = {};
            $scope.needToVerify = false;
            $scope.checkedAddress = 0;
        };

        $scope.isRowSelected = function() {
            if ($rootScope.currentSelectedRow) {
                    $scope.selectedAddress = $rootScope.currentSelectedRow;
                    $scope.formattedSelectedAddress = FormatterService.formatAddress($rootScope.currentSelectedRow);

                    return true;
            } else {
                $scope.formattedSelectedAddress = undefined;
                
                return false;
            }
        };

        $scope.goToCallingPage = function() {
            console.log('$scope.selectedAddress', $scope.selectedAddress);
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
                    },
                    breadcrumbs: false
                };
            }
        }

    }
]);


angular.module('mps.tree')
    .controller('TreeController', ['$scope', 'TreeItems', 'AccountService', 'UserInfoService', 'UserService', 'Locations', 
        'AddressLocations', '$q', '$rootScope',
        function($scope, TreeItems, Account, UserInfo, Users, Locations, AddressLocations, $q, $rootScope){
        $scope.items = [];
        $scope.tempItems = [];
        $scope.selectedItems = [];
        var tempItem = {};
        $scope.bulkAction = function(evt){
            $scope.$broadcast(evt);
        };

        var deselectAll = function(itemList) {
            if (itemList && itemList.length > 0) {
                for(var i=0;i<itemList.length;i++) {
                    itemList[i].selected = false;
                    if(itemList[i].items && itemList[i].items.length > 0) {
                        deselectAll(itemList[i].items);
                    }
                }
            }
        };

        $scope.$on('deselectAll', function(evt){
            if ($scope.selectedItems && $scope.selectedItems.length > 0) {
                $scope.selectedItems = [];
            }
            deselectAll($scope.items);
        });

        function setChlChildren(tempItem, deferred) {
            Account.setItem(tempItem);
            var promise,
            options = {
                    preventDefaultParams: true,
                params:{
                    accountId: Account.item.accountId,
                    accountLevel: Account.item.level,
                    embed:'childAccounts'
                }
            };
            promise = Account.item.get(options);
            promise.then(function(processedResponse){
                deferred.resolve(processedResponse);
            });
            return promise;
        }

        if ($scope.treeType && $scope.treeType === 'chl') {
                if ($rootScope.currentAccount.accountLevel !== 'siebel') {
                    Users.getTransactionalAccounts().then(function(accounts) {
                        if(accounts._embedded && accounts._embedded.transactionalAccounts 
                            && accounts._embedded.transactionalAccounts.length > 0) {
                            var promises = [];
                            for (i=0; i<accounts._embedded.transactionalAccounts.length; i++) {
                                var item = accounts._embedded.transactionalAccounts[i].account;
                                item._links = {
                                    self: {}
                                };
                                item._links.self = accounts._embedded.transactionalAccounts[i]._links.account;
                                deferred = $q.defer();
                                var promise = setChlChildren(item, deferred);
                                promises.push(promise);
                            }
                            $q.all(promises).then(function(response) {
                                for (i=0; i<response.length; i++) {
                                    if(response[i]
                                    && response[i].data 
                                    && response[i].data._embedded 
                                    && response[i].data._embedded.childAccounts 
                                    && response[i].data._embedded.childAccounts.length > 0) {
                                        var childAccounts = response[i].data._embedded.childAccounts;
                                        for (var j=0; j<childAccounts.length; j++) {
                                            var childItem = childAccounts[j];
                                            $scope.items.push(childItem);  
                                        }
                                    }
                                }
                            });
                        }
                    });
                } else {
                    var deferred = $q.defer(),
                    siebelAccount = $rootScope.currentAccount;
                    siebelAccount._links = {self: {}};
                    siebelAccount._links.self.href = siebelAccount.href;
                    var siebelPromise = setChlChildren(siebelAccount, deferred);
                    siebelPromise.then(function(response) {
                        if (response.data && response.data._embedded.childAccounts && response.data._embedded.childAccounts.length > 0) {
                            var childAccounts = response.data._embedded.childAccounts;
                            for (var j=0; j<childAccounts.length; j++) {
                                var childItem = childAccounts[j];
                                $scope.items.push(childItem);  
                            }
                        }
                    });
                }
        } else if ($scope.treeType && $scope.treeType === 'daAccounts') {
            if($scope.initialItem) {
                $scope.items.push($scope.initialItem);
            }
        }
        else if ($scope.treeType && $scope.treeType === 'location') {
            Locations.get().then(function(response) {
                if (Locations.item && Locations.item._embedded && Locations.item._embedded.countries) {
                    var countryList = Locations.item._embedded.countries;
                    for (var i=0; i<countryList.length; i++) {
                        var tempItem = {},
                        stateList = [];
                        tempItem.accountId = countryList[i].value;
                        tempItem.name = countryList[i].name;
                        for (var j=0; j<countryList[i].states.length; j++) {
                            var tempState = {},
                            cityList = [],
                            currentState = countryList[i].states[j];
                            tempState.accountId = currentState.value;
                            tempState.name = currentState.name;

                            for (var k=0; k<currentState.cities.length; k++) {
                                var tempCity = {},
                                currentCity = currentState.cities[k];
                                tempCity.accountId = currentCity.value;
                                tempCity.name = currentCity.name;
                                tempCity.numberOfChildren = 0;
                                cityList.push(tempCity);
                            }
                            if (cityList && cityList.length >0) {
                                tempState.items = cityList;
                            } else {
                                tempState.numberOfChildren = 0;
                            }
                            stateList.push(tempState);
                        }
                        tempItem.items = stateList;
                        $scope.items.push(tempItem);
                    }
                }
            });
        } else if ($scope.treeType && $scope.treeType === 'addressLocation') {
            AddressLocations.get().then(function(response) {
                if (AddressLocations.item && AddressLocations.item._embedded && AddressLocations.item._embedded.countries) {
                    var countryList = AddressLocations.item._embedded.countries;
                    for (var i=0; i<countryList.length; i++) {
                        var tempItem = {},
                        stateList = [];
                        tempItem.accountId = countryList[i].value;
                        tempItem.name = countryList[i].name;
                        for (var j=0; j<countryList[i].states.length; j++) {
                            var tempState = {},
                            cityList = [],
                            currentState = countryList[i].states[j];
                            tempState.accountId = currentState.value;
                            tempState.name = currentState.name;

                            for (var k=0; k<currentState.cities.length; k++) {
                                var tempCity = {},
                                currentCity = currentState.cities[k];
                                tempCity.accountId = currentCity.value;
                                tempCity.name = currentCity.name;
                                tempCity.numberOfChildren = 0;
                                cityList.push(tempCity);
                            }
                            if (cityList && cityList.length >0) {
                                tempState.items = cityList;
                            } else {
                                tempState.numberOfChildren = 0;
                            }
                            stateList.push(tempState);
                        }
                        tempItem.items = stateList;
                        $scope.items.push(tempItem);
                    }
                }
            });
        }
    }
]);

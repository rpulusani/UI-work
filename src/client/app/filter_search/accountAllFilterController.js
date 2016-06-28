angular.module('mps.filterSearch')
.controller('AccountAllFilterController', ['$scope', '$translate', 'LibraryAccounts', 'AllAccounts', 
    function($scope, $translate, LibraryAccounts, AllAccountsService) {
        $scope.showClearMessage = false;
        $scope.selectedAccountsList = [];
        $scope.accounts = [];
        $scope.searchAccountObj = {};
        $scope.filteredAccountsList = [];

        $scope.$watch('filteredAccountsList.length',function(newVal){
            $scope.selectedAccountsList = [];
            if($scope.filteredAccountsList.length > 0){
                for(var i = 0; i < $scope.filteredAccountsList.length; i++){
                    $scope.selectedAccountsList.push($scope.filteredAccountsList[i].accountId);
                }
                $scope.initiateSearch();
            }
            else{
                $scope.clearAccountsFilter();
            }
        });

        LibraryAccounts.get().then(function() {
            var accountsList = LibraryAccounts.data;

            for (var i = 0; i < accountsList.length; i++) {
                var account = {};
                account.name = accountsList[i].name;
                account.accountId = accountsList[i].accountId;
                account.selected = false;
                $scope.accounts.push(account);
            }
            if(accountsList.length === 0){
                $scope.searchAccounts = true;
                $scope.searchAccountObj = {};
            }
        });

        $scope.setAccounts = function() {
            $scope.$broadcast('searchAccount');
        };


        $scope.$on('searchAccount', function(evt){
            $scope.accountList = [];
            if($scope.searchAccountObj.name && $scope.searchAccountObj.name.length >=3) { 
                var options = {
                    preventDefaultParams: true,
                    params:{
                        searchTerm: encodeURIComponent($scope.searchAccountObj.name)
                    }
                };
                AllAccountsService.get(options).then(function(){
                    $scope.accountList = [];
                    if (AllAccountsService.item._embedded && AllAccountsService.item._embedded.accounts) {
                        var allAccountList = AllAccountsService.item._embedded.accounts;
                        for (var i=0; i<allAccountList.length; i++) {
                            $scope.accountList.push(allAccountList[i]);
                        }
                    }
                });
            }            
        });

        $scope.accountsFilter = function(account) {
            if (account.selected) {
                $scope.selectedAccountsList.push(account.accountId);
            } else {
                if ($scope.selectedAccountsList.indexOf(account.accountId) !== -1) {
                    $scope.selectedAccountsList.splice($scope.selectedAccountsList.indexOf(account.accountId), 1);
                }
            }
            $scope.initiateSearch();
        };

        $scope.initiateSearch = function(){            
            if ($scope.selectedAccountsList && $scope.filterDef && typeof $scope.filterDef === 'function'){
                if ($scope.selectedAccountsList.length > 0) {
                    $scope.showClearMessage = true;
                    $scope.noOfAccountsSelected = $scope.selectedAccountsList.length;
                } else {
                    $scope.showClearMessage = false;
                }

                var accountList = $scope.selectedAccountsList.join();
                if ($scope.selectedAccountsList.length > 0) {
                    $scope.params['accountIds'] = accountList;
                    $scope.filterDef($scope.params);
                } else {
                    $scope.params = {};
                    $scope.filterDef($scope.params, ['accountIds']);
                }
            }
        }

        $scope.clearAccountsFilter = function() {
            if($scope.filterDef && typeof $scope.filterDef === 'function') {
                $scope.params = {};
                $scope.noOfAccountsSelected = 0;
                if($scope.searchAccounts){
                    var $ = require('jquery');
                    $('.accountTree input[type=checkbox]').each(function(){
                        if(this.checked){
                            var x = this.id;
                            $(this).trigger('click');
                          }
                    });
                }
                $scope.selectedAccountsList = [];
                $scope.showClearMessage = false;

                for (var i = 0; i < $scope.accounts.length; i++) {
                    $scope.accounts[i].selected = false;
                }

                $scope.filterDef($scope.params, ['accountIds']);
            }
        };

    }
]);

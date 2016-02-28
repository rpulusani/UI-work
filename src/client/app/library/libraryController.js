

angular.module('mps.library')
.controller('LibraryController', ['$scope', '$location', '$routeParams', '$translate', '$http',
    'translationPlaceHolder', 'Documents', 'Tags', 'AccountService', 'UserService', 'BlankCheck', '$rootScope',
    'FormatterService', 'AllAccounts', '$q', 'AccountService',
    function($scope, $location, $routeParams, $translate, $http, translationPlaceHolder, Documents, Tags, Accounts, Users, BlankCheck,
        $rootScope, formatter, AllAccounts, $q, Account) {

        $scope.selectedAccounts = [];
        $scope.documentItem = {};
        $scope.documentItem.optionsLimit = 'include';
        $scope.allAccounts = true;
        $scope.accounts = [];
        $scope.AssignedAccountList = [];
        $scope.translationPlaceHolder = translationPlaceHolder;
        $scope.inputTag = '';
        $scope.showAllAccounts = true;
        $scope.documentItem.accountList = [];
        $scope.isCommitting = false;

        var redirect_to_list = function() {
           $location.path(Documents.route + '/');
        };

        if (Documents.item === null) {
            redirect_to_list();
        }

        if (!$routeParams.id) {
            $scope.documentItem = { id:'new', strategic: false };
        } else {
            $scope.documentItem = Documents.item;
            $scope.documentItem.accountList = [];
            if (BlankCheck.checkNotNullOrUndefined(Documents.item.publishDate)) {
                $scope.documentItem.publishDate = formatter.formatDate(Documents.item.publishDate);
            }

            if (BlankCheck.checkNotNullOrUndefined(Documents.item.endDate)) {
                $scope.documentItem.endDate = formatter.formatDate(Documents.item.endDate);
            }

            if ($scope.documentItem.accountIds && $scope.documentItem.accountIds.length > 0) {
                $scope.documentItem.optionsLimit = 'include';
                $scope.allAccounts = false;
                Users.getLoggedInUserInfo().then(function() {
                    if (Users.item._links.accounts) {
                        if (angular.isArray(Users.item._links.accounts)) {
                            for (var i=0;i<Users.item._links.accounts.length;i++) {
                                for (var j = 0; j < $scope.documentItem.accountIds.length; j++) {
                                    if (Users.item.accounts[i].accountId === $scope.documentItem.accountIds[j]) {
                                        $scope.selectedAccounts.push(Users.item.accounts[i]);
                                    }
                                }
                            }
                        } else {
                            Users.getAdditional(Users.item, Account).then(function() {
                                for (var j = 0; j < $scope.documentItem.accountIds.length; j++) {
                                    if (Account.item.accountId === $scope.documentItem.accountIds[j]) {
                                        $scope.selectedAccounts.push(Account.item);
                                    }
                                }
                            });
                        }
                    } else {
                        AllAccounts.get().then(function(){
                            if (AllAccounts.item._embedded && AllAccounts.item._embedded.accounts) {
                                $scope.accounts = AllAccounts.item._embedded.accounts;
                                for (var i = 0; i < $scope.accounts.length; i++) {
                                    for (var j = 0; j < $scope.documentItem.accountIds.length; j++) {
                                        if ($scope.accounts[i].accountId === $scope.documentItem.accountIds[j]) {
                                            $scope.selectedAccounts.push($scope.accounts[i]);
                                        }
                                    }
                                }
                            }
                        });
                    }
                });
            }

        }

        $scope.isDeleting = false;

        $scope.setAccounts = function() {
            $scope.$broadcast('searchAccount');
        };

        $scope.removeAccount = function(item) {
            if ($scope.selectedAccounts && $scope.selectedAccounts.length > 0) {
                for (var j=0;j<$scope.selectedAccounts.length; j++) {
                    if ($scope.selectedAccounts[j].accountId
                        && $scope.selectedAccounts[j].accountId === item.accountId
                        && $scope.selectedAccounts[j].level === item.level
                        && $scope.selectedAccounts[j].name === item.name) {
                        $scope.selectedAccounts.splice(j, 1);
                    }
                }
            }
            $scope.$broadcast('searchAccount');
        };

        $scope.$on('searchAccount', function(evt){
            $scope.accountList = [];
            if($scope.documentItem.accountName && $scope.documentItem.accountName.length >=3) {
                var options = {
                    preventDefaultParams: true,
                    params:{
                        searchTerm: $scope.documentItem.accountName
                    }
                };
                AllAccounts.get(options).then(function(){
                    $scope.accountList = [];
                    if (AllAccounts.item._embedded && AllAccounts.item._embedded.accounts) {
                        var allAccountList = AllAccounts.item._embedded.accounts;
                        for (var i=0; i<allAccountList.length; i++) {
                            $scope.accountList.push(allAccountList[i]);
                        }
                    }
                });
            }
        });

        $scope.goToStartDelete = function () {
            $scope.isDeleting = true;
        };

        $scope.goToCancelDelete = function () {
            $scope.isDeleting = false;
        };

        $scope.tags = [];
        Tags.get().then(function() {
            var tagList = Tags.data;
            for (var i = 0; i < tagList.length; i++) {
                var tag = {};
                if (tagList[i]['name']) {
                    tag.name = tagList[i]['name'];
                    $scope.tags.push(tag);
                }
            }
        });

        $scope.setDocumentName = function(files) {
            var tmp = files[0].name;
            var l = tmp.split('.').pop();

            $scope.documentItem.extension = l;
            $scope.documentItem.name = tmp.slice(0, -(l.length+1));
        };

        $scope.save = function() {
            $scope.isCommitting = true;
            $scope.uploadSuccess = false;
            $scope.modifySuccess = false;

            Documents.newMessage();

            if (BlankCheck.checkNotNullOrUndefined($scope.documentItem.name)) {
                Documents.addField('name', $scope.documentItem.name);
            }

            if (BlankCheck.checkNotNullOrUndefined($scope.documentItem.description)) {
                Documents.addField('description', $scope.documentItem.description);
            }

            if (BlankCheck.checkNotNullOrUndefined($scope.documentItem.publishDate)) {
                Documents.addField('publishDate', formatter.formatDateForPost($scope.documentItem.publishDate));
            }

            if (BlankCheck.checkNotNullOrUndefined($scope.documentItem.endDate)) {
                Documents.addField('endDate', formatter.formatDateForPost($scope.documentItem.endDate));
            }

            if (BlankCheck.checkNotNullOrUndefined($scope.documentItem.strategic)) {
                Documents.addField('strategic', $scope.documentItem.strategic);
            }

            if ($rootScope.documentLibraryManageAccountAccess) {
                var accessToSend = [];
                if ($scope.documentItem.optionsLimit === 'include') {
                    // if we have items in selectedAccounts, push them.
                    if ($scope.selectedAccounts.length > 0) {
                        for (var i = 0; i < $scope.selectedAccounts.length; i++) {
                            accessToSend.push($scope.selectedAccounts[i].accountId);
                        }
                    }
                    /*commenting as per discussion with BE. They will right the code to add all accounts*/
                    // else, send all the accounts that we have
                    /*else {
                        for (var i = 0; i < $scope.accounts.length; i++) {
                            accessToSend.push($scope.accounts[i].accountId);
                        }
                    }*/
                } else {
                    // remove the accounts with no access
                    if ($scope.selectedAccounts.length > 0) {
                        Users.getLoggedInUserInfo().then(function() {
                            if (Users.item._links.accounts) {
                                if (angular.isArray(Users.item._links.accounts)) {
                                    for (var i=0;i<Users.item._links.accounts.length;i++) {
                                        for (var j = 0; j < $scope.selectedAccounts.length; j++) {
                                            if (Users.item.accounts[i].accountId !== $scope.selectedAccounts[j].accountId) {
                                                accessToSend.push(Users.item.accounts[i].accountId);
                                            }
                                        }
                                    }
                                } else {
                                    Users.getAdditional(Users.item, Account).then(function() {
                                        for (var j = 0; j < $scope.selectedAccounts.length; j++) {
                                            if (Account.item.accountId !== $scope.selectedAccounts[j].accountId) {
                                                accessToSend.push(Account.item.accountId);
                                            }
                                        }
                                    });
                                }
                            } else {
                                AllAccounts.get().then(function(){
                                    if (AllAccounts.item._embedded && AllAccounts.item._embedded.accounts) {
                                        $scope.accounts = AllAccounts.item._embedded.accounts;
                                        for (var i = 0; i < $scope.accounts.length; i++) {
                                            for (var j = 0; j < $scope.selectedAccounts.length; j++) {
                                                if (!($scope.accounts[i].accountId === $scope.selectedAccounts[j].accountId)) {
                                                    accessToSend.push($scope.accounts[i].accountId);
                                                }
                                            }
                                        }
                                    }
                                });
                            }

                        });
                    }
                    /*commenting as per discussion with BE. They will right the code to add all accounts*/
                    /*else {
                        // else, send all from $scope.accounts
                        for (var i = 0; i < $scope.accounts.length; i++) {
                            accessToSend.push($scope.accounts[i].accountId);
                        }
                    }*/
                }

                if (accessToSend.length > 0) {
                    Documents.addField('accountIds', accessToSend);
                }
            }

            Documents.item.postURL = Documents.url;

            var tagArray = [];
            if ($scope.documentItem.tags) {
                if ($scope.documentItem.tags.length > 0) {

                    for (var i = 0; i < $scope.documentItem.tags.length; i++) {
                        for (var j = 0; j < Tags.data.length; j++) {

                            if (Tags.data[j]['name'] === $scope.documentItem.tags[i]['name'])  {
                                var r = Tags.url + "/" + Tags.data[j]['id'];
                                tagArray.push({ 'href': r });
                            }
                        }
                    }
                }
            }

            Documents.item._links.tags = tagArray;

            if ($scope.documentItem.id !== 'new') {
                /* update */

                var fd = new FormData();

                var documentJson = angular.toJson(Documents.item);

                fd.append('document', new Blob([documentJson], {type: 'application/json'}));

                $http({
                    method: 'PUT',
                    url: Documents.url + '/' + $scope.documentItem.id,
                    headers: {'Content-Type': undefined },
                    data: fd
                }).then(function successCallback(response) {
                    Documents.setItem(response.data);
                    $scope.documentItem = Documents.item;
                    $scope.documentItem.publishDate = formatter.formatDate(Documents.item.publishDate);
                    $scope.documentItem.endDate =  formatter.formatDate(Documents.item.endDate);

                    $scope.modifySuccess = true;
                    $scope.isCommitting = false;
                }, function errorCallback(response) {
                    NREUM.noticeError('Failed to UPDATE new document library file: ' + response.statusText);
                });
            } else {
                /* upload */

                if ($scope.documentFile === undefined) {
                    return;
                }

                var fd = new FormData();

                var documentJson = angular.toJson(Documents.item);

                fd.append('document', new Blob([documentJson], {type: 'application/json'}));
                fd.append('file', $scope.documentFile);

                $http({
                    method: 'POST',
                    url: Documents.url,
                    headers: {'Content-Type': undefined },
                    data: fd
                }).then(function successCallback(response) {
                    Documents.setItem(response.data);
                    $scope.documentItem = Documents.item;
                    $scope.documentItem.publishDate = formatter.formatDate(Documents.item.publishDate);
                    $scope.documentItem.endDate =  formatter.formatDate(Documents.item.endDate);

                    $scope.uploadSuccess = true;
                    $scope.isCommitting = false;
                }, function errorCallback(response) {
                    NREUM.noticeError('Failed to UPLOAD new document library file: ' + response.statusText);
                });
            }
        };

        $scope.loadTags = function(query) {
                var opts = { params: { size: 4096, search: query }};
                var typeAheadTags = [];

                return Tags.get(opts).then(function() {
                    if (Tags.data) {
                        var tmp = Tags.data;
                            for (var i = 0; i < tmp.length; i++) {
                                var tag = {};
                                if (tmp[i]['name']) {
                                    tag.name = tmp[i]['name'];
                                    typeAheadTags.push(tag);
                                }
                            }
                    }

                    return typeAheadTags;
                });
        }

        $scope.goToDelete = function() {
            $http({
                method: 'DELETE',
                url: $scope.documentItem.url
            }).then(function successCallback(response) {
                $location.path(Documents.route);
            }, function errorCallback(response) {
                NREUM.noticeError('Failed to DELETE existing document library file: ' + response.statusText);
            });
        };

        $scope.cancel = function() {
            redirect_to_list();
        };

        $scope.goToSelectAccount = function() {
            if ($scope.documentItem.accountSelected === $translate.instant('LABEL.SELECT')) {
                return;
            }

            for (var i = 0; i < $scope.selectedAccounts.length; i++) {
                if ($scope.selectedAccounts[i].accountId === $scope.documentItem.accountSelected) {
                    return;
                }
            }

            for (var i = 0; i < $scope.documentItem.accountList.length; i++) {
                if ($scope.documentItem.accountList[i].accountId === $scope.documentItem.accountSelected) {
                    $scope.selectedAccounts.push($scope.documentItem.accountList[i]);
                }
            }
        };

        $scope.goToDeleteSelectedAccount = function(index) {
            $scope.selectedAccounts.splice(index, 1);
        };

        $scope.changeAccess = function(index) {
            $scope.documentItem.accountName = '';
            $scope.selectedAccounts = [];
        };
    }
]);


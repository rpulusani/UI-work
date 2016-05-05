angular.module('mps.library')
.controller('LibraryController', ['$scope', '$location', '$routeParams', '$translate', '$http',
    'translationPlaceHolder', 'Documents', 'Tags', 'AccountService', 'UserService', 'BlankCheck', '$rootScope',
    'FormatterService', '$route', 'LibraryAccounts',
    function($scope, $location, $routeParams, $translate, $http, translationPlaceHolder, Documents, Tags, Accounts, Users, BlankCheck,
        $rootScope, formatter, $route, LibraryAccounts) {

        $scope.translationPlaceHolder = translationPlaceHolder;
        $scope.documentItem = {};
        $scope.documentItem.optionsLimit = 'include';
        $scope.documentItem.accountList = [];

        $scope.selectedLibraryAccounts = [];

        $scope.inputTag = '';
        $scope.allAccounts = true;

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

            $scope.phDocumentName = $scope.documentItem.name;

            $scope.documentItem.accountList = [];
            if (BlankCheck.checkNotNullOrUndefined(Documents.item.publishDate)) {
                var dy = Documents.item.publishDate + 'Z';
                $scope.documentItem.publishDate = formatter.getDatePickerDisplayDate(new Date(dy));
            }

            if (BlankCheck.checkNotNullOrUndefined(Documents.item.endDate)) {
                var dy = Documents.item.endDate + 'Z';
                $scope.documentItem.endDate = formatter.getDatePickerDisplayDate(new Date(dy));
            }

            if ($scope.documentItem.accounts && $scope.documentItem.accounts.length > 0) {
                $scope.allAccounts = false;
                $scope.documentItem.optionsLimit = 'include';

                $scope.selectedLibraryAccounts = $scope.documentItem.accounts;
            }
        }

        $scope.isDeleting = false;

        $scope.goToStartDelete = function () {
            $scope.isDeleting = true;
        };

        $scope.goToCancelDelete = function () {
            $scope.isDeleting = false;
        };

        $scope.getDeleteAction = function (owner) {
            var showBtn = false;

            if (owner === $rootScope.idpUser.email && $rootScope.documentLibraryDeleteMyAccess) {
                showBtn = true;
            }

            if ($rootScope.documentLibraryDeleteAllAccess) {
                showBtn = true;
            }

            return showBtn;
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

        $scope.libraryAccounts = [];
        LibraryAccounts.get().then(function() {
            $scope.libraryAccounts = LibraryAccounts.data;
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
                var accountsToSend = [];

                if ($scope.documentItem.optionsLimit === 'include') {
                    if ($scope.selectedLibraryAccounts.length > 0) {
                        accountsToSend = $scope.selectedLibraryAccounts;
                    }
                }

                if (accountsToSend.length > 0) {
                    Documents.addField('accounts', accountsToSend);
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
                    response.data.modifySuccess = true;
                    Documents.setItem(response.data);

                    $route.reload();
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
                    response.data.uploadSuccess = true;
                    Documents.setItem(response.data);

                    $location.path(Documents.route + "/" + Documents.item.id + "/update");
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
            Documents.isDeleted = false;
            $http({
                method: 'DELETE',
                url: $scope.documentItem.url
            }).then(function successCallback(response) {
                Documents.isDeleted = true;
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

            for (var i = 0; i < $scope.selectedLibraryAccounts.length; i++) {
                if ($scope.selectedLibraryAccounts[i].accountId === $scope.documentItem.accountSelected) {
                    return;
                }
            }

            for (var i = 0; i < $scope.libraryAccounts.length; i++) {
                if ($scope.libraryAccounts[i].accountId === $scope.documentItem.accountSelected) {
                    $scope.selectedLibraryAccounts.push($scope.libraryAccounts[i]);
                }
            }
        };

        $scope.goToRemoveAccount = function(account) {
            for (var i = 0; i < $scope.selectedLibraryAccounts.length; i++) {
                if ($scope.selectedLibraryAccounts[i].accountId === account.accountId) {
                    $scope.selectedLibraryAccounts.splice(i, 1);
                }
            }
        };

        $scope.changeOptionsLimit = function() {
            if ($scope.allAccounts === true) {
                $scope.documentItem.optionsLimit = 'include';
            }
        };

        $scope.changeAccess = function(index) {
            $scope.documentItem.accountName = '';
            $scope.selectedLibraryAccounts = [];
        };
    }
]);

define(['angular', 'library'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .controller('LibraryController', ['$scope', '$location', '$routeParams', '$translate', '$http',
        'translationPlaceHolder', 'Documents', 'BlankCheck', '$rootScope', 'FormatterService',
        function($scope, $location, $routeParams, $translate, $http, translationPlaceHolder, Documents, BlankCheck,
            $rootScope, Formatter) {

            $scope.translationPlaceHolder = translationPlaceHolder;

            var redirect_to_list = function() {
               $location.path(Documents.route + '/');
            };

            if (Documents.item === null) {
                redirect_to_list();
            }

            if (!$routeParams.id) {
                $scope.documentItem = { accountId: $rootScope.contactId, id:'new' };
            } else {
                $scope.documentItem = Documents.item;
                $scope.documentItem.dateFrom = Formatter.formatDate(Documents.item.publishDate);
                $scope.documentItem.dateTo = Formatter.formatDate(Documents.item.endDate);
            }

            $scope.isDeleting = false;

            $scope.goToStartDelete = function () {
                $scope.isDeleting = true;
            };

            $scope.goToCancelDelete = function () {
                $scope.isDeleting = false;
            };

            $scope.setDocumentName = function() {
                var tmp = event.target.files[0].name;
                var l = tmp.split('.').pop();

                $scope.documentItem.extension = l;
                $scope.documentItem.name = tmp.slice(0, -(l.length+1));
            };

            $scope.save = function() {
                if ($scope.documentItem.id !== 'new') {
                    /* update */
                    var fd = new FormData();

                    if (!BlankCheck.isNull($scope.documentItem.name)) {
                        fd.append('name', $scope.documentItem.name);
                    }

                    if (!BlankCheck.isNull($scope.documentItem.description)) {
                        fd.append('description', $scope.documentItem.description);
                    }

                    if (!BlankCheck.isNull($scope.documentItem.tags)) {
                        fd.append('tags', $scope.documentItem.tags);
                    }

                    if (!BlankCheck.isNull($scope.documentItem.dateFrom)) {
                        fd.append('publishDate', Formatter.formatDateForPost($scope.documentItem.dateFrom));
                    }

                    if (!BlankCheck.isNull($scope.documentItem.dateTo)) {
                        fd.append('endDate', Formatter.formatDateForPost($scope.documentItem.dateTo));
                    }

                    $http({
                        method: 'PUT',
                        url: Documents.url + '/' + $scope.documentItem.id,
                        headers: {'Content-Type': undefined },
                        data: fd
                    }).then(function successCallback(response) {
                        $location.path(Documents.route);
                    }, function errorCallback(response) {
                        NREUM.noticeError('Failed to UPDATE new document library file: ' + response.statusText);
                    });
                } else {
                    /* upload */
                    var fd = new FormData();
                    fd.append('file', $scope.documentFile);
                    fd.append('name', $scope.documentItem.name);

                    if (!BlankCheck.isNull($scope.documentItem.description)) {
                        fd.append('description', $scope.documentItem.description);
                    }

                    if (!BlankCheck.isNull($scope.documentItem.tags)) {
                        fd.append('tags', $scope.documentItem.tags);
                    }

                    if (!BlankCheck.isNull($scope.documentItem.dateFrom)) {
                        fd.append('publishDate', Formatter.formatDateForPost($scope.documentItem.dateFrom));
                    }

                    if (!BlankCheck.isNull($scope.documentItem.dateTo)) {
                        fd.append('endDate', Formatter.formatDateForPost($scope.documentItem.dateTo));
                    }

                    fd.append('owner', $rootScope.idpUser.email);

                    $http({
                        method: 'POST',
                        url: Documents.url,
                        headers: {'Content-Type': undefined },
                        data: fd
                    }).then(function successCallback(response) {
                        $location.path(Documents.route);
                    }, function errorCallback(response) {
                        NREUM.noticeError('Failed to UPLOAD new document library file: ' + response.statusText);
                    });
                }
            };

            $scope.addTags = function() {
            };

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
        }
    ]);
});

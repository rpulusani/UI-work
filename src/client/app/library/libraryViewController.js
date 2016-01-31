define(['angular', 'library', 'utility.formatters'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .controller('LibraryViewController', ['$scope', '$location', '$translate', '$http', 'Documents', '$rootScope', 'FormatterService',
        function($scope, $location, $translate, $http, Documents, $rootScope, formatter) {

            if (Documents.item === null) {
                $location.path(Documents.route);
            } else {
                $scope.documentItem = Documents.item;
            }

            $scope.getTagNames = function(tags) {
                return tags.join(', ');
            };

            $scope.getFileSize = function(size) {
                var calculatedSize = formatter.getFileSize(size);
                return calculatedSize;
            };

            $scope.getFormatDate = function(date) {
                return formatter.formatDate(date);
            };

            $scope.getFileOwner = function(owner) {
                return formatter.getFileOwnerForLibrary(owner, $rootScope.idpUser.email);
            };

            $scope.goToUpdate = function(documentItem) {
                Documents.setItem(documentItem);

                $location.path(Documents.route + '/' + $scope.documentItem.id + '/update');
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

            $scope.goToDownload = function(documentItem) {

            }
        }
    ]);
});

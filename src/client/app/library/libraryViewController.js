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

            $scope.isDeleting = false;

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

            $scope.goToDocumentView = function(documentItem) {
                Documents.setItem(documentItem);

                $location.path(Documents.route + '/' + $scope.documentItem.id + '/view');
            };

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

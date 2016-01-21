define(['angular', 'library', 'utility.formatters'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .controller('LibraryViewController', ['$scope', '$location', '$translate', '$http', 'Documents', '$rootScope', 'FormatterService',
        function($scope, $location, $translate, $http, Documents, $rootScope, FormatterService) {

            if (Documents.item === null) {
                $location.path(Documents.route);
            } else {
                $scope.documentItem = Documents.item;
            }

            $scope.getFileSize = function(size) {
                var calculatedSize = FormatterService.getFileSize(size);
                return calculatedSize;
            };

            $scope.getFormatDate = function(date) {
                return FormatterService.formatDate(date);
            };

            $scope.getOwner = function(email) {
                var currentUserEmail = $rootScope.idpUser.email;
                if (email === currentUserEmail) {
                    return email + ' (' + $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LIST.TXT_YOU') + ')';
                }
                else {
                    return email;
                }
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

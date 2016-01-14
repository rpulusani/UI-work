define(['angular', 'library', 'utility.formatters'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .controller('LibraryViewController', ['$scope', '$location', '$translate', 'Documents', '$rootScope', 'FormatterService',
        function($scope, $location, $translate, Documents, $rootScope, FormatterService) {

            if (Documents.item === null) {
                $location.path(Documents.route);
            } else {
                $scope.documentItem = Documents.item;
                
                console.log($rootScope.idpUser.email);
            }

            $scope.getFileSize = function(size) {
                var calculatedSize = FormatterService.getFileSize(size);
                return calculatedSize;
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

            $scope.goToDelete = function(documentItem) {
                Documents.setItem(documentItem);

                $location.path(Documents.route + '/' + $scope.documentItem.id + '/delete');
            };
        }
    ]);
});

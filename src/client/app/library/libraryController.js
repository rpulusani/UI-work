define(['angular', 'library'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .controller('LibraryController', ['$scope', '$location', '$routeParams', '$translate', '$http', 'translationPlaceHolder', 'Documents', '$rootScope', '$http',
        function($scope, $location, $routeParams, $translate, $http, translationPlaceHolder, Documents, $rootScope) {

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
            }

            $scope.setDocumentName = function() {
                var tmp = event.target.files[0].name;
                var l = tmp.split('.').pop();
                
                $scope.documentItem.extension = l;
                $scope.documentItem.name = tmp.slice(0, -(l.length+1));
            };

            $scope.save = function() {
                if ($scope.documentItem.id !== 'new') {
                    /* update, not impl. yet. */
                } else {
                    /* upload */
                    var fd = new FormData();
                    fd.append('file', $scope.documentFile);
                    $http({
                        method: 'POST',
                        url: Documents.url + '/upload',
                        data: fd
                    }).then(function successCallback(response) {
                        $location.path(Documents.route);
                    }, function errorCallback(response) {
                        NREUM.noticeError('Failed to UPLOAD new document library file: ' + response.statusText);
                    });
                }
            };

            $scope.addTag = function() {
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

define(['angular', 'library', 'ngTagsInput'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .controller('LibraryController', ['$scope', '$location', '$routeParams', '$translate', '$http',
        'translationPlaceHolder', 'Documents', 'BlankCheck', '$rootScope', 'FormatterService',
        function($scope, $location, $routeParams, $translate, $http, translationPlaceHolder, Documents, BlankCheck,
            $rootScope, Formatter) {

            $scope.translationPlaceHolder = translationPlaceHolder;
            $scope.inputTag = '';

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

                    var tags = [];
                    for (var i = 0; i < $scope.documentItem.tags.length; i++) {
                        tags.push($scope.documentItem.tags[i]['name']);
                    }

                    var fd = new FormData();
                    var sourceData = {
                        name: $scope.documentItem.name,
                        description: $scope.documentItem.description,
                        //tags: $scope.documentItem.tags,
                        publishDate: Formatter.formatDateForPost($scope.documentItem.dateFrom),
                        endDate: Formatter.formatDateForPost($scope.documentItem.dateTo)
                    };
 
                    var documentJson = angular.toJson(sourceData);
                    fd.append('document', new Blob([documentJson], {type: 'application/json'}));
                    fd.append('file', $scope.documentFile);

                    $http({
                        method: 'PUT',
                        url: Documents.url + '/' + $scope.documentItem.id,
                        headers: {'Content-Type': undefined },
                        data: fd
                    }).then(function successCallback(response) {
                        //$scope.uploadSuccess = true;
                        redirect_to_list();
                    }, function errorCallback(response) {
                        NREUM.noticeError('Failed to UPDATE new document library file: ' + response.statusText);
                    });
                } else {
                    /* upload */
                    
                    var fd = new FormData();

                    var tags = [];
                    for (var i = 0; i < $scope.documentItem.tags.length; i++) {
                        tags.push($scope.documentItem.tags[i]['name']);
                    }

                    var sourceData = {
                        name: $scope.documentItem.name,
                        description: $scope.documentItem.description,
                        //tags: tags,
                        publishDate: Formatter.formatDateForPost($scope.documentItem.dateFrom),
                        endDate: Formatter.formatDateForPost($scope.documentItem.dateTo)
                    };

                    var documentJson = angular.toJson(sourceData);

                    fd.append('document', new Blob([documentJson], {type: 'application/json'}));
                    fd.append('file', $scope.documentFile);

                    $http({
                        method: 'POST',
                        url: Documents.url,
                        headers: {'Content-Type': undefined },
                        data: fd
                    }).then(function successCallback(response) {
                        $scope.uploadSuccess = true;
                    }, function errorCallback(response) {
                        NREUM.noticeError('Failed to UPLOAD new document library file: ' + response.statusText);
                    });
                }
            };

            $scope.loadTags = function(query) {
                var tags = [
                 { name: 'business' },
                 { name: 'document' },
                 { name: 'internal' },
                 { name: 'MPS' },
                 { name: 'training' }
             ];
                return tags;
            };

            $scope.goToShowTags = function()  {
                $scope.isShowingTags = true;
                console.log('show tags');
            };
            
            $scope.goToHideTags = function()  {
                $scope.isShowingTags = false;
                console.log('hide tags');
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

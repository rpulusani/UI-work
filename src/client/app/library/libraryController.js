define(['angular', 'library', 'ngTagsInput'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .controller('LibraryController', ['$scope', '$location', '$routeParams', '$translate', '$http',
        'translationPlaceHolder', 'Documents', 'Tags', 'BlankCheck', '$rootScope', 'FormatterService',
        function($scope, $location, $routeParams, $translate, $http, translationPlaceHolder, Documents, Tags, BlankCheck,
            $rootScope, formatter) {

            $scope.translationPlaceHolder = translationPlaceHolder;
            $scope.inputTag = '';

            var redirect_to_list = function() {
               $location.path(Documents.route + '/');
            };

            if (Documents.item === null) {
                redirect_to_list();
            }

            if (!$routeParams.id) {
                $scope.documentItem = { id:'new' };
            } else {
                $scope.documentItem = Documents.item;
                $scope.documentItem.publishDate = formatter.formatDate(Documents.item.publishDate);
                $scope.documentItem.endDate =  formatter.formatDate(Documents.item.endDate);
            }

            $scope.isDeleting = false;

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
                    tag.name = tagList[i]['name'];
                    $scope.tags.push(tag);
                }
            });

            $scope.setDocumentName = function(files) {
                var tmp = files[0].name;
                var l = tmp.split('.').pop();

                $scope.documentItem.extension = l;
                $scope.documentItem.name = tmp.slice(0, -(l.length+1));
            };

            $scope.save = function() {
                $scope.uploadSuccess = false;
                $scope.modifySuccess = false;

                Documents.newMessage();
                Documents.addField("name", $scope.documentItem.name);
                Documents.addField("description", $scope.documentItem.description);
                Documents.addField("publishDate", $scope.documentItem.publishDate);
                Documents.addField("endDate", $scope.documentItem.endDate);
                Documents.item.postURL = Documents.url;

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
                    }, function errorCallback(response) {
                        NREUM.noticeError('Failed to UPLOAD new document library file: ' + response.statusText);
                    });
                }
            };

            $scope.loadTags = function(query) {
                return $scope.tags;
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
        }
    ]);
});

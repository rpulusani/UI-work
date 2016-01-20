define(['angular', 'library'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .controller('LibraryController', ['$scope', '$location', '$routeParams', '$translate', 'translationPlaceHolder', 'Documents', '$rootScope', '$http',
        function($scope, $location, $routeParams, $translate, translationPlaceHolder, Documents, $rootScope, $http) {

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
                /*
                if ($scope.documentItem.id) {
                    Documents.update({
                        id: $scope.address.id,
                        accountId: $scope.documentItem.documentId
                    }, $scope.documentItem, redirect_to_list);
                } else {
                    Documents.save({
                        accountId: $scope.documentItem.documentId
                    }, $scope.documentItem, redirect_to_list);
                }*/
            };

            $scope.addTag = function() {
            }

            $scope.cancel = function() {
                redirect_to_list();
            };
        }
    ]);
});

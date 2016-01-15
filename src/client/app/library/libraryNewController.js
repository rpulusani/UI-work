define(['angular', 'library'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .controller('LibraryNewController', ['$scope', '$location', '$routeParams', '$translate', 'Documents', '$rootScope',
        function($scope, $location, $routeParams, $translate, Documents, $rootScope) {

            function configureAddTemplates() {
                $scope.configure = {
                    header: {
                        translate: {
                            h1: 'DOCUMENT_LIBRARY.ADD_NEW_DOCUMENT.TXT_ADD_NEW_DOCUMENT',
                            body: 'DOCUMENT_LIBRARY.ADD_NEW_DOCUMENT.TXT_ADD_NEW_DOCUMENT_PAR'
                        }
                    }
                };
            }

            function configureUpdateTemplates() {
                $scope.configure = {
                    header: {
                        translate: {
                            h1: 'DOCUMENT_LIBRARY.ADD_NEW_DOCUMENT.TXT_ADD_NEW_DOCUMENT',
                            body: 'DOCUMENT_LIBRARY.ADD_NEW_DOCUMENT.TXT_ADD_NEW_DOCUMENT_PAR'
                        }
                    }
                };
            }

            var redirect_to_list = function() {
               $location.path(Documents.route + '/');
            };

            if (Documents.item === null) {
                redirect_to_list();
            }

            if (!$routeParams.id) {
                $scope.documentItem = {};
                configureAddTemplates();

            } else {
                $scope.documentItem = Documents.item;
                configureUpdateTemplates();
            }

        }
    ]);
});

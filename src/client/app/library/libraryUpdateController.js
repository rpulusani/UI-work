define(['angular', 'library'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .controller('LibraryUpdateController', ['$scope', '$location', '$routeParams', '$translate', 'Documents', '$rootScope',
        function($scope, $location, $routeParams, $translate, Documents, $rootScope) {

            var redirect_to_list = function() {
               $location.path(Documents.route + '/');
            };

            if (Documents.item === null) {
                redirect_to_list();
            }
            else {
                $scope.documentItem = Documents.item;
            }

        }
    ]);
});

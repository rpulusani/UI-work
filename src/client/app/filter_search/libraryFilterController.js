define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('LibraryFilterController', ['$scope', '$translate',
        function($scope, $translate) {

            $scope.libraryCategoryFilter = function() {
                console.log('libraryCategoryFilter');
            };

            $scope.libraryOwnerFilter = function() {
                console.log('libraryOwnerFilter');
            };

            $scope.libraryTagsFilter = function() {
                console.log('libraryTagsFilter');
            };
        }
    ]);
});

define(['angular', 'filterSearch'], function(angular) {
    'use strict';
    angular.module('mps.filterSearch')
    .controller('LibraryFilterController', ['$scope', '$translate',
        function($scope, $translate) {
            $scope.showCategoryClearMessage = false;
            $scope.showOwnerClearMessage = false;
            $scope.showTagClearMessage = false;

            $scope.selectedCategoriesList = [];
            $scope.selectedOwnersList = [];
            $scope.selectedTagsList = [];

            $scope.categories = [
                {name: 'strategic', label: $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_FILTER_STRATEGIC'), selected: false },
                {name: 'nonstrategic', label: $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_FILTER_NON_STRATEGIC'), selected: false }
            ];

            $scope.owners = [
                {name: 'jdoe@customer.com', selected: false },
                {name: 'jpublic@lexmark.com', selected: false },
                {name: 'jpublic@lexmark.com', selected: false }
            ];

            $scope.tags = [
                {name: 'business', selected: false },
                {name: 'document', selected: false },
                {name: 'internal', selected: false },
                {name: 'MPS', selected: false },
                {name: 'training', selected: false }
            ];

            $scope.categoriesFilter = function(cat) {
                if (cat.selected) {
                    $scope.selectedCategoriesList.push(cat.name);
                } else {
                    if ($scope.selectedCategoriesList.indexOf(cat.name) !== -1) {
                        $scope.selectedCategoriesList.splice($scope.selectedCategoriesList.indexOf(cat.name), 1);
                    }
                }

                if ($scope.selectedCategoriesList && $scope.filterDef && typeof $scope.filterDef === 'function'){
                    if ($scope.selectedCategoriesList.length > 0) {
                        $scope.showCategoryClearMessage = true;
                        $scope.noOfCategoriesSelected = $scope.selectedCategoriesList.length;
                    } else {
                        $scope.showCategoryClearMessage = false;
                    }

                    var categoryList = $scope.selectedCategoriesList.join();
                    if ($scope.selectedCategoriesList.length > 0) {
                        $scope.params['category'] = categoryList;
                        $scope.filterDef($scope.params, ['bookmark', 'requesterFilter']);
                    } else {
                        $scope.params = {};
                        $scope.filterDef($scope.params, ['category', 'bookmark', 'requesterFilter']);
                    }
                }
            };

            $scope.ownersFilter = function(owner) {
                if (owner.selected) {
                    $scope.selectedOwnersList.push(owner.name);
                } else {
                    if ($scope.selectedOwnersList.indexOf(owner.name) !== -1) {
                        $scope.selectedOwnersList.splice($scope.selectedOwnersList.indexOf(owner.name), 1);
                    }
                }

                if ($scope.selectedOwnersList && $scope.filterDef && typeof $scope.filterDef === 'function'){
                    if ($scope.selectedOwnersList.length > 0) {
                        $scope.showOwnerClearMessage = true;
                        $scope.noOfOwnersSelected = $scope.selectedOwnersList.length;
                    } else {
                        $scope.showOwnerClearMessage = false;
                    }

                    var ownerList = $scope.selectedOwnersList.join();
                    if ($scope.selectedOwnersList.length > 0) {
                        $scope.params['owner'] = ownerList;
                        $scope.filterDef($scope.params, ['bookmark', 'requesterFilter']);
                    } else {
                        $scope.params = {};
                        $scope.filterDef($scope.params, ['owner', 'bookmark', 'requesterFilter']);
                    }
                }
            };

            $scope.tagsFilter = function(tag) {
                if (tag.selected) {
                    $scope.selectedTagsList.push(tag.name);
                } else {
                    if ($scope.selectedTagsList.indexOf(tag.name) !== -1) {
                        $scope.selectedTagsList.splice($scope.selectedTagsList.indexOf(tag.name), 1);
                    }
                }

                if ($scope.selectedTagsList && $scope.filterDef && typeof $scope.filterDef === 'function') {
                    if ($scope.selectedTagsList.length > 0) {
                        $scope.showTagClearMessage = true;
                        $scope.noOfTagsSelected = $scope.selectedTagsList.length;
                    } else {
                        $scope.showTagClearMessage = false;
                    }

                    var tagList = $scope.selectedTagsList.join();
                    if ($scope.selectedTagsList.length > 0) {
                        $scope.params['tag'] = tagList;
                        $scope.filterDef($scope.params, ['bookmark', 'requesterFilter']);
                    } else {
                        $scope.params = {};
                        $scope.filterDef($scope.params, ['tag', 'bookmark', 'requesterFilter']);
                    }
                }
            };

            $scope.clearCategoriesFilter = function(){
                if ($scope.filterDef && typeof $scope.filterDef === 'function') {
                    $scope.params = {};
                    $scope.noOfCategoriesSelected = 0;
                    $scope.selectedCategoriesList = [];
                    $scope.showCategoryClearMessage = false;
                    for (var i = 0; i < $scope.categories.length; i++) {
                        $scope.categories[i].selected = false;
                    }
                    $scope.filterDef($scope.params, ['category', 'bookmark', 'requesterFilter']);
                }
            };

            $scope.clearOwnersFilter = function(){
                if ($scope.filterDef && typeof $scope.filterDef === 'function') {
                    $scope.params = {};
                    $scope.noOfOwnersSelected = 0;
                    $scope.selectedOwnersList = [];
                    $scope.showOwnerClearMessage = false;
                    for (var i = 0; i < $scope.owners.length; i++) {
                        $scope.owners[i].selected = false;
                    }
                    $scope.filterDef($scope.params, ['owner', 'bookmark', 'requesterFilter']);
                }
            };

            $scope.clearTagsFilter = function(){
                if ($scope.filterDef && typeof $scope.filterDef === 'function') {
                    $scope.params = {};
                    $scope.noOfTagsSelected = 0;
                    $scope.selectedTagsList = [];
                    $scope.showTagClearMessage = false;
                    for (var i = 0; i < $scope.tags.length; i++) {
                        $scope.tags[i].selected = false;
                    }
                    $scope.filterDef($scope.params, ['tag', 'bookmark', 'requesterFilter']);
                }
            };
        }
    ]);
});

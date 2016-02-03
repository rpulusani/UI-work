define(['angular', 'library', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .controller('LibraryListController', ['$scope', '$location', '$translate', '$route', '$http', 'Documents', 'grid', '$rootScope', 'PersonalizationServiceFactory', 'FormatterService', 'SecurityHelper',
        function($scope, $location, $translate, $route, $http, Documents, GridService, $rootScope, Personalize, formatter, SecurityHelper) {

            $scope.query = '';

            new SecurityHelper($rootScope).redirectCheck($rootScope.documentLibraryAccess);
            var personal = new Personalize($location.url(), $rootScope.idpUser.id);

            var Grid = new GridService();
            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Documents, personal);

            $scope.buildGrid = function() {

                Documents.getPage().then(function() {
                    Grid.display(Documents, $scope, personal, 180);

                }, function(reason) {
                    NREUM.noticeError('Grid Load Failed for ' + Documents.serviceName +  ' reason: ' + reason);
                });

            };

            $scope.buildGrid();

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

            $scope.getFileOwner = function(owner) {
                return formatter.getFileOwnerForLibrary(owner, $rootScope.idpUser.email);
            };

            $scope.getFileIcon = function(extension) {
                var icon = 'icon ';

                switch (extension) {
                    case 'pdf':
                        icon += 'icon-mps-pdf_document';
                        break;
                    default:
                        icon += '';
                }

                return icon;
            };

            $scope.getStrategicIcon = function(strategic) {
                var icon = 'icon ';

                if (strategic === true) {
                    icon += 'icon-mps-strategic';
                }

                return icon;
            };

            $scope.getEditDeleteAction = function (owner) {
                return (owner === $rootScope.idpUser.email ? true : false);
            };

            $scope.goToNew = function() {
                Documents.item = {};
                $location.path(Documents.route + '/new');
            };

            $scope.goToQuery = function() {
                Documents.params['search'] = $scope.query;
                Documents.params['category'] = $scope.getListOfSelectedItems($scope.categories);
                Documents.params['owner'] =  $scope.getListOfSelectedItems($scope.owners);
                Documents.params['tag'] =  $scope.getListOfSelectedItems($scope.tags);
                
                $scope.buildGrid();
            };

            $scope.getListOfSelectedItems = function(inArr) {
                var retval = [];

                angular.forEach(inArr, function(value, key) {
                    if (value.selected === true) {
                        retval.push(value.name);
                    }
                });

                return retval.join(",");
            };

            $scope.goToResetQuery = function() {
                $scope.query = '';
                $scope.goToClearSelectionCheckboxes($scope.categories);
                $scope.goToClearSelectionCheckboxes($scope.owners);
                $scope.goToClearSelectionCheckboxes($scope.tags);

                delete Documents.params['search'];
                delete Documents.params['category'];
                delete Documents.params['owner'];
                delete Documents.params['tag'];

                $scope.buildGrid();
            };

            $scope.goToClearSelectionCheckboxes = function(inArr) {
                angular.forEach(inArr, function(value, key) {
                    value.selected = false;
                });
            };

            $scope.clearTag = function(tag) {
                angular.forEach($scope.tags, function(value, key) {
                    if (value.name === tag.name) {
                        value.selected = false;
                    }
                });
            };

            $scope.goToView = function(documentItem) {
                var selfHrefArr = documentItem._links.self.href.split('/');
                var documentId = selfHrefArr.pop();

                documentItem.id = documentId;
                Documents.setItem(documentItem);

                $location.path(Documents.route + '/' + documentItem.id + '/view');
            };

            $scope.goToUpdate = function(documentItem) {
                var selfHrefArr = documentItem._links.self.href.split('/');
                var documentId = selfHrefArr.pop();

                documentItem.id = documentId;
                Documents.setItem(documentItem);

                $location.path(Documents.route + '/' + documentItem.id + '/update');
            };

            $scope.goToDelete = function(documentItem) {
                Documents.setItem(documentItem);

                $http({
                    method: 'DELETE',
                    url: Documents.item.url
                }).then(function successCallback(response) {
                    $route.reload();
                }, function errorCallback(response) {
                    NREUM.noticeError('Failed to DELETE existing document library file: ' + response.statusText);
                });
            };

        }
    ]);
});

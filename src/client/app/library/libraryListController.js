angular.module('mps.library')
.controller('LibraryListController', ['$scope', '$location', '$translate', '$route', '$http', 'Documents', 'grid', '$rootScope', 'PersonalizationServiceFactory', 'FormatterService', 'FilterSearchService', 'SecurityHelper',
    function($scope, $location, $translate, $route, $http, Documents, Grid, $rootScope, Personalize, formatter, FilterSearchService, SecurityHelper) {
        $rootScope.currentRowList = [];
        $scope.visibleColumns = [];

        new SecurityHelper($rootScope).redirectCheck($rootScope.documentLibraryAccess);
        var personal = new Personalize($location.url(), $rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(Documents, $scope, $rootScope, personal, $scope.columnSet, 160);

        Documents.columns = Documents.columnDefs.defaultSet;

        $scope.gridOptions.showBookmarkColumn = false;
        var removeParamsList = ['bookmarkFilter', 'category', 'owner', 'tag'];

        filterSearchService.addBasicFilter('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_ALL_DOCS', false, removeParamsList,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }, 500);
            }
        );
        filterSearchService.addPanelFilter('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_FILTERS', 'LibraryFilter', undefined,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }, 500);
            }
        );

        if ($rootScope.documentLibraryManageGlobalTagAccess) {
            filterSearchService.addPanelFilter('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_FILTER_ACCOUNT', 'AccountAllFilter', undefined,
                function(Grid) {
                    setTimeout(function() {
                        $scope.$broadcast('setupColumnPicker', Grid);
                    }, 500);
                }
            );
        }

        $scope.isUnpublished = function(documentItem) {
            if (documentItem.endDate === undefined || documentItem.endDate === null) { return; }

            var dateNow = formatter.getDisplayDate(new Date());
            var docEndDate = formatter.getDisplayDate(new Date(documentItem.endDate));

            if (dateNow >= docEndDate) {
                return '(' + $translate.instant('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_GRID_UNPUBLISHED') + ')';
            }
        };

        $scope.getFileOwner = function(owner) {
            return formatter.getFileOwnerForLibrary(owner, $rootScope.idpUser.email);
        };

        $scope.getFileIcon = function(extension) {
            var icon = 'icon-16 ';

            switch (extension) {
                case 'doc':
                case 'docx':
                case 'pdf':
                case 'xls':
                case 'xlsx':
                case 'csv':
                    icon += 'icon-mps-' + extension;
                    break;
                default:
                    icon += 'icon-mps-other';
            }

            return icon;
        };

        $scope.getStrategicIcon = function(strategic) {
            var icon = 'icon-16 ';

            if (strategic === true) {
                icon += 'icon-mps-strategic';
            }

            return icon;
        };

        $scope.getTagNames = function(tags) {
            var localized = [];
            if (tags) {
                for (var i = 0; i < tags.length; i++) {
                    localized.push(Documents.getTranslationValueFromTag(tags[i]));
                }
            }
            return localized.join(', ');
        };

        $scope.getEditAction = function (owner) {
            var showBtn = false;

            if (owner === $rootScope.idpUser.email && $rootScope.documentLibraryEditMyAccess) {
                showBtn = true;
            }

            if ($rootScope.documentLibraryEditAllAccess) {
                showBtn = true;
            }

            return showBtn;
        };

        $scope.getDeleteAction = function (owner) {
            var showBtn = false;

            if (owner === $rootScope.idpUser.email && $rootScope.documentLibraryDeleteMyAccess) {
                showBtn = true;
            }

            if ($rootScope.documentLibraryDeleteAllAccess) {
                showBtn = true;
            }

            return showBtn;
        };

        $scope.goToNew = function() {
            Documents.item = {};
            $location.path(Documents.route + '/new');
        };

        $scope.goToManageTags = function() {
            $location.path(Documents.route + '/tags');
        };

        $scope.goToView = function(documentItem) {
            Documents.setItem(documentItem);

            $location.path(Documents.route + '/' + documentItem.id + '/view');
        };

        $scope.goToUpdate = function(documentItem) {
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


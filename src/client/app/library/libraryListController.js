angular.module('mps.library')
.controller('LibraryListController', ['$scope', '$location', '$translate', '$route', '$routeParams', '$http', 'Documents', 'grid', '$rootScope', 'PersonalizationServiceFactory', 'FormatterService', 'FilterSearchService', 'SecurityHelper',
    function($scope, $location, $translate, $route, $routeParams, $http, Documents, GridService, $rootScope, Personalize, formatter, FilterSearchService, SecurityHelper) {
        $translate.refresh();
        $rootScope.currentRowList = [];
        $scope.visibleColumns = [];
        if(!$rootScope.documentLibraryAccess){
            new SecurityHelper($rootScope).confirmPermissionCheck("documentLibraryAccess");    
        }
        if($routeParams.status && $routeParams.fileName && $routeParams.status === "addSuccess"){
            $scope.addSuccess = true;
            $scope.phDocumentName = $routeParams.fileName;
        }

        var personal = new Personalize($location.url(), $rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(Documents, $scope, $rootScope, personal, $scope.columnSet, 160);

        Documents.columns = Documents.columnDefs.defaultSet;
        Documents.preventPersonalization = false;

        $scope.deleteSuccess = false;
        Documents.setParamsToNull();
        if (Documents.item) {   
        $('.site-content').scrollTop(0,0);  
            if (Documents.isDeleted) {
                $scope.deleteSuccess = true;
                Documents.isDeleted = false;
            }
        }

        $scope.gridOptions.showBookmarkColumn = false;
        var removeParamsList = ['bookmarkFilter', 'category', 'owner', 'tag'];

        filterSearchService.addBasicFilter('DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_ALL_DOCS', false, removeParamsList,
            function(Grid) {
                setTimeout(function() {
                    $scope.$broadcast('setupColumnPicker', Grid);
                }, 500);
                
                $scope.$broadcast('setupPrintAndExport', $scope);
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

            var dateNow = new Date();
            var docEndDate = new Date(documentItem.endDate);

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

        $scope.goToView = function(id) {
            var options = {
                preventDefaultParams: true,
                url: Documents.url + '/' + id
            };

            Documents.get(options).then(function(res) {
                Documents.setItem(res.data);
                $location.path(Documents.route + '/' + id + '/view');
            });
        };

        $scope.goToUpdate = function(id) {
            var options = {
                preventDefaultParams: true,
                url: Documents.url + '/' + id
            };

            Documents.get(options).then(function(res) {
                Documents.setItem(res.data);
                $location.path(Documents.route + '/' + id + '/update');
            });
        };

        $scope.goToDelete = function(documentItem) {
            Documents.setItem(documentItem);
            Documents.isDeleted = false;

            $http({
                method: 'DELETE',
                url: Documents.item.url
            }).then(function successCallback(response) {
                Documents.isDeleted = true;
                $route.reload();
            }, function errorCallback(response) {
                NREUM.noticeError('Failed to DELETE existing document library file: ' + response.statusText);
            });
        };

    }
]);


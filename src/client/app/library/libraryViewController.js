angular.module('mps.library')
.controller('LibraryViewController', ['$scope', '$location', '$translate', '$http', '$sce', 'Documents', '$rootScope', 'FormatterService',
    function($scope, $location, $translate, $http, $sce, Documents, $rootScope, formatter) {

        if (Documents.item === null) {
            $location.path(Documents.route);
        } else {
            $scope.documentItem = Documents.item;

            if ($scope.documentItem.ext === 'pdf') {
                $http({
                    method: 'GET',
                    url: $scope.documentItem.download.url,
                    responseType:'arraybuffer'
                }).then(function successCallback(response) {
                    var file = new Blob([response.data], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);
                    $scope.pdfSource = $sce.trustAsResourceUrl(fileURL);
                }, function errorCallback(response) {
                    NREUM.noticeError('Failed to LOAD existing document library file: ' + response.statusText);
                });
            }
        }

        $scope.isDeleting = false;

        $scope.getTagNames = function(tags) {
            var localized = [];
            if (tags) {
                for (var i = 0; i < tags.length; i++) {
                    localized.push(Documents.getTranslationValueFromTag(tags[i]));
                }
            }
            return localized.join(', ');
        };

        $scope.getFileSize = function(size) {
            var calculatedSize = formatter.getFileSize(size);
            return calculatedSize;
        };

        $scope.getFormatDate = function(date) {
            if (date === undefined || date === null) { return; }

            var dy = date +'Z';
            var d = new Date(dy);

            return formatter.getDisplayDate(d);
        };

        $scope.getFileOwner = function(owner) {
            return formatter.getFileOwnerForLibrary(owner, $rootScope.idpUser.email);
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

        $scope.goToDelete = function() {
            Documents.isDeleted = false;
            $http({
                method: 'DELETE',
                url: $scope.documentItem.url
            }).then(function successCallback(response) {
                Documents.isDeleted = true;
                $location.path(Documents.route);
            }, function errorCallback(response) {
                NREUM.noticeError('Failed to DELETE existing document library file: ' + response.statusText);
            });
        };

        $scope.goToDownload = function(documentItem) {
            var pdfName = documentItem.name + '.' + documentItem.ext;
            var a = document.createElement("a");
            document.body.appendChild(a);

            $http({
                method: 'GET',
                url: documentItem.download.url,
                responseType:'arraybuffer'
            }).then(function successCallback(response) {
                var pdf = new Blob([response.data], {type: documentItem.mimetype });
                var pdfUrl = URL.createObjectURL(pdf);
                a.href = pdfUrl;
                a.download = pdfName;
                a.click();
            }, function errorCallback(response) {
                NREUM.noticeError('Failed to DOWNLOAD existing document library file: ' + response.statusText);
            });
        };
        $scope.breadcrumbs = {
            1:{
                href:'/library',
                value:'DOCUMENT_LIBRARY.DOCUMENT_LISTING.TXT_LIBRARY'
            },
            2:{
                value: $scope.documentItem.name
            }
        }
    }
]);


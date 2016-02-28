

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
            if (tags) {
                return tags.join(', ');
            }
        };

        $scope.getFileSize = function(size) {
            var calculatedSize = formatter.getFileSize(size);
            return calculatedSize;
        };

        $scope.getFormatDate = function(date) {
            return formatter.formatDate(date);
        };

        $scope.getFileOwner = function(owner) {
            return formatter.getFileOwnerForLibrary(owner, $rootScope.idpUser.email);
        };

        $scope.goToUpdate = function(documentItem) {
            Documents.setItem(documentItem);

            $location.path(Documents.route + '/' + $scope.documentItem.id + '/update');
        };

        $scope.goToDocumentView = function(documentItem) {
            Documents.setItem(documentItem);

            $location.path(Documents.route + '/' + $scope.documentItem.id + '/view');
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

            if (owner === $rootScope.idpUser.email) {
                showBtn = true;
            }
            if ($rootScope.currentUser.type === 'INTERNAL') {
                showBtn = true;
            }

            return showBtn;
        };

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
    }
]);


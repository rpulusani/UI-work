define(['angular', 'library'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .controller('LibraryListController', ['$scope', '$location', '$translate', 'Documents', 'grid', '$rootScope', 'PersonalizationServiceFactory',
        function($scope, $location, $translate, Documents, Grid, $rootScope, Personalize) {

            var personal = new Personalize($location.url(),$rootScope.idpUser.id);

            $scope.gridOptions = {};
            $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Documents, personal);

            Documents.getPage().then(function() {
console.log(Documents);
                Grid.display(Documents, $scope, personal);

            }, function(reason) {
                NREUM.noticeError('Grid Load Failed for ' + Documents.serviceName +  ' reason: ' + reason);
            });

            $scope.addNewDocument = function() {
                $location.path(Documents.route + '/add');
            };

            $scope.goToView = function(documentItem) {
                documentItem.id = '1-ABCDEF';
                Documents.setItem(documentItem);

                $location.path(Documents.route + '/' + documentItem.id + '/view');
            };
        }
    ]);
});

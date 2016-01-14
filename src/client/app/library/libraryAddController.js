define(['angular', 'library'], function(angular) {
    'use strict';
    angular.module('mps.library')
    .controller('LibraryAddController', ['$scope', '$location', '$translate', 'Documents', 'grid', '$rootScope', 'PersonalizationServiceFactory',
        function($scope, $location, $translate, Documents, Grid, $rootScope, Personalize) {

            function configureTemplates() {
                $scope.configure = {
                    header: {
                        translate: {
                            h1: 'DOCUMENT_LIBRARY.UPLOAD_FILE',
                            body: 'MESSAGE.LIPSUM'
                        }
                    }
                };
            }

            configureTemplates();


        }
    ]);
});

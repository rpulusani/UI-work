define(['angular', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .controller('PrintExportTitleController', ['$scope', '$element', '$attrs', '$translate', 'uiGridExporterConstants',
        function($scope, element, attrs, $translate, uiGridExporterConstants) {
            $scope.title = attrs.title;
            

            $scope.displayPrint = true;
            $scope.displayExport = true;

            if (attrs.print && attrs.print === false) {
                $scope.displayPrint = false;
            }

            if (attrs.export && attrs.export === false) {
                $scope.displayExport = false;
            }

            $scope.$on('setupPrintAndExport', function(e, ctrlScope) {
                if(!$scope.titleValues){
                    $scope.titleValues = {
                        total: ctrlScope.pagination.totalItems()
                    };
                }


                $scope.printGrid = function() {
                    ctrlScope.gridApi.exporter.pdfExport(uiGridExporterConstants.ALL, uiGridExporterConstants.ALL);
                };

                $scope.exportGrid = function() {
                    var myElement = angular.element(document.querySelectorAll('.custom-csv-link-location'));

                    ctrlScope.gridApi.exporter.csvExport(uiGridExporterConstants.ALL, uiGridExporterConstants.ALL, myElement);
                };
            });
        }
    ]);
});

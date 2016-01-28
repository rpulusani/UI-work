define(['angular', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .controller('PrintExportTitleController', ['$scope', '$element', '$attrs', '$translate', 'uiGridExporterConstants',
        function($scope, element, attrs, $translate, uiGridExporterConstants) {
            $scope.title = attrs.title;

            $scope.$on('setupPrintAndExport', function(e, ctrlScope) {
                $scope.itemtotal = ctrlScope.pagination.totalItems();

                if ($scope.itemtotal >= 0) {
                    $scope.displayTitle = true;
                    
                    if (attrs.print === undefined || attrs.print === true) {
                        $scope.displayPrint = true;
                    } else {
                        $scope.displayPrint = false;
                    }

                    if (attrs.export === undefined || attrs.export === true) {
                        $scope.displayExport = true;
                    } else {
                        $scope.displayExport = false;
                    }
                } else {
                    $scope.displayTitle = false;
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

angular.module('mps.utility')
.controller('PrintExportTitleController', ['$scope', '$element', '$attrs', '$translate', 'uiGridExporterConstants',
    function($scope, element, attrs, $translate, uiGridExporterConstants) {
        $scope.titlestring = $scope.titlestring;

        $scope.displayPrint = true;
        $scope.displayExport = true;

        if (attrs.print && $scope.print === false) {
            $scope.displayPrint = false;
        }

        if (attrs.export && $scope.export === false) {
            $scope.displayExport = false;
        }

        if (!attrs.titleCount) {
            attrs.titleCount = true;
        }

        if (!$scope.nativePrint) {
            $scope.nativePrint = false;
        } else {
            $scope.nativePrint = true;
        }

        $scope.$on('setupPrintAndExport', function(e, ctrlScope) {
            if($scope.titlestring && attrs.titleCount !== false) {
                $scope.titleValues = {
                    total: Math.max(0, ctrlScope.pagination.totalItems())
                };
            }

            ctrlScope.$watch('pagination', function(page) {
               $scope.titleValues = {
                    total: Math.max(0, page.totalItems())
                };
            });

            $scope.printGrid = function() {
                ctrlScope.printing = true;
                ctrlScope.gridApi.exporter.pdfExport(uiGridExporterConstants.ALL, uiGridExporterConstants.ALL);
            };

            $scope.exportGrid = function() {
                var myElement = angular.element(document.querySelectorAll('.custom-csv-link-location'));
                var api;

               ctrlScope.printing = false;

                if(!ctrlScope.gridApi){
                    api = ctrlScope.$root.gridApi;
                }else{
                    api = ctrlScope.gridApi;
                }
                api.exporter.csvExport(uiGridExporterConstants.ALL, uiGridExporterConstants.ALL, myElement);
            };
        });
    }
]);

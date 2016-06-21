angular.module('mps.utility')
.controller('PrintExportTitleController', ['$scope', '$element', '$attrs', '$translate', 'uiGridExporterConstants',
    function($scope, element, attrs, $translate, uiGridExporterConstants) {
        // consider attacking this to rootscope
        var createCsv = function(dataObj) {
            var filename = 'download.csv',
            csvFile,
            blob,
            url,
            link,
            prop,
            rowProp,
            headers = [],
            rows = [],
            i = 0;

            if (dataObj.filename) {
                filename = dataObj.filename;
            }

            if (dataObj.headers) {
                headers = dataObj.headers;
            } else if (!dataObj.headers && dataObj.data) {
                for (prop in dataObj.data) {
                    headers.push(prop)
                }
            }

            if (dataObj.rows) {
                rows = dataObj.rows;
            } else if (!dataObj.rows && dataObj.data) {
                for (rowProp in dataObj.data) {
                    rows.push(dataObj.data[rowProp]);
                }
            } 

            if (filename.indexOf('.csv') === -1) {
                filename += '.csv';
            }

            csvFile = headers.toString();
            csvFile += '\r\n';

            for (i; i < rows.length; i += 1) {
                if (i !== rows.length - 1) {
                    csvFile += '"' + rows[i] + '",';
                } else if (i = rows.length - 1) {
                    csvFile += '"' + rows[i] + '"';
                }
            }

            blob = new Blob(["\uFEFF", csvFile], {type: 'text/csv; charset=UTF-8'});
            
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(blob, filename);
            } else {
                link = document.createElement('a');

                if (link.download !== undefined) {
                    url = URL.createObjectURL(blob);

                    link.setAttribute('href', url);
                    link.setAttribute('download', filename);
                    link.style.visibility = 'hidden';

                    document.body.appendChild(link);

                    link.click();

                    document.body.removeChild(link);
                }
            }
        },
        createPdf = function(pdfDefinition) {
            pdfMake.createPdf(pdfDefinition).download('download.pdf');
        };

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

        if ($scope.csvExport) {
            $scope.exportGrid = function() {
                createCsv($scope.csvExport);
            };
        }

        if ($scope.pdfExport) {
            $scope.printGrid = function() {
                createPdf($scope.pdfExport);
            };
        }

        $scope.$on('setupPrintAndExport', function(e, ctrlScope) {
            if ($scope.titlestring && attrs.titleCount !== false && ctrlScope.pagination) {
                $scope.titleValues = {
                    total: Math.max(0, ctrlScope.pagination.totalItems())
                };
            }

            ctrlScope.$watch('pagination', function(page) {
                if (page) {
                    $scope.titleValues = {
                        total: Math.max(0, page.totalItems())
                    };
                }
            });

            if (!$scope.pdfExport) {
                $scope.printGrid = function() {
                    var api;

                    ctrlScope.printing = true;


                    if (!ctrlScope.gridApi) {
                        api = ctrlScope.$root.gridApi;
                    } else {
                        api = ctrlScope.gridApi;
                    }

                    api.exporter.pdfExport(uiGridExporterConstants.ALL, uiGridExporterConstants.VISIBLE);
                };
            }

            if (!$scope.csvExport) {
                $scope.exportGrid = function() {
                    var myElement = angular.element(document.querySelectorAll('.custom-csv-link-location')),
                    api;

                    ctrlScope.printing = false;

                    if (!ctrlScope.gridApi) {
                        api = ctrlScope.$root.gridApi;
                    } else {
                        api = ctrlScope.gridApi;
                    }

                    api.exporter.csvExport(uiGridExporterConstants.ALL, uiGridExporterConstants.VISIBLE, myElement);
                };
            }
        });
    }
]);

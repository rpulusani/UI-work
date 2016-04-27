angular.module('mps.utility')
.controller('PrintExportTitleController', ['$scope', '$element', '$attrs', '$translate', 'uiGridExporterConstants',
    function($scope, element, attrs, $translate, uiGridExporterConstants) {
        // consider attacking this to rootscope
        var createCsv = function(dataObj) {
            console.log('here', dataObj);

            var filename = 'download.csv',
            csvFile,
            blob,
            url,
            link,
            prop,
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
                for (prop in dataObj.data) {
                    rows.push(dataObj[prop]);
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

            console.log(csvFile);

            blob = new Blob([csvFile], {type: 'text/csv;charset=utf-8;'});
            
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
            pdfMake.createPdf(pdfDefinition).open();
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
                    ctrlScope.printing = true;
                    ctrlScope.gridApi.exporter.pdfExport(uiGridExporterConstants.ALL, uiGridExporterConstants.ALL);
                };
            } else {
                $scope.printGrid = function() {
                    createPdf(scope.pdfExport)
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

                    api.exporter.csvExport(uiGridExporterConstants.ALL, uiGridExporterConstants.ALL, myElement);
                };
            } else {
                console.log('setting this up');

                $scope.exportGrid = function() {
                    createCsv($scope.csvExport);
                };
            }
        });
    }
]);

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

            console.log('Directive Attrs', attrs)
            console.log('Directive Scope', $scope)
            console.log('Controller Scope', ctrlScope);
/*
            ctrlScope.exportDevice = function (filename, rows) {
                console.log('In directive controller, exportDevice/2');

                var filename = $scope.device.productModel + '.csv',
                rows = [],
                csvFile = '',
                blob,
                url,
                link,
                i = 0,
                headers = [];

                if ($scope.device.productModel) {
                    rows.push($scope.device.productMode);
                }
               
                if ($scope.device.serialNumber) {
                    rows.push($scope.device.serialNumber);
                }

                if ($scope.device.assetTag) {
                    rows.push($scope.device.assetTag);
                }

                if ($scope.device.ipAddress) {
                    rows.push($scope.device.ipAddress);
                }

                if ($scope.device.hostname) {
                    rows.push($scope.device.hostname);
                }

                if ($scope.device.costCenter) {
                    rows.push($scope.device.costCenter);
                }

                if ($scope.device.installDate) {
                    rows.push($scope.device.installDate);
                }

                if ($scope.device.contact.item.formattedName) {
                    rows.push($scope.device.contact.item.formattedName);
                }

                if ($scope.device.contact.item.email) {
                    rows.push($scope.device.contact.item.email);
                }

                if ($scope.device.contact.item.workPhone) {
                    rows.push($scope.device.contact.item.workPhone);
                }

                if ($scope.device.contact.item.formattedName) {
                    rows.push($scope.device.contact.item.formattedName);
                }
                  
                if ($scope.device.contact.item.address 
                    && $scope.device.contact.item.address.addressLine1) {
                    rows.push($scope.device.contact.item.address.addressLine1);
                }
                
                csvFile = headers.toString();
                csvFile += '\r\n';

                for (i = 0; i < rows.length; i += 1) {
                    if (i !== rows.length - 1) {
                        csvFile += '"' + rows[i] + '",';
                    } else if (i = rows.length - 1) {
                         csvFile += '"' + rows[i] + '"';
                    }
                }
                
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
            };
*/
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

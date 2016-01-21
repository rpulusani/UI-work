/*
    Controller for Grid headers with print / export links.
*/
define(['angular', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .controller('PrintExportTitleController', ['$scope', '$element', '$attrs', '$translate',
        function($scope, element, attrs, $translate) {
            var node = element[0],
            $ = require('jquery');

            $scope.print = function() {
                alert(2);
                $scope.gridApi.exporter.pdfExport( uiGridExporterConstants.ALL, uiGridExporterConstants.ALL );
            };

            $scope.export = function() {
                var myElement = angular.element(document.querySelectorAll('.custom-csv-link-location'));
                $scope.gridApi.exporter.csvExport( uiGridExporterConstants.ALL, uiGridExporterConstants.ALL, myElement );
            };

            $scope.title = attrs.title;

            if (attrs.itemtotal) {
                $scope.itemtotal = attrs.itemtotal;
            }
            
            var interval = setInterval(function() {
                attrs.itemtotal = parseInt(attrs.itemtotal);

                if (angular.isNumber(attrs.itemtotal) && attrs.itemtotal >= 0 ) {
                    clearInterval(interval);
                    $scope.itemtotal = attrs.itemtotal;
                }
            }, 500);

        }
    ]);
});

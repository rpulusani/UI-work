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
            
            console.log($scope.itemtotal);
            console.log(attrs);

            $scope.$apply();
        }
    ]);
});

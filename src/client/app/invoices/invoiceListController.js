define(['angular', 'invoice', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.invoice')
    .controller('InvoiceListController', ['$scope', '$window', '$location', 'grid', 'Invoices', 'imageNowSecret', 
        'imageNowUrl', '$rootScope','PersonalizationServiceFactory', 'FormatterService', 'FilterSearchService',
        function($scope, $window, $location, Grid, Invoices, imageNowSecret, imageNowUrl, $rootScope, 
            Personalize, formatter, FilterSearchService) {
            $scope.url = '';
            $scope.redirectToInvoiceUrl = function(sapDocId) {
                var key = CryptoJS.SHA256(imageNowSecret),
                    ts = new Date().toISOString(), 
                    url, hash, hashInBase64;
                url = imageNowUrl + sapDocId + '?ts='+encodeURIComponent(ts);
                hash = CryptoJS.HmacSHA256(url, key);
                hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
                url = url + '&token=' + hashInBase64;
                $window.open(url);
            };

            $scope.visibleColumns = [];
            $scope.columnSet = undefined;
            var personal = new Personalize($location.url(), $rootScope.idpUser.id),
            configureParams = undefined,
            removeParamsList = ['accountId','accountLevel'],
            filterSearchService = new FilterSearchService(Invoices, $scope, $rootScope, personal, $scope.columnSet, 70);

            $scope.getFormattedInvoiceNo = function(invoiceNumber) {
                var formattedInvoiceNo = invoiceNumber + ' (PDF)';
                return formattedInvoiceNo;
            }

            $scope.getBillToAddress = function(address) {
                return formatter.formatAddress(address);
            }

            if ($scope.status) {
                configureParams = [];
                configureParams['status'] = $scope.status;
            } else {
                removeParamsList.push('status');
            }

            Invoices.params.size = 100000;
            
            filterSearchService.addBasicFilter('INVOICE.ALL_INVOICES', configureParams, removeParamsList, function() {
                $scope.$broadcast('setupPrintAndExport', $scope);
            });
            filterSearchService.addPanelFilter('FILTERS.FILTER_BY_DATE', 'InvoiceDateFilter', undefined,
                function() {
                    $scope.$broadcast('setupPrintAndExport', $scope);
                }
            );
        }
    ]);
});

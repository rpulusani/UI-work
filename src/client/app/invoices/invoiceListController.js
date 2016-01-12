define(['angular', 'invoice', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.invoice')
    .controller('InvoiceListController', ['$scope', '$window', '$location', 'grid', 'Invoices', 'imageNowSecret', 
        'imageNowUrl', '$rootScope','PersonalizationServiceFactory', 'FilterSearchService',
        function($scope, $window, $location, Grid, Invoices, imageNowSecret, imageNowUrl, $rootScope, Personalize, FilterSearchService) {
            $scope.url = '';
            $scope.redirectToInvoiceUrl = function(sapDocId) {
                var key = CryptoJS.SHA256(imageNowSecret),
                    ts = new Date().toISOString(), 
                    url, hash, hashInBase64;
                url = imageNowUrl + sapDocId + '?ts='+encodeURIComponent(ts);
                hash = CryptoJS.HmacSHA256(url, key);
                hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
                url = url + '&token=' + hashInBase64;
                console.log(url);
                $window.open(url);
            };

            $scope.visibleColumns = [];
            $scope.columnSet = undefined;
            var personal = new Personalize($location.url(), $rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(Invoices, $scope, $rootScope, personal, $scope.columnSet, 60);

            $scope.getFormattedInvoiceNo = function(invoiceNumber) {
                var formattedInvoiceNo = invoiceNumber + ' (PDF)';
                return formattedInvoiceNo;
            }

            filterSearchService.addBasicFilter('INVOICE.ALL_INVOICES');
            // $scope.gridOptions = {};
            // $scope.gridOptions.rowHeight = 60;
            // $scope.gridOptions.onRegisterApi = Grid.getGridActions($rootScope, Invoices, personal);
            // Grid.display(Invoices, $scope, personal);
        }
    ]);
});

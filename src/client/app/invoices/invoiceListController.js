define(['angular', 'invoice', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.invoice')
    .controller('InvoiceListController', ['$scope', '$window', '$location', 'grid', 'Invoices', '$rootScope',
        'PersonalizationServiceFactory', 'FormatterService', 'FilterSearchService', '$http',
        function($scope, $window, $location, Grid, Invoices, $rootScope, 
            Personalize, formatter, FilterSearchService, $http) {
            $scope.url = '';
            $scope.redirectToInvoiceUrl = function(sapDocId) {
                $http.get(Invoices.url + "/invoice-url/" + sapDocId).success(function(data){
                    $window.open(data);
                });
            };  

            $scope.visibleColumns = [];
            $scope.columnSet = undefined;
            var personal = new Personalize($location.url(), $rootScope.idpUser.id),
            configureParams = [],
            removeParamsList = ['preventDefaultParams', 'fromDate', 'toDate', 'soldToNumber', 'accountId'],
            filterSearchService = new FilterSearchService(Invoices, $scope, $rootScope, personal, $scope.columnSet, 70);

            $scope.getFormattedInvoiceNo = function(invoiceNumber) {
                var formattedInvoiceNo = invoiceNumber + ' (PDF)';
                return formattedInvoiceNo;
            }

            $scope.getBillToAddress = function(address) {
                return formatter.formatAddress(address);
            }
            if ($scope.status) {
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
            filterSearchService.addPanelFilter('FILTERS.FILTER_BY_ACCOUNT', 'AccountFilter', undefined,
                function() {
                    $scope.$broadcast('setupPrintAndExport', $scope);
                }
            );
            filterSearchService.addPanelFilter('FILTERS.FILTER_BY_SOLD_TO', 'SoldToFilter', undefined,
                function() {
                    $scope.$broadcast('setupPrintAndExport', $scope);
                }
            );
        }
    ]);
});

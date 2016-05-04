

angular.module('mps.invoice')
.factory('Invoices', ['serviceUrl', '$translate', '$rootScope', 'FormatterService', 'HATEOASFactory',
    function(serviceUrl, $translate,$rootScope, formatter, HATEOASFactory) {
        var Invoices = {
            serviceName: "invoices",
            url: serviceUrl + 'invoices',
            columns: 'defaultSet',
            columnDefs: {
                defaultSet: [
                    {'name': $translate.instant('INVOICE.INVOICE_DATE'), 'field':'getInvoiceDate()', 'notSearchable': true},
                    {'name': $translate.instant('INVOICE.DUE_DATE'), 'field':'getDueDate()', 'notSearchable': true},
                    {'name': $translate.instant('INVOICE.PAID_DATE'), 'field':'getPaidDate()', 'notSearchable': true},
                    {'name': $translate.instant('INVOICE.INVOICE_NUMBER'), 'field':'invoiceNumber', 'width': '17%',
                     'cellTemplate':'<div><div>' +
                                        '<a href="#" ng-click="grid.appScope.redirectToInvoiceUrl(row.entity.sapDocId1);" ng-bind="grid.appScope.getFormattedInvoiceNo(row.entity.invoiceNumber)"></a>' +
                                    '</div><div>' +
                                        '<a ng-if="row.entity.sapDocId2" href="#" ng-click="grid.appScope.redirectToInvoiceUrl(row.entity.sapDocId2);" translate="INVOICE.DOWNLOAD_AS_TXT"></a>' +
                                    '</div></div>'
                    },
                    {'name': $translate.instant('INVOICE.AMOUNT'), 'field':'getAmount()', 'notSearchable': true},
                    {'name': $translate.instant('INVOICE.ACCOUNT_NAME'), 'field':'accountName', 'notSearchable': true},
                    {'name': $translate.instant('INVOICE.SOLD_TO'), 'field':'soldTo', 'notSearchable': true},
                    {'name': $translate.instant('INVOICE.BILL_TO'), 'field':'getBillToAddress()', 'notSearchable': true,
                     'cellTemplate':'<div ng-bind-html="grid.appScope.getBillToAddress(row.entity.billToAddress)"></div>'
                    }
                ]
            },
            route: '/device_management',
            functionArray: [
                    {
                        name: 'getAmount',
                        functionDef:  function() {
                            return formatter.getAmountWithCurrency(this.amount, this.currencyType);
                        }
                    },
                    {
                        name: 'getInvoiceDate',
                        functionDef:  function() {
                            return formatter.formatDate(this.invoiceDate);
                        }
                    },
                    {
                        name: 'getPaidDate',
                        functionDef:  function() {
                            return formatter.formatDate(this.paidDate);
                        }
                    },
                    {
                        name: 'getDueDate',
                        functionDef:  function() {
                            return formatter.formatDate(this.dueDate);
                        }
                    },
                    {
                        name: 'getBillToAddress',
                        functionDef:  function() {
                            return formatter.formatAddress(this.billToAddress);
                        }
                    }
            ]
        };

        return new HATEOASFactory(Invoices);
    }
]);


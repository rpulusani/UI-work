

angular.module('mps.invoice')
.factory('Invoices', ['serviceUrl', '$translate', '$rootScope', 'FormatterService', 'HATEOASFactory',
    function(serviceUrl, $translate,$rootScope, formatter, HATEOASFactory) {
        var Invoices = {
            serviceName: "invoices",
            url: serviceUrl + 'invoices',
            columns: 'defaultSet',
            hideBookmark: true,
            columnDefs: {
                defaultSet: [
                    {'name': $translate.instant('INVOICE.COMMON.INVOICE_NUMBER'), 'field':'invoiceNumber', 'width': '17%',
                     'cellTemplate':'<div><div>' +
                                        '<a ng-if="row.entity.sapDocId1" href="#" ng-click="row.entity.sapDocId1 && grid.appScope.redirectToInvoiceUrl(row.entity.sapDocId1);" ng-bind="grid.appScope.getFormattedInvoiceNo(row.entity.invoiceNumber)"></a>' +
                                    '</div><div>' +
                                        '<a ng-if="row.entity.sapDocId2" href="#" ng-click="grid.appScope.redirectToInvoiceUrl(row.entity.sapDocId2);" translate="INVOICE.COMMON.DOWNLOAD_AS_TXT"></a>' +
                                    '</div>' + '<div ng-if="!row.entity.sapDocId1 && !row.entity.sapDocId2" ng-bind="row.entity.invoiceNumber">' + '</div></div>'
                    },
                    {'name': $translate.instant('INVOICE.COMMON.INVOICE_DATE'), 'field':'getInvoiceDate()'},
                    {'name': $translate.instant('INVOICE.COMMON.DUE_DATE'), 'field':'getDueDate()'},
                    {'name': $translate.instant('INVOICE.COMMON.PAID_DATE'), 'field':'getPaidDate()'},
                    {'name': $translate.instant('INVOICE.COMMON.TXT_STATUS'), 'field':'status'},
                    {'name': $translate.instant('INVOICE.COMMON.AMOUNT'), 'field':'getAmount()'},
                    {'name': $translate.instant('INVOICE.COMMON.ACCOUNT_NAME'), 'field':'accountName', 'notSearchable': true,'visible':false},
                    {'name': $translate.instant('INVOICE.COMMON.SOLD_TO'), 'field':'soldToNum', 'notSearchable': true,'visible':false},
                    {'name': $translate.instant('INVOICE.COMMON.BILL_TO'), 'field':'getBillToAddress()', 'notSearchable': true,
                     'cellTemplate':'<div ng-bind-html="grid.appScope.getBillToAddress(row.entity.billToAddress)"></div>',
                     'visible':false
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


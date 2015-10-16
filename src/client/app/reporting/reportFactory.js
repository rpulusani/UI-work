define(['angular', 'report', 'utility.gridCustomizationService'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .factory('Report', ['serviceUrl', '$translate', '$http', 'SpringDataRestAdapter',  'gridCustomizationService',
        function(serviceUrl, $translate, $http, SpringDataRestAdapter, gridCustomizationService) {
            var Report = function() {
                var report = this;
                report.categories = [];
                report.groups = [];
                report.reports = [];
                report.category = "";
                report.bindingServiceName = "report";
                report.columns = {
                    'defaultSet': [
                        {'name': $translate.instant('REPORTING.MP9073.TYPE'), 'field': 'type'},
                        {'name': $translate.instant('REPORTING.MP9073.EVENT_DT'), 'field':'eventDate', 'cellFilter': 'date:\'yyyy-MM-dd\''},
                        {'name': $translate.instant('REPORTING.MP9073.MANUFACTURER'), 'field': 'manufacturer'},
                        {'name': $translate.instant('REPORTING.MP9073.DEVICE'), 'field':'device'},
                        {'name': $translate.instant('REPORTING.MP9073.ASSET_TAG'), 'field': 'assetTag'},
                        {'name': $translate.instant('REPORTING.MP9073.ORIG_SN'), 'field':'origSerialNumber'},
                        {'name': $translate.instant('REPORTING.MP9073.NEW_SN'), 'field': 'newSerialNumber'},
                        {'name': $translate.instant('REPORTING.MP9073.OLD_ADDRESS'), 'field': 'oldAddress'},
                        {'name': $translate.instant('REPORTING.MP9073.NEW_ADDRESS'), 'field': 'newAddress'},
                        {'name': $translate.instant('REPORTING.MP9073.GEO'), 'field': 'geo'},
                        {'name': $translate.instant('REPORTING.MP9073.COUNTRY'), 'field': 'country'},
                        {'name': $translate.instant('REPORTING.MP9073.OLD_IP'), 'field': 'oldIp'},
                        {'name': $translate.instant('REPORTING.MP9073.NEW_IP'), 'field': 'newIp'},
                        {'name': $translate.instant('REPORTING.MP9073.OLD_CHL'), 'field': 'oldChl'},
                        {'name': $translate.instant('REPORTING.MP9073.NEW_CHL'), 'field': 'newChl'}
                    ],

                   //bookmarkColumn: 'getBookMark()'
                };
                this.templatedUrl = serviceUrl + 'reports/mp9073/1-11JNK1L/?eventDateFrom=2015-01-01&eventDateTo=2015-01-16';
                this.paramNames = ['page', 'sort', 'size', 'accountId', 'eventType', 'eventDateFrom', 'eventDateTo'];
            };

            Report.prototype = gridCustomizationService;

            Report.prototype.query = function(fn) {
                var report = this;
                $http.get('accounts/1/reportGroups').then(function(res) {
                    report.groups = res.data;
                    if (typeof fn === 'function') {
                        return fn(res);
                    }
                })['catch'](function(data) {
                    NREUM.noticeError(data);
                });
            };

            Report.prototype.getCategoryList = function(fn) {
                var report = this;
                $http.get('accounts/1/reportCategories').then(function(res) {
                    report.categories = res.data;

                    if (typeof fn === 'function') {
                        return fn(res);
                    }
                })['catch'](function(data) {
                    NREUM.noticeError(data);
                });
            };

            Report.prototype.getById = function(id, fn) {
                var report = this;

                $http.get('accounts/1/reportCategories/' + id).success(function(res) {
                    report.category = res;

                    return fn();
                }).error(function(data) {
                    NREUM.noticeError(data);
                });
            };

            Report.prototype.getByDefinitionId = function(definitionId, fn) {
                var report = this;

                $http.get('accounts/1/reports/reportlist/' + definitionId).success(function(res) {
                    report.reports = res;

                    return fn();
                }).error(function(data) {
                    NREUM.noticeError(data);
                });
            };

            Report.prototype.save = function(formdata, fn) {
                var report = this;
                $http.post('accounts/1/reports/', formdata, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).success(function(res) {
                    report.reports = res;

                    return fn(res);
                }).error(function(data) {
                    NREUM.noticeError(data);
                });
            };

            Report.prototype.removeById = function(id, fn) {
                var report = this;

                $http['delete']('accounts/1/reports/' + id).success(function(res) {
                    var i = 0,
                    reportCnt = report.reports.length;

                    try {
                        for (i; i < reportCnt; i += 1) {
                            if (report.reports[i].id === id) {
                                report.reports.splice(i, 1);
                            }
                        }
                    } catch (error) {
                        if (error instanceof ReferenceError) {
                            NREUM.noticeError(error);
                        } else if (error instanceof TypeError) {
                            NREUM.noticeError(error);
                        }
                    }

                    if (typeof fn === 'function') {
                        return fn();
                    }
                }).error(function(data) {
                    NREUM.noticeError(data);
                });
            };

            return new Report();
        }
    ]);
});

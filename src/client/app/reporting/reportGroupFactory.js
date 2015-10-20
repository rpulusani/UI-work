define(['angular', 'report'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .factory('ReportGroup', ['serviceUrl', '$translate', '$http',
        function(serviceUrl, $translate, $http) {
            var ReportGroup = function() {
                var self = this;
                self.categories = [];
                self.groups = [];
                self.reports = [];
                self.category = "";
            };

            ReportGroup.prototype.query = function(fn) {
                var self = this;
                $http.get('accounts/1/reportGroups').then(function(res) {
                    self.groups = res.data;
                    if (typeof fn === 'function') {
                        return fn(res);
                    }
                })['catch'](function(data) {
                    NREUM.noticeError(data);
                });
            };

            ReportGroup.prototype.getCategoryList = function(fn) {
                var self = this;
                $http.get('accounts/1/reportCategories').then(function(res) {
                    self.categories = res.data;

                    if (typeof fn === 'function') {
                        return fn(res);
                    }
                })['catch'](function(data) {
                    NREUM.noticeError(data);
                });
            };

            ReportGroup.prototype.getById = function(id, fn) {
                var self = this;

                $http.get('accounts/1/reportCategories/' + id).success(function(res) {
                    self.category = res;

                    return fn();
                }).error(function(data) {
                    NREUM.noticeError(data);
                });
            };

            ReportGroup.prototype.getByDefinitionId = function(definitionId, fn) {
                var self = this;

                $http.get('accounts/1/reports/reportlist/' + definitionId).success(function(res) {
                    self.reports = res;

                    return fn();
                }).error(function(data) {
                    NREUM.noticeError(data);
                });
            };

            ReportGroup.prototype.save = function(formdata, fn) {
                var self = this;
                $http.post('accounts/1/reports/', formdata, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).success(function(res) {
                    self.reports = res;

                    return fn(res);
                }).error(function(data) {
                    NREUM.noticeError(data);
                });
            };

            ReportGroup.prototype.removeById = function(id, fn) {
                var self = this;

                $http['delete']('accounts/1/reports/' + id).success(function(res) {
                    var i = 0,
                    reportCnt = self.reports.length;

                    try {
                        for (i; i < reportCnt; i += 1) {
                            if (self.reports[i].id === id) {
                                self.reports.splice(i, 1);
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

            return new  ReportGroup();
        }
    ]);
});

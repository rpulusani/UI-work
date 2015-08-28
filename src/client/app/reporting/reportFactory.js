'use strict';
angular.module('mps.report').factory('Report', ['$http', function($http) {
    var Report = function() {
        var report = this;
        report.categories = [];
        report.groups = [];
        report.reports = [];
        report.category = "";
    };
    

    Report.prototype.query = function(fn) {
        var report = this;

        $http.get('/accounts/1/reportGroups').then(function(res) {
            report.groups = res.data;

            if (typeof fn === 'function') {
                return fn(res);
            }
        }).catch(function(data) {
            NREUM.noticeError(data);
        });
    };

    Report.prototype.getCategoryList = function(fn) {
        var report = this;

        $http.get('/accounts/1/reportCategories').then(function(res) {
            report.categories = res.data;
            
            if (typeof fn === 'function') {
                return fn(res);
            }
        }).catch(function(data) {
            NREUM.noticeError(data);
        });
    };

    Report.prototype.getById = function(id, fn) {
        var report = this;

        $http.get('/accounts/1/reportCategories/' + id).success(function(res) {
            report.category = res;
            
            return fn();
        }).error(function(data) {
            NREUM.noticeError(data);
        });
    };

    Report.prototype.getByDefinitionId = function(definitionId, fn) {
        var report = this;

        $http.get('/accounts/1/reports/reportlist/' + definitionId).success(function(res) {
            report.reports = res;
            
            return fn();
        }).error(function(data) {
            NREUM.noticeError(data);
        });
    };

    Report.prototype.save = function(formdata, fn) {
        var report = this;
        $http.post('/accounts/1/reports/', formdata, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function(res) {
            report.reports = res;

            return fn(res);
        }).error(function(data) {
            NREUM.noticeError(data);
        });
    }

    Report.prototype.removeById = function(id, fn) {
        var report = this;

        $http.delete('/accounts/1/reports/' + id).success(function(res) {
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
}]);

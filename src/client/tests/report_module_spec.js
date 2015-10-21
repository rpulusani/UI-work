/* global describe it beforeEach inject expect */
define(['angular','angular-mocks', 'report', 'report.reportGroupFactory'], function(angular, mocks, Report, ReportGroup) {
    describe('Report Module', function() {
        var scope,
            httpBackend,
            mockReportCtrl,
            location,
            deferred,
            mockedFactory,
            mockedReportGroupFactory,
            history,
            ctrl;

        beforeEach(module('mps'));

        describe('ReportController', function() {
            beforeEach(inject(function ($rootScope, $httpBackend, $controller, $location, Report, ReportGroup, History, $q){
                scope = $rootScope.$new();
                deferred = $q.defer();
                httpBackend = $httpBackend;
                location = $location;
                history = History;
                mockedFactory = Report;
                mockedReportGroupFactory = ReportGroup;

                ctrl = $controller('ReportController', {$scope: scope});
            }));

            describe('at init', function() {
                describe('when routeParam.definitionId is available', function() {
                    beforeEach(inject(function($routeParams, $controller){
                        $routeParams.definitionId = '123';
                        ctrl = $controller('ReportController', {$scope: scope});
                    }));
                });
            });

            describe('goToReportByCategory', function() {
                it('should take to the report list view page based on report category', function() {
                    var definitionId = '123';
                    spyOn(location, 'path').and.returnValue('/');
                    scope.goToReportByCategory(definitionId);
                    expect(location.path).toHaveBeenCalledWith('/reporting/123/view');
                });
            });

            describe('goToRun', function() {
                it('should set toRunReport to true', function() {
                    scope.goToRun();
                    expect(scope.toRunReport).toBe(true);
                });
            });

            describe('runReport', function() {
                it('should redirect to report view', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    var reportParams = {};
                    scope.runReport(reportParams);
                    expect(location.path).toHaveBeenCalledWith('/reporting/view');
                });
            });

            describe('back', function() {
                it('should call history back', function() {
                    scope.back();
                    expect(history.path).toBeCalled;
                });
            });

            describe('cancel', function() {
                it('should redirect to list', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    scope.cancel();
                    expect(location.path).toHaveBeenCalledWith('/reporting');
                });
            });
        });
    });
});

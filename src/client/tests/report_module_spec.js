/* global describe it beforeEach inject expect */
define(['angular','angular-mocks', 'report'], function(angular, mocks, Report) {
    describe('Report Module', function() {
        var scope,
            httpBackend,
            mockReportCtrl,
            location,
            deferred,
            mockedFactory,
            ctrl;

        beforeEach(module('mps'));

        describe('ReportController', function() {
            beforeEach(inject(function ($rootScope, $httpBackend, $controller, $location,  Reports, $q){
                scope = $rootScope.$new();
                deferred = $q.defer();
                httpBackend = $httpBackend;
                location = $location;
                mockedFactory = Reports;

                ctrl = $controller('ReportController', {$scope: scope, Reports: mockedFactory});

                mockedFactory.category = {
                    name: 'MADC',
                    _links: {
                        self: {
                            href: 'http://www.lexmark.com'
                        }
                    }
                };
                mockedFactory.category.id = 1;
            }));

            describe('goToFinder', function() {
                it('should redirect to report finder page', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    scope.goToFinder(mockedFactory.category);
                    expect(location.path).toHaveBeenCalledWith('/reporting/' + mockedFactory.category.id + '/results');
                });
            });
        });
        
        describe('ReportFinderController', function() {
            beforeEach(inject(function ($rootScope, $httpBackend, $controller, $location,  Reports, $q){
                scope = $rootScope.$new();
                deferred = $q.defer();
                httpBackend = $httpBackend;
                location = $location;
                mockedFactory = Reports;

                ctrl = $controller('ReportFinderController', {$scope: scope, Reports: mockedFactory});

                mockedFactory.category = {
                    name: 'MADC',
                    _links: {
                        self: {
                            href: 'http://www.lexmark.com'
                        }
                    }
                };
                mockedFactory.category.id = 1;
            }));

            
            describe('runReport', function() {
                it('should redirect to report finder page', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    scope.runReport();
                    expect(location.path).toHaveBeenCalledWith('/reporting/results');
                });

                it('should redirect to report result page', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    scope.finder = {};
                    scope.finder.dateFrom = '2015-01-01';
                    scope.finder.dateTo = '2015-01-01';
                    scope.runReport();
                    expect(location.path).toHaveBeenCalledWith('/reporting/results');
                });
            });
        });

    });
});

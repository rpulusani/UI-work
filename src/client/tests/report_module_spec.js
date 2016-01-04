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

                mockedFactory.reports = [
                {
                    name: 'Asset Register',
                    id: 'mp9058sp',
                    _links: {
                        self: { href: 'https://api.venus-dev.lexmark.com/mps/reports/mp9058sp' },
                        results: { href: 'https://api.venus-dev.lexmark.com/mps/reports/mp9058sp/results' },
                        stats: { href: 'https://api.venus-dev.lexmark.com/mps/reports/mp9058sp/stats' }
                    }
                },
                {
                    name: 'MADC',
                    id: 'mp9073',
                    _links: {
                        self: { href: 'https://api.venus-dev.lexmark.com/mps/reports/mp9073' },
                        results: { href: 'https://api.venus-dev.lexmark.com/mps/reports/mp9073/results' },
                        stats: { href: 'https://api.venus-dev.lexmark.com/mps/reports/mp9073/stats' }
                    }
                },
                {
                    name: 'Missing Meter Reads',
                    id: 'mp0075',
                    _links: {
                        self: { href: 'https://api.venus-dev.lexmark.com/mps/reports/mp0075' },
                        results: { href: 'https://api.venus-dev.lexmark.com/mps/reports/mp0075/results' },
                        stats: { href: 'https://api.venus-dev.lexmark.com/mps/reports/mp0075/stats' }
                    }
                },
                {
                    name: 'Consumables Orders',
                    id: 'mp0021',
                    _links: {
                        self: { href: 'https://api.venus-dev.lexmark.com/mps/reports/mp0021' },
                        results: { href: 'https://api.venus-dev.lexmark.com/mps/reports/mp0021/results' },
                        stats: { href: 'https://api.venus-dev.lexmark.com/mps/reports/mp0021/stats' }
                    }
                },
                {
                    name: 'Hardware Orders',
                    id: 'hw0008',
                    _links: {
                        self: { href: 'https://api.venus-dev.lexmark.com/mps/reports/hw0008' },
                        results: { href: 'https://api.venus-dev.lexmark.com/mps/reports/hw0008/results' },
                        stats: { href: 'https://api.venus-dev.lexmark.com/mps/reports/hw0008/stats' }
                    }
                },
                {
                    name: 'Pages Billed',
                    id: 'pb0001',
                    _links: {
                        self: { href: 'https://api.venus-dev.lexmark.com/mps/reports/pb0001' },
                        results: { href: 'https://api.venus-dev.lexmark.com/mps/reports/pb0001/results' },
                        stats: { href: 'https://api.venus-dev.lexmark.com/mps/reports/pb0001/stats' }
                    }
                },
                {
                    name: 'Hardware Installation Requests',
                    id: 'hw0015',
                    _links: {
                        self: { href: 'https://api.venus-dev.lexmark.com/mps/reports/hw0015' },
                        results: { href: 'https://api.venus-dev.lexmark.com/mps/reports/hw0015/results' },
                        stats: { href: 'https://api.venus-dev.lexmark.com/mps/reports/hw0015/stats' }
                    }
                },
                {
                    name: 'Service Detail Report',
                    id: 'sd0101',
                    _links: {
                        self: { href: 'https://api.venus-dev.lexmark.com/mps/reports/sd0101' },
                        results: { href: 'https://api.venus-dev.lexmark.com/mps/reports/sd0101/results' },
                        stats: { href: 'https://api.venus-dev.lexmark.com/mps/reports/sd0101/stats' }
                    }
                }];

                scope.reports = mockedFactory.reports;

            }));

            describe('goToFinder', function() {
                it('should redirect to report result page', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    var reportItem = scope.reports[0];

                    scope.goToFinder(reportItem);
                    expect(location.path).toHaveBeenCalledWith('/reporting/' + reportItem.id + '/results');
                });
            });

            describe('goToFinderById', function() {
                it('should redirect to report result page', function() {
                    spyOn(location, 'path').and.returnValue('/');
                    var reportItem = scope.reports[1];

                    scope.goToFinderById(reportItem.id);
                    expect(location.path).toHaveBeenCalledWith('/reporting/' + reportItem.id + '/results');
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

            /*
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
            });*/
        });

    });
});

/* global describe it beforeEach inject expect */

describe('Report Module', function() {
    beforeEach(module('mps'));    

    describe('ReportController', function() {
        var scope, ctrl, location, history, mockedFactory;
        beforeEach(function (){
            mockedFactory = {
                query: jasmine.createSpy(),
                getCategoryList: jasmine.createSpy(),
                save: jasmine.createSpy(),
                getById: jasmine.createSpy(),
                getByDefinitionId: jasmine.createSpy(),
                removeById: jasmine.createSpy(),
                groups: jasmine.createSpy(),
                categories: jasmine.createSpy()
            };

            module(function($provide) {
                $provide.value('Report', mockedFactory);
            });
        });
        beforeEach(inject(function($rootScope, $controller, $location, History) {
            scope = $rootScope.$new();
            location = $location;
            history = History;
            ctrl = $controller('ReportController', {$scope: scope});
        }));

        describe('at init', function() {
            describe('when routeParam.definitionId is available', function() {
                beforeEach(inject(function($routeParams, $controller){
                    $routeParams.definitionId = '123';
                    ctrl = $controller('ReportController', {$scope: scope});
                }));
                it('should get reports', function() {
                    expect(mockedFactory.getByDefinitionId.calls.count()).toBe(1);
                });
                it('should get Category by Id', function() {
                    expect(mockedFactory.getById.calls.count()).toBe(1);
                });
            });

            describe('when routeParam.definitionId not available', function() {
                it('should not get reports', function() {
                    expect(mockedFactory.getByDefinitionId.calls.count()).toBe(0);
                });
                it('should not get Category by Id', function() {
                    expect(mockedFactory.getById.calls.count()).toBe(0);
                });
            });
        });

        describe('runReport', function() {
            it('should Add a new report for the specific definition Id', function() {
                var definitionId = '123';
                scope.runReport(definitionId);
                expect(mockedFactory.save.calls.count()).toBe(1);
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
            it('should take to the report submit page based on report category', function() {
                var definitionId = '123';
                spyOn(location, 'path').and.returnValue('/');
                scope.goToRun(definitionId);
                expect(location.path).toHaveBeenCalledWith('/reporting/123/run');
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

    describe('Routes', function(){
        it('should map routes to controllers', function() {
            inject(function($route) {
                expect($route.routes['/reporting'].controller).toBe('ReportController');
                expect($route.routes['/reporting'].templateUrl).toEqual('/app/reporting/templates/reporting-home.html');
            });
        });

         
    });
});

'use strict';
angular.module('mps.report')
.controller('ReportController', ['$scope', '$http', '$location', '$routeParams', 'History', 'Report',
    function($scope, $http, $location, $routeParams, History, Report) {
        $scope.reports = Report.reports;
        $scope.groups = Report.groups;
        $scope.categories = Report.categories;        
        $scope.catagory = "";
        $scope.categoryDesc = "";

        $scope.back = function() {
            History.back();
        };

        $scope.cancel = function(){
            redirect_to_list();
        };

        var redirect_to_list = function() {
            $location.path('/reporting');
        };

        $scope.reportByCategory = function(definitionId) {
            Report.getByDefinitionId(definitionId, function() {
                $scope.reports = Report.reports;
            }); 
        }
        
        $scope.goToReportByCategory = function(definitionId) {
            $location.path('/reporting/' + definitionId + '/view');            
        }

        $scope.goToRun = function(definitionId) {            
            $location.path('/reporting/' + definitionId + '/run');
        }

        $scope.runReport = function(definitionId) {
            var fd = new FormData(document.getElementsByName('newReport')[0]);
            Report.save(fd, function(report) {
                Report.reports = [];
                $scope.reports = Report.reports;

                $location.path('/reporting/' + definitionId + '/view');
            });
        };

        $scope.removeReport = function(id) {
            Report.removeById(id, function() {
                if (Report.reports.length === 0) {
                    $scope.reports = []; 
                }
            });
        };

        if (Report.groups.length === 0) {
            Report.query(function() {
                $scope.groups = Report.groups;
            });
        }

        if (Report.categories.length === 0) {
            Report.getCategoryList(function() {
                $scope.categories = Report.categories;
            });
        }

        if ($routeParams.definitionId) {
            Report.getByDefinitionId($routeParams.definitionId, function() {
                $scope.reports = Report.reports;
            });
            Report.getById($routeParams.definitionId, function() {
                $scope.category = Report.category;
            });
            $scope.currentDate = new Date();
        }
    }
]);

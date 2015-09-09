'use strict';
angular.module('mps.report')
.directive('reportNavigation', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/reporting/templates/report-list.html',
        controller: 'ReportController',
        link: function(scope, el, attr){
                require(['lxk.fef'], function() {
                var $ = require('jquery');
                var sets = $(el).find("[data-js=accordion],[data-collapsable]");
                sets.each(function(i,set){
                    $(set).set({
                        expandable: true,
                        collapsable: true,
                        collapseAll: true
                    });
                });            
            });
        }
    };
});

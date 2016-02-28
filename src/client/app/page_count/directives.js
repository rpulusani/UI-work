

angular.module('mps.pageCount')
.directive('allPageCountTab', function(){
    return {
        restrict: 'A',
        templateUrl : '/app/page_count/templates/tabs/all-page-count-tab.html',
        controller: 'PageCountListController'
    };
})
.directive('missingPageCountTab', function(){
    return {
        restrict: 'A',
        templateUrl : '/app/page_count/templates/tabs/missing-page-count-tab.html',
        controller: 'MissingPageCountListController'
    };
})
.directive('pageCountTabs', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/page_count/templates/page-count-tabs.html',
        controller: 'PageCountTabController',
        link: function(scope, el, attr){
            require(['lxk.fef'], function() {
                var $ = require('jquery'),
                     sets = $(el).find("[data-js=tab], [data-js=set], [data-js=accordion]");
                sets.each(function(i,set){
                    $(set).set({});
                });
            });
        }
    };
});


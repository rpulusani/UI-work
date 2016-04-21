
angular.module('mps.filterSearch')
.directive('gridFilter', function() {
    return {
        restrict: 'A',
        scope:{
            options: '=',
            params: '='
        },
        templateUrl: '/app/filter_search/templates/filter.html',
        controller: 'GridFilterController'
    };
})
.directive('bookmarkFilter', function() {
    return {
        restrict: 'A',
        scope:{
            options: '=',
            title: '@',
            params: '=',
            filterDef: '='
        },
        templateUrl: '/app/filter_search/templates/bookmarkFilter.html',
        controller: 'BookmarkFilterController'
    };
})
.directive('locationFilter', function() {
    return {
        restrict: 'A',
        scope:{
            options: '=',
            title: '@',
            params: '=',
            filterDef: '='
        },
        templateUrl: '/app/filter_search/templates/locationFilter.html',
        controller: 'LocationFilterController'
    };
})
.directive('addressLocationFilter', function() {
    return {
        restrict: 'A',
        scope:{
            options: '=',
            title: '@',
            params: '=',
            filterDef: '='
        },
        templateUrl: '/app/filter_search/templates/addressLocationFilter.html',
        controller: 'LocationFilterController'
    };
})
.directive('chlFilter', function() {
    return {
        restrict: 'A',
        scope:{
            title: '@',
            params:'=',
            filterDef: '=',
            action: '@'
        },
        templateUrl: '/app/filter_search/templates/CHLFilter.html',
        controller: 'CHLFilterController'
    };
})
.directive('categoryFilter', function() {
    return {
        restrict: 'A',
        scope:{
            title: '@',
            params:'=',
            filterDef: '=',
            action: '@'
        },
        templateUrl: '/app/filter_search/templates/categoryFilter.html',
        controller: 'CategoryFilterController'
    };
})
.directive('statusFilter', function() {
    return {
        restrict: 'A',
        scope:{
            title: '@',
            params:'=',
            filterDef: '=',
            action: '@'
        },
        templateUrl: '/app/filter_search/templates/statusFilter.html',
        controller: 'StatusFilterController'
    };
})
.directive('libraryFilter', function() {
    return {
        restrict: 'A',
        scope:{
            title: '@',
            params:'=',
            filterDef: '=',
            action: '@'
        },
        templateUrl: '/app/filter_search/templates/libraryFilter.html',
        controller: 'LibraryFilterController'
    };
})
.directive('orderStatusFilter', function() {
    return {
        restrict: 'A',
        scope:{
            title: '@',
            params:'=',
            filterDef: '=',
            action: '@'
        },
        templateUrl: '/app/filter_search/templates/orderStatusFilter.html',
        controller: 'OrderStatusFilterController'
    };
})
.directive('meterReadTypeFilter', function() {
    return {
        restrict: 'A',
        scope:{
            title: '@',
            params:'=',
            filterDef: '=',
            action: '@'
        },
        templateUrl: '/app/filter_search/templates/meterReadTypeFilter.html',
        controller: 'MeterReadTypeFilterController'
    };
})
.directive('accountFilter', function() {
    return {
        restrict: 'A',
        scope:{
            title: '@',
            params:'=',
            filterDef: '=',
            action: '@'
        },
        templateUrl: '/app/filter_search/templates/accountFilter.html',
        controller: 'AccountFilterController'
    };
})
    .directive('accountAllFilter', function() {
        return {
            restrict: 'A',
            scope:{
                title: '@',
                params:'=',
                filterDef: '=',
                action: '@'
            },
            templateUrl: '/app/filter_search/templates/accountAllFilter.html',
            controller: 'AccountAllFilterController'
        };
    })
.directive('requestStatusFilter', function() {
    return {
        restrict: 'A',
        scope:{
            title: '@',
            params:'=',
            filterDef: '=',
            action: '@',
            statusLevel: '@'
        },
        templateUrl: '/app/filter_search/templates/requestStatusFilter.html',
        controller: 'RequestStatusFilterController'
    };
})
.directive('supplyOrderTypeFilter', function() {
    return {
        restrict: 'A',
        scope:{
            title: '@',
            params:'=',
            filterDef: '=',
            action: '@'
        },
        templateUrl: '/app/filter_search/templates/supplyOrderTypeFilter.html',
        controller: 'SupplyOrderTypeFilterController'
    };
})
.directive('deviceRequestTypeFilter', function() {
    return {
        restrict: 'A',
        scope:{
            title: '@',
            params:'=',
            filterDef: '=',
            action: '@'
        },
        templateUrl: '/app/filter_search/templates/deviceRequestTypeFilter.html',
        controller: 'DeviceRequestTypeFilterController'
    };
})
.directive('invitedStatusFilter', function() {
    return {
        restrict: 'A',
        scope:{
            title: '@',
            params:'=',
            filterDef: '=',
            action: '@'
        },
        templateUrl: '/app/filter_search/templates/invitedStatusFilter.html',
        controller: 'InvitedStatusFilterController'
    };
})
.directive('roleFilter', function() {
    return {
        restrict: 'A',
        scope:{
            title: '@',
            params:'=',
            filterDef: '=',
            action: '@'
        },
        templateUrl: '/app/filter_search/templates/roleFilter.html',
        controller: 'RoleFilterController'
    };
})
.directive('dateRangeFilter', function() {
    return {
        restrict: 'A',
        scope:{
            title: '@',
            params:'=',
            filterDef: '=',
            action: '@'
        },
        templateUrl: '/app/filter_search/templates/dateRangeFilter.html',
        controller: 'DateRangeFilterController'
    };
})
.directive('invoiceDateFilter', function() {
    return {
        restrict: 'A',
        scope:{
            title: '@',
            params:'=',
            filterDef: '=',
            action: '@'
        },
        templateUrl: '/app/filter_search/templates/invoiceDateFilter.html',
        controller: 'InvoiceDateFilterController'
    };
})
.directive('soldToFilter', function() {
    return {
        restrict: 'A',
        scope:{
            title: '@',
            params:'=',
            filterDef: '=',
            action: '@'
        },
        templateUrl: '/app/filter_search/templates/soldToFilter.html',
        controller: 'SoldToFilterController'
    };
})
.directive('allRequestTypes', function() {
    return {
        restrict: 'A',
        scope:{
            title: '@',
            params:'=',
            filterDef: '=',
            action: '@'
        },
        templateUrl: '/app/filter_search/templates/allRequestType.html',
        controller: 'AllRequestTypeFilterController'
    };
})
.directive('gridSearch', function() {
    return {
        restrict: 'A',
        scope: {
            columns: '=',
            params: '=',
            search: '=',
            total: '='
        },
        templateUrl: '/app/filter_search/templates/search.html',
        controller: 'GridSearchController',
        link: function(scope, el, attr){
            scope.setupStyle = function () {
                var $ = require('jquery');
                var filterDiv = $(el).find(".filter--search");
                $(filterDiv).hover(function(){
                    $(this).toggleClass("hover");
                    $(".search-box").toggleClass("hover");
                    $(".search").toggleClass("hover");
                    $(".selectric").toggleClass("hover");
                });
                $(filterDiv).find(".search-box").focus(function(){
                    $(filterDiv).addClass("focus");
                    $(".search-box").addClass("focus");
                    $(".search").addClass("focus");
                    $(".selectric").addClass("focus");
                    $(".form__field-btn").addClass("focus");
                });
                $(filterDiv).find(".search-box").blur(function(){
                    $(filterDiv).removeClass("focus");
                    $(".search-box").removeClass("focus");
                    $(".search").removeClass("focus");
                    $(".selectric").removeClass("focus");
                    $(".form__field-btn").removeClass("focus");
                });
                $(filterDiv).find(".selectric").click(function(){
                    $(".selectricItems").width(filterDiv.width()-1);
                });
                
            };
            scope.setupStyle();
            scope.$on('setUpSearchCss', function(evt){
                scope.setupStyle();
            });
        }
    };
});

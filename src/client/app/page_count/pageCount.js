'use strict';
angular.module('mps.pageCount', []).config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/page_count/update_page_count', {
        templateUrl: '/app/page_count/templates/update-page-count.html'
    });
}]);

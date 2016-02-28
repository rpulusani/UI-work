

angular.module('mps.siebel', []).config(['$routeProvider',
function($routeProvider) {
    $routeProvider
    .when('/siebel', {
        templateUrl: '/app/siebel/templates/view.html',
        controller: 'SiebelListController',
        activeItem: '/siebel'
    })
    .when('/siebel/new', {
        templateUrl: '/app/siebel/templates/new.html',
        controller: 'CreateSiebelValueController',
        activeItem: '/siebel'
    })
    .when('/siebel/review', {
        templateUrl: '/app/siebel/templates/review.html',
        controller: 'ManageSiebelValueController',
        activeItem: '/siebel'
    });
}]);


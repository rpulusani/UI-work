angular.module('mps')
  .config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/service_requests/addresses/new', {
        templateUrl: '/js/service_requests/addresses/new.html',
        controller: 'AddressesController'
    })
    .otherwise({
        templateUrl: '/templates/home.html'
    });
    $locationProvider.html5Mode(true);
}]);

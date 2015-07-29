angular.module('mps')
  .config(['$routeProvider',
    function($routeProvider) {
    $routeProvider
    .when('/service_requests/addresses', {
        templateUrl: '/js/service_requests/addresses/view.html',
        controller: 'AddressesController'
    })
    .when('/service_requests/addresses/delete', {
        templateUrl: '/js/service_requests/addresses/delete.html',
        controller: 'AddressesController'
    })
    .when('/service_requests/addresses/new', {
        templateUrl: '/js/service_requests/addresses/new.html',
        controller: 'AddressesController'
    })
    .otherwise({
        templateUrl: 'home.html'
    });
}]);

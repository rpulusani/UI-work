
angular.module('mps.account', []).config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
        .when('/accounts/pick_account/:source', {
            templateUrl: '/app/accounts/templates/account-picker.html',
            controller: 'AccountPickerController',
            activeItem: '/service_requests/account'
        })
}]);

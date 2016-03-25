
angular.module('mps.serviceRequestAddresses', []).config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
        .when('/service_requests/addresses', {
            templateUrl: '/app/address_service_requests/templates/view.html',
            controller: 'AddressListController'
        })
        .when('/service_requests/addresses/new', {
            templateUrl: '/app/address_service_requests/templates/new.html',
            controller: 'AddressAddController',
            activeItem: '/service_requests/addresses'
        })
        .when('/service_requests/addresses/add/review', {
            templateUrl: '/app/service_requests/templates/review.html',
            controller: 'AddressAddController',
            activeItem: '/service_requests/addresses'
        })
        .when('/service_requests/addresses/add/receipt/:queued', {
            templateUrl: '/app/service_requests/templates/receipt.html',
            controller: 'AddressAddController',
            activeItem: '/service_requests/addresses'
        })
        .when('/service_requests/addresses/new/:return', {
            templateUrl: '/app/device_service_requests/templates/new.html',
            controller: 'AddressAddController',
            activeItem: '/service_requests/addresses'
        })
        .when('/service_requests/addresses/pick_contact/:source', {
            templateUrl: '/app/address_service_requests/templates/contact-picker.html',
            controller: 'ContactPickerController',
            activeItem: '/service_requests/addresses'
        })
        .when('/service_requests/addresses/:id/update', {
            templateUrl: '/app/address_service_requests/templates/update.html',
            controller: 'AddressUpdateController',
            activeItem: '/service_requests/addresses'
        })
        .when('/service_requests/addresses/update/:id/review', {
            templateUrl: '/app/service_requests/templates/review.html',
            controller: 'AddressUpdateController',
            activeItem: '/service_requests/addresses'
        })
        .when('/service_requests/addresses/updates/:id/receipt/:queued', {
            templateUrl: '/app/service_requests/templates/receipt.html',
            controller: 'AddressUpdateController',
            activeItem: '/service_requests/addresses'
        })
        .when('/service_requests/addresses/delete/:id/review', {
            templateUrl: '/app/service_requests/templates/review.html',
            controller: 'AddressDeleteController',
            activeItem: '/service_requests/addresses'
        })
        .when('/service_requests/addresses/pick_account/:source', {
            templateUrl: '/app/utilities/templates/pick-account.html',
            controller: 'AccountPickerController',
            activeItem: '/service_requests/addresses'
        })
        .when('/service_requests/addresses/delete/:id/receipt/:queued', {
            templateUrl: '/app/service_requests/templates/receipt.html',
            controller: 'AddressDeleteController',
            activeItem: '/service_requests/addresses'
        });
    }
]);
